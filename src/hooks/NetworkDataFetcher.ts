import { NetworkData } from "@/types/networkData";

const fetchNetworkData = async (): Promise<NetworkData> => {
  const res = await fetch(
    `http://5.57.32.82:8080/controller/network/fc796798fac7d37c`,
    {
      method: "GET",
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }
  return res.json();
};

const NetworkDataFetcher = async () => {
  let networkData: NetworkData | null = null;
  let error: string | null = null;

  try {
    networkData = await fetchNetworkData();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error) {
    return error;
  }

  return networkData;
};

export default NetworkDataFetcher;
