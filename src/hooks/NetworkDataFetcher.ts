import { NetworkData } from "@/types/networkData";

const fetchNetworkData = async (): Promise<NetworkData> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/controller/network/fc796798fac7d37c`,

    {
      cache: "force-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZEROTIER_TOKEN}`,
      },
    },
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
