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
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
      const res = await fetch(`${baseUrl}/controller/network`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`Failed to create network ${res.status}`);
      setIsLoading(false);
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast.error(
        `Failed to create network: ${
          (error as any)?.message || "Unknown error"
        }`,
      );
    }
  };

  const handleDeleteNetwork = async (networkId: string) => {
    try {
      setIsLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
      const res = await fetch(`${baseUrl}/controller/network/${networkId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Failed to delete network ${res.status}`);
      setIsLoading(false);
      setIsOpen(false);
      setSelectedNetworkId("");
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast.error(
        `Failed to delete network: ${
          (error as any)?.message || "Unknown error"
        }`,
      );
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await router.refresh();
    setIsLoading(false);
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-input bg-card/90 p-6 shadow-sm shadow-black/5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Your ZeroTier networks
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {networkList.length} network(s) connected
          </h2>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {networkList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-input bg-muted/10 p-8 text-center text-sm text-muted-foreground">
          No networks available.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {networkList.map((network) => (
            <div
              key={network}
              className="rounded-3xl border border-input bg-background p-4 shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-primary/50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Network ID
                  </p>
                  <p className="mt-2 font-mono text-sm text-foreground">
                    {network}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(network);
                      toast.success("Network ID copied");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/network/${network}/members`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNetworkClick(network)}
                  >
                    Members
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
        </div>
      )}

      <div className="rounded-3xl border border-input bg-card/90 p-6 shadow-sm shadow-black/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Create a new network
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Add a network to your ZeroTier controller and manage it directly
              from the dashboard.
            </p>
          </div>
          <Button
            disabled={isLoading}
            variant="secondary"
            onClick={handleCreateNetwork}
          >
            {isLoading ? "Creating..." : "Create network"}
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-destructive">
                {dialogNetworkId}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
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
  );
}
