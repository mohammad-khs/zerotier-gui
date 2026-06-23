import { FC } from "react";
import NetworkMembersSection from "@/app/network/[networkId]/members/networkMembers";
import { Member } from "@/types/networkMember";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

interface MemberWithMeta extends Member {
  name?: string;
  description?: string;
}

interface NetworkMembersPageProps {
  params: Promise<{ networkId: string }>;
}

const NetworkMembersPage: FC<NetworkMembersPageProps> = async ({ params }) => {
  const { networkId } = await params;
  const session = await getServerSession(authOptions);
  const isAuthenticated = session?.user?.id && session?.user?.username;

  try {
    if (!isAuthenticated) return <h1 className="text-2xl">not allowed</h1>;
    // دریافت تمام اعضا از ZeroTier Controller
    const fetchNetWorkMembers = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/controller/network/${networkId}/member`,
        { method: "GET", cache: "no-store" },
      );
      if (!res.ok) throw new Error(`Failed to fetch members: ${res.status}`);
      return res.json();
    };

    // جزئیات هر عضو
    const fetchMemberDetails = async (
      memberId: string,
    ): Promise<Member | null> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/controller/network/${networkId}/member/${memberId}`,
          { method: "GET", cache: "no-store" },
        );
        if (!res.ok) throw new Error(`Failed to fetch member ${memberId}`);
        return res.json();
      } catch (error) {
        console.error(`❌ Error fetching member ${memberId}:`, error);
        return null;
      }
    };

    const networkMembers = await fetchNetWorkMembers();
    const memberIds = Object.keys(networkMembers);

    const memberDetailsResults = await Promise.all(
      memberIds.map((id) => fetchMemberDetails(id)),
    );
    const memberDetails = memberDetailsResults.filter(
      (d): d is Member => d !== null,
    );

    // Fetch local metadata for members saved in the database
    const localMembers = await prisma.member.findMany({
      where: { networkId },
      select: { memberId: true, name: true, description: true },
    });
    const localMetaById = new Map(
      localMembers.map((local) => [local.memberId, local]),
    );

    const membersWithMeta: MemberWithMeta[] = memberDetails.map((member) => {
      const localMeta = localMetaById.get(member.id);
      return {
        ...member,
        ...(localMeta?.name ? { name: localMeta.name } : {}),
        ...(localMeta?.description
          ? { description: localMeta.description }
          : {}),
      };
    });

    return (
      <NetworkMembersSection members={membersWithMeta} networkId={networkId} />
    );
  } catch (error) {
    console.error("Error loading network members:", error);
    return (
      <div>
        <h2>Error loading network members for network: {networkId}</h2>
        <p>{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
};

export default NetworkMembersPage;
