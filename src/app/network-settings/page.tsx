import { NetworkData } from "@/types/networkData";
import NetworkSettingsSection from "./networkSettings";

const NetworkSettings = async () => {
  const fetchNetworkData = async () => {
    const res = await fetch(
      `http://5.57.32.82:8080/controller/network/${process.env.NEXT_PUBLIC_NETWORK_ID}`,
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

  const networkData = await fetchNetworkData();
  return (
    <>
      <NetworkSettingsSection fetchedNetworkData={networkData} />
    </>
  );
};

export default NetworkSettings;
