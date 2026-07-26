import { NetworkData } from "@/types/networkData";

const fetchNetworkData = async (networkId: string): Promise<NetworkData> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/network/${networkId}`, {
    cache: "no-store",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }
  return res.json();
};

const NetworkDataFetcher = async (networkId: string) => {
  let networkData: NetworkData | null = null;
  let error: string | null = null;

  try {
    networkData = await fetchNetworkData(networkId);
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error) {
    return error;
  }

  return networkData;
};

export default NetworkDataFetcher;
