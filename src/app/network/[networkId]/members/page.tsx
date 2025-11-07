import { FC } from "react";
import NetworkMembersSection from "@/app/network/[networkId]/members/networkMembers";
import { Member } from "@/types/networkMember";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface NetworkMembersPageProps {
  params: Promise<{ networkId: string }>;
}

const NetworkMembersPage: FC<NetworkMembersPageProps> = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const { networkId } = await params;

  try {
    // دریافت تمام اعضا از ZeroTier Controller
    const fetchNetWorkMembers = async () => {
      const res = await fetch(
        `http://5.57.32.82:8080/controller/network/${networkId}/member`,
        { method: "GET", cache: "no-store" }
      );
      if (!res.ok) throw new Error(`Failed to fetch members: ${res.status}`);
      return res.json();
    };

    // جزئیات هر عضو
    const fetchMemberDetails = async (
      memberId: string
    ): Promise<Member | null> => {
      try {
        const res = await fetch(
          `http://5.57.32.82:8080/controller/network/${networkId}/member/${memberId}`,
          { method: "GET", cache: "no-store" }
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
      memberIds.map((id) => fetchMemberDetails(id))
    );
    const memberDetails = memberDetailsResults.filter(
      (d): d is Member => d !== null
    );

    return (
      <div>
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded">
          <p className="text-sm text-blue-800">
            🔍 DEBUG: Now using dynamic network ID:{" "}
            <span className="font-mono">{networkId}</span>
          </p>
        </div>
        <NetworkMembersSection members={memberDetails} networkId={networkId} />
      </div>
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
