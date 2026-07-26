import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET(
  request: NextRequest,
  context: { params: Promise<{ networkId: string }> },
) {

  try {
    const { networkId } = await context.params;
    const baseUrl =
      process.env.ZEROTIER_CONTROLLER_URL;
    const token = process.env.ZEROTIER_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "ZEROTIER_TOKEN is not configured" },
        { status: 500 },
      );
    }

    const res = await fetch(
      `${baseUrl}/controller/network/${networkId}/member`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch members (${res.status})`);
    }

    const members = await res.json();

    // Get all local metadata
    const localMembers = await prisma.member.findMany({
      where: { networkId },
      select: { memberId: true, name: true, description: true },
    });
    const localMetaById = new Map(
      localMembers.map((local) => [local.memberId, local]),
    );

    // Fetch detailed info for each member and merge with local metadata
    const memberIds = Object.keys(members);
    const memberDetails = await Promise.all(
      memberIds.map(async (id) => {
        try {
          const memberRes = await fetch(
            `${baseUrl}/controller/network/${networkId}/member/${id}`,
            {
              cache: "no-store",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (!memberRes.ok) return null;
          const member = await memberRes.json();
          const localMeta = localMetaById.get(id);
          return {
            ...member,
            ...(localMeta?.name ? { name: localMeta.name } : {}),
            ...(localMeta?.description
              ? { description: localMeta.description }
              : {}),
          };
        } catch (e) {
          return null;
        }
      }),
    );

    return NextResponse.json(memberDetails.filter((m) => m !== null));
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: (error as any)?.message || "Failed to fetch members" },
      { status: 500 },
    );
  }
}
