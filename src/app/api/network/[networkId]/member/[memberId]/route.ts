import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { memberSchima } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ networkId: string; memberId: string }> },
) {
  try {
    const { networkId, memberId } = await context.params;

    // Check if we're looking for local metadata only
    const url = new URL(request.url);
    const localOnly = url.searchParams.get("local") === "true";

    if (localOnly) {
      // Only return local metadata
      const m = await prisma.member.findFirst({
        where: { memberId, networkId },
      });

      if (!m) {
        return NextResponse.json({ found: false }, { status: 404 });
      }

      return NextResponse.json({ found: true, data: m }, { status: 200 });
    }

    // Full member data from controller + local metadata
    const baseUrl = process.env.ZEROTIER_CONTROLLER_URL;
    const token = process.env.ZEROTIER_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ZEROTIER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(
      `${baseUrl}/controller/network/${networkId}/member/${memberId}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch member (${res.status})`);
    }

    const member = await res.json();

    // Get local metadata
    const localMeta = await prisma.member.findFirst({
      where: { memberId, networkId },
      select: { name: true, description: true },
    });

    return NextResponse.json({
      ...member,
      data: localMeta || {},
    });
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to fetch member" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ networkId: string; memberId: string }> },
) {
  try {
    const { networkId, memberId } = await context.params;

    const baseUrl = process.env.ZEROTIER_CONTROLLER_URL;
    const token = process.env.ZEROTIER_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ZEROTIER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(
      `${baseUrl}/controller/network/${networkId}/member/${memberId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to delete member (${res.status})`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting network:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to delete member" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ networkId: string; memberId: string }> },
) {
  try {
    const { networkId, memberId } = await context.params;
    const baseUrl = process.env.ZEROTIER_CONTROLLER_URL;
    const token = process.env.ZEROTIER_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ZEROTIER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();

    // validate incoming payload (name, description, ipAssignments, authorized)
    const member = memberSchima.safeParse(body);
    if (!member.success) {
      return NextResponse.json(
        { success: false, errors: member.error },
        { status: 400 },
      );
    }

    const { name, description, ipAssignments, authorized } = member.data;

    // Validate: if ipAssignments provided, check that none are already assigned to other members in this network
    if (ipAssignments && ipAssignments.length > 0) {
      const existingMembers = await prisma.member.findMany({
        where: {
          networkId,
          memberId: { not: memberId },
        },
        select: { memberId: true },
      });

      // Build a set of IPs assigned to other members by querying the controller
      const usedIps = new Set<string>();
      for (const m of existingMembers) {
        try {
          const resp = await fetch(
            `${baseUrl}/controller/network/${networkId}/member/${m.memberId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          ).then((r) => r.json().catch(() => null));
          if (resp?.ipAssignments) {
            resp.ipAssignments.forEach((ip: string) => usedIps.add(ip));
          }
        } catch (e) {
          // silently skip on fetch error
        }
      }

      // Check if any IP being assigned is already in use
      const conflictingIps = ipAssignments.filter((ip: string) =>
        usedIps.has(ip),
      );
      if (conflictingIps.length > 0) {
        return NextResponse.json(
          {
            error: `IP(s) already assigned to another member: ${conflictingIps.join(
              ", ",
            )}`,
          },
          { status: 400 },
        );
      }
    }

    // Build controller body including only provided fields
    const bodyForZeroDB: any = {};
    if (typeof ipAssignments !== "undefined")
      bodyForZeroDB.ipAssignments = ipAssignments;
    if (typeof authorized !== "undefined")
      bodyForZeroDB.authorized = authorized;

    // Forward update to controller REST API (use POST to update member)
    const controllerRes = await fetch(
      `${baseUrl}/controller/network/${networkId}/member/${memberId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyForZeroDB),
      },
    );

    if (!controllerRes.ok) {
      const errorText = await controllerRes.text();
      throw new Error(
        `Controller update failed (${controllerRes.status}): ${errorText}`,
      );
    }

    const controllerJson = await controllerRes.json().catch(() => null);

    // Ensure local Network record exists so FK constraints won't fail
    await prisma.network.upsert({
      where: { networkId },
      update: {},
      create: { networkId },
    });

    const bodyForLocalDB: any = {};
    if (typeof name !== "undefined") bodyForLocalDB.name = name;
    if (typeof description !== "undefined")
      bodyForLocalDB.description = description;

    // Check for existing local metadata for this member in this network
    const userExist = await prisma.member.findFirst({
      where: { memberId: memberId, networkId },
    });

    let dbResult: any = null;
    if (userExist) {
      // update by internal PK id
      dbResult = await prisma.member.update({
        where: { id: userExist.id },
        data: { ...bodyForLocalDB },
      });
    } else {
      dbResult = await prisma.member.create({
        data: {
          memberId: memberId,
          networkId: networkId,
          ...(bodyForLocalDB.name ? { name: bodyForLocalDB.name } : {}),
          ...(bodyForLocalDB.description
            ? { description: bodyForLocalDB.description }
            : {}),
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Member updated",
        controller: controllerJson,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST member error:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to create member" },
      { status: 500 },
    );
  }
}