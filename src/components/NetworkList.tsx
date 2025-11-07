"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSelectedNetwork } from "@/stores/store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NetworkListProps {
  networkList: string[];
}

export default function NetworkList({ networkList }: NetworkListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogNetworkId, setDialogNetworkId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { setSelectedNetworkId } = useSelectedNetwork();
  const router = useRouter();

  const handleNetworkClick = (network: string) => {
    setSelectedNetworkId(network);
  };

  const handleCreateNetwork = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("http://5.57.32.82:8080/controller/network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`Failed to create network ${res.status}`);
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      toast.error(
        `Failed to create network: ${
          (error as any)?.message || "Unknown error"
        }`
      );
    }
  };

  const handleDeleteNetwork = async (networkId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `http://5.57.32.82:8080/controller/network/${networkId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error(`Failed to delete network ${res.status}`);
      setIsLoading(false);
      setIsOpen(false);
      setSelectedNetworkId("");
      router.refresh();
    } catch (error) {
      toast.error(
        `Failed to delete network: ${
          (error as any)?.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Create network:</h2>
      <Button
        disabled={isLoading}
        variant="outline"
        size="sm"
        onClick={handleCreateNetwork}
      >
        Create
      </Button>

      <h2 className="text-xl font-semibold mt-6 mb-4">Available Networks:</h2>

      <div className="space-y-3">
        {networkList.map((network) => (
          <div
            key={network}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-input/50"
          >
            <div className="font-mono text-sm bg-input/50 px-2 py-1 rounded">
              {network}
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

              <Button
                onClick={() => {
                  setDialogNetworkId(network);
                  setIsOpen(true);
                }}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="text-red-400">{dialogNetworkId}</span>?
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-between">
              <DialogClose asChild>
                <Button size="sm">Cancel</Button>
              </DialogClose>
              <Button
                disabled={isLoading}
                onClick={() =>
                  dialogNetworkId && handleDeleteNetwork(dialogNetworkId)
                }
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
