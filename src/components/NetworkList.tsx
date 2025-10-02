"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSelectedNetwork } from "@/stores/store";

interface NetworkListProps {
  networkList: string[];
}

export default function NetworkList({ networkList }: NetworkListProps) {
  const { setSelectedNetworkId } = useSelectedNetwork();

  const handleNetworkClick = (network: string) => {
    setSelectedNetworkId(network);
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Available Networks:</h2>
      <div className="space-y-3">
        {networkList.map((network, key) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {network}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/network/${network}/members`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNetworkClick(network)}
                >
                  View Members
                </Button>
              </Link>
              <Link href={`/network/${network}/settings`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNetworkClick(network)}
                >
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
