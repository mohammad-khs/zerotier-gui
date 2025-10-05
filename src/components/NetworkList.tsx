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
  DialogTrigger,
} from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import toast from "react-hot-toast";

interface NetworkListProps {
  networkList: string[];
}

export default function NetworkList({ networkList }: NetworkListProps) {
  const { setSelectedNetworkId } = useSelectedNetwork();

  const handleNetworkClick = (network: string) => {
    setSelectedNetworkId(network);
  };

  const handleCreateNetwork = async () => {
    try {
      const res = await fetch("http://5.57.32.82:8080/controller/network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`Failed to create network ${res.status}`);
      }
    } catch (error) {
      toast.error(
        `Failed to create network: ${
          (error as any)?.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Create network:</h2>
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => handleCreateNetwork()}
      >
        create
      </Button>
      <h2 className="text-xl font-semibold mb-4">Available Networks:</h2>
      <div className="space-y-3">
        {networkList.map((network, key) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-input/50"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"destructive"} size={"sm"}>
                  delete
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogDescription>Alert</DialogDescription>
                <DialogHeader>
                  <DialogTitle className="font-semibold">
                    <p className=" mb-4">
                      Are sure you want to delete network{" "}
                      <span className="text-red-400">{network}</span> ?
                    </p>
                  </DialogTitle>
                </DialogHeader>

                <div className="flex justify-between align-middle">
                  <DialogClose asChild>
                    <Button>Cancel</Button>
                  </DialogClose>
                  <Button variant={"destructive"} size={"sm"}>
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-3">
              <div className="font-mono text-sm bg-input/50 px-2 py-1 rounded">
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
