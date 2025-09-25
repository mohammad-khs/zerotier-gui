import { FC } from "react";
import NetworkMembersSection from "./networkMembers";
import { Member } from "@/types/networkMember";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const NetworkMembers: FC = async () => {
  const session = await getServerSession(authOptions);
  console.log("this is session : ", session);

  try {
    const fetchNetWorkMembers = async () => {
      const res = await fetch(
        `http://5.57.32.82:8080/controller/network/${process.env.NEXT_PUBLIC_NETWORK_ID}/member`,
        { method: "GET", cache: "no-store" }
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch members: ${res.status}`);
      }
      const data = await res.json();
      return data;
    };

    const fetchMemberDetails = async (
      memberId: string
    ): Promise<Member | null> => {
      try {
        const res = await fetch(
          `http://5.57.32.82:8080/controller/network/${process.env.NEXT_PUBLIC_NETWORK_ID}/member/${memberId}`,
          { method: "GET", cache: "no-store" }
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch member ${memberId}: ${res.status}`);
        }
        const data: Member = await res.json();
        return data;
      } catch (error) {
        console.error(`Error fetching member ${memberId}:`, error);
        return null;
      }
    };

    const networkMembers = await fetchNetWorkMembers();
    console.log(networkMembers);

    const memberIds = Object.keys(networkMembers);
    const memberDetailsPromises = memberIds.map((id) => fetchMemberDetails(id));
    const memberDetailsResults = await Promise.all(memberDetailsPromises);
    const memberDetails = memberDetailsResults.filter(
      (detail) => detail !== null
    );

    return <NetworkMembersSection members={memberDetails} />;
  } catch (error) {
    console.error("Error loading network members:", error);
    return (
      <div>
        <h2>Error loading network members</h2>
        <p>{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
};

export default NetworkMembers;
