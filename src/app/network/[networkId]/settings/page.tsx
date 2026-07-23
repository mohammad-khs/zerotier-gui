import { NetworkData } from "@/types/networkData";
import NetworkSettingsSection from "@/app/network/[networkId]/settings/networkSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface NetworkSettingsPageProps {
  params: {
    networkId: string;
  };
}

const NetworkSettingsPage = async ({ params }: NetworkSettingsPageProps) => {
  const { networkId } = await params;
  const session = await getServerSession(authOptions);
  const isAuthenticated = session?.user?.id && session?.user?.username;

  if (!isAuthenticated) {
    return <h1 className="text-2xl">not allowed</h1>;
  }

  const fetchNetworkData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/controller/network/${networkId}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ZEROTIER_TOKEN}`,
        },
      },
    );

    const networkData: NetworkData = await res.json();

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    return networkData;
  };

  try {
    const networkData = await fetchNetworkData();
    return (
      <NetworkSettingsSection
        networkId={networkId}
        fetchedNetworkData={networkData}
      />
    );
  } catch (error) {
    return (
      <div>
        <h2>Error loading network settings for network: {networkId}</h2>
        <p>{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
};

export default NetworkSettingsPage;
