import { NetworkData } from "@/types/networkData";
import NetworkSettingsSection from "@/app/network/[networkId]/settings/networkSettings";

interface NetworkSettingsPageProps {
  params: {
    networkId: string;
  };
}

const NetworkSettingsPage = async ({ params }: NetworkSettingsPageProps) => {
  const { networkId } = params;

  console.log(
    "🔍 DEBUG: Network Settings - Using dynamic network ID:",
    networkId
  );

  const fetchNetworkData = async () => {
    console.log("🔍 DEBUG: Fetching network settings for:", networkId);

    const res = await fetch(
      `http://5.57.32.82:8080/controller/network/${networkId}`,
      {
        method: "GET",
        cache: "no-store",
      }
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
      <div>
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded">
          <p className="text-sm text-blue-800">
            🔍 DEBUG: Now using dynamic network ID:{" "}
            <span className="font-mono">{networkId}</span>
          </p>
        </div>
        <NetworkSettingsSection networkId={networkId} fetchedNetworkData={networkData} />
      </div>
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
