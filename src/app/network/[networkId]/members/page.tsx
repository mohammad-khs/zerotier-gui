import { FC } from "react";
import NetworkMembersSection from "@/app/network/[networkId]/members/networkMembers";
import { checkAuth } from "@/lib/utils";


interface NetworkMembersPageProps {
  params: Promise<{ networkId: string }>;
}

const NetworkMembersPage: FC<NetworkMembersPageProps> = async ({ params }) => {
  const { networkId } = await params;
  await checkAuth();

  try {
    // Fetch all members with details from backend API (token is secure on backend)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/network/${networkId}/member`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) throw new Error(`Failed to fetch members: ${res.status}`);
    const membersWithMeta = await res.json();

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
