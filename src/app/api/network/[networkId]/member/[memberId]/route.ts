import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { memberSchima } from "@/lib/validation";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ networkId: string; memberId: string }> }
) {
  try {
    const { networkId, memberId } = await context.params;

    const res = await fetch(
      `http://5.57.32.82:8080/controller/network/${networkId}/member/${memberId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${process.env.ZEROTIER_TOKEN}`, // در صورت نیاز
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to delete member (${res.status}): ${errorText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to delete member" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ networkId: string; memberId: string }> }
) {
  try {
    const { networkId, memberId } = await context.params;
    const body = await request.json();

    // validate incoming payload (name, description, ipAssignments, authorized)
    const member = memberSchima.safeParse(body);
    if (!member.success) {
      return NextResponse.json(
        { success: false, errors: member.error },
        { status: 400 }
      );
    }

    const { name, description, ipAssignments, authorized } = member.data;

    // Build controller body including only provided fields
    const bodyForZeroDB: any = {};
    if (typeof ipAssignments !== "undefined")
      bodyForZeroDB.ipAssignments = ipAssignments;
    if (typeof authorized !== "undefined")
      bodyForZeroDB.authorized = authorized;

    // Forward update to controller REST API (use POST to update member)
    const controllerRes = await fetch(
      `http://5.57.32.82:8080/controller/network/${networkId}/member/${memberId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyForZeroDB),
      }
    );

    if (!controllerRes.ok) {
      const errorText = await controllerRes.text();
      throw new Error(
        `Controller update failed (${controllerRes.status}): ${errorText}`
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
      { status: 200 }
    );
  } catch (error) {
    console.error("POST member error:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to create member" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ networkId: string; memberId: string }> }
) {
  try {
    const { memberId, networkId } = await context.params;
    const m = await prisma.member.findFirst({ where: { memberId, networkId } });
    if (!m) return NextResponse.json({ found: false }, { status: 404 });
    return NextResponse.json({ found: true, data: m }, { status: 200 });
  } catch (err) {
    console.error("GET member error:", err);
    return NextResponse.json({ error: (err as any)?.message || "Error" }, { status: 500 });
  }
}
