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
import { useEffect, useMemo, useState } from "react";
import { Users2Icon, SquareTerminal, Trash2Icon } from "lucide-react";

interface NetworkListProps {
  networkList: string[];
}

type NetworkInfo = {
  id: string;
  name?: string | null;
};

export default function NetworkList({ networkList }: NetworkListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dialogNetworkId, setDialogNetworkId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { setSelectedNetworkId } = useSelectedNetwork();
  const router = useRouter();
  const [networks, setNetworks] = useState<NetworkInfo[]>([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

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

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) return;
      try {
        const results = await Promise.all(
          networkList.map(async (id) => {
            try {
              const res = await fetch(`${baseUrl}/controller/network/${id}`);
              if (!res.ok) return { id, name: null };
              const json = await res.json().catch(() => null);
              // try common shapes, fallback to id
              const name =
                json?.name ?? json?.config?.name ?? json?.network?.name ?? null;
              return { id, name } as NetworkInfo;
            } catch (e) {
              return { id, name: null } as NetworkInfo;
            }
          }),
        );
        if (mounted) setNetworks(results);
      } catch (e) {
        // ignore
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [networkList]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = networks.slice();
    if (q) {
      return list.filter((n) => (n.name || n.id).toLowerCase().includes(q));
    }
    return list.sort((a, b) => {
      const aKey = (a.name || a.id).toLowerCase();
      const bKey = (b.name || b.id).toLowerCase();
      return sortAsc ? aKey.localeCompare(bKey) : bKey.localeCompare(aKey);
    });
  }, [networks, search, sortAsc]);

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

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <input
            placeholder="Search by name or id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground sm:w-64"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortAsc(!sortAsc)}
          >
            {sortAsc ? "A → Z" : "Z → A"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {networks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-input bg-muted/10 p-8 text-center text-sm text-muted-foreground">
          No networks available.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((network) => (
            <div
              key={network.id}
              className="rounded-3xl border border-input bg-background p-4 shadow-sm shadow-black/5 transition hover:-translate-y-0.5 hover:border-primary/50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {network.name ? "Network" : "Network ID"}
                  </p>
                  <p className="mt-2 text-sm text-foreground">
                    {network.name ? (
                      <span className="font-medium">{network.name}</span>
                    ) : null}
                    <span
                      className={
                        network.name
                          ? "ml-2 font-mono text-sm text-muted-foreground"
                          : "font-mono text-sm text-foreground"
                      }
                    >
                      {network.id}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(network.id);
                      toast.success("Network ID copied");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Link href={`/network/${network.id}/members`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNetworkClick(network.id)}
                    title="Members"
                  >
                    <Users2Icon className="h-4 w-4" />
                    <span className="hidden md:inline ml-2">Members</span>
                  </Button>
                </Link>

                <Link href={`/network/${network.id}/settings`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleNetworkClick(network.id)}
                    title="Settings"
                  >
                    <SquareTerminal className="h-4 w-4" />
                    <span className="hidden md:inline ml-2">Settings</span>
                  </Button>
                </Link>

                <Button
                  onClick={() => {
                    setDialogNetworkId(network.id);
                    setIsOpen(true);
                  }}
                  variant="destructive"
                  size="sm"
                  title="Delete"
                >
                  <Trash2Icon className="h-4 w-4" />
                  <span className="hidden md:inline ml-2">Delete</span>
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
