import { NetworkData } from "@/types/networkData";
import NetworkSettingsSection from "@/app/network/[networkId]/settings/networkSettings";

interface NetworkSettingsPageProps {
  params: {
    networkId: string;
  };
}

const NetworkSettingsPage = async ({ params }: NetworkSettingsPageProps) => {
  const { networkId } = params;

  const fetchNetworkData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/controller/network/${networkId}`,
      {
        method: "GET",
        cache: "no-store",
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
