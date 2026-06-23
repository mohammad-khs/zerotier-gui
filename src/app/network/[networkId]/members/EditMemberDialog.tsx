"use client";

import React, { FC, useState } from "react";
import { Member } from "@/types/networkMember";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EditMemberDialogProps {
  open: boolean;
  member: Member | null;
  onOpenChange: (open: boolean) => void;
  networkId: string;
}

const EditMemberDialog: FC<EditMemberDialogProps> = ({
  open,
  member,
  onOpenChange,
  networkId,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  React.useEffect(() => {
    if (member && open) {
      // Load member data
      (async () => {
        try {
          const res = await fetch(
            `/api/network/${networkId}/member/${member.id}`,
          );
          if (res.ok) {
            const j = await res.json();
            const local = j?.data ?? {};
            setEditData({
              name: local.name ?? (member as any).name ?? "",
              description:
                local.description ?? (member as any).description ?? "",
              ipList: member.ipAssignments || [],
              authorized: !!member.authorized,
            });
          } else {
            setEditData({
              name: (member as any).name ?? "",
              description: (member as any).description ?? "",
              ipList: member.ipAssignments || [],
              authorized: !!member.authorized,
            });
          }
        } catch (err) {
          setEditData({
            name: (member as any).name ?? "",
            description: (member as any).description ?? "",
            ipList: member.ipAssignments || [],
            authorized: !!member.authorized,
          });
        }
      })();
    }
  }, [member, open, networkId]);

  const handleSave = async () => {
    if (!member || !editData) return;
    setLoading(true);

    try {
      const body: any = {};

      if (typeof editData.name === "string" && editData.name.trim() !== "") {
        body.name = editData.name.trim();
      }
      if (
        typeof editData.description === "string" &&
        editData.description.trim() !== ""
      ) {
        body.description = editData.description.trim();
      }

      const ips = (editData.ipList || [])
        .map((ip: string) => (ip ?? "").toString().trim())
        .filter((ip: string) => ip.length > 0);

      if (ips.length > 0) {
        const invalid = ips.filter((ip: string) => {
          return !/^\d{1,3}(?:\.\d{1,3}){3}(?:\/\d{1,2})?$/.test(ip);
        });
        if (invalid.length > 0) {
          toast.error(`Invalid IPs: ${invalid.join(", ")}`);
          setLoading(false);
          return;
        }
        body.ipAssignments = ips;
      }

      if (typeof editData.authorized !== "undefined") {
        body.authorized = !!editData.authorized;
      }

      const res = await fetch(`/api/network/${networkId}/member/${member.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Save failed: ${res.status} ${errorText}`);
      }

      toast.success("Member updated successfully");
      onOpenChange(false);
      router.refresh();
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIP = () => {
    setEditData((prev: any) => ({
      ...prev,
      ipList: [...(prev.ipList || []), ""],
    }));
  };

  const handleRemoveIP = (idx: number) => {
    setEditData((prev: any) => ({
      ...prev,
      ipList: prev.ipList.filter((_: string, i: number) => i !== idx),
    }));
  };

  const handleIPChange = (idx: number, value: string) => {
    setEditData((prev: any) => {
      const newList = [...prev.ipList];
      newList[idx] = value;
      return { ...prev, ipList: newList };
    });
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Edit Member</span>
            <Badge variant="outline" className="font-mono text-xs">
              {member.id.slice(0, 8)}...
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Update member information and network settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Device Name
              </label>
              <Input
                placeholder="e.g. My Laptop"
                value={editData?.name ?? ""}
                onChange={(e) =>
                  setEditData((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                A friendly name to identify this device
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">
                Description
              </label>
              <textarea
                placeholder="Optional description about this device..."
                value={editData?.description ?? ""}
                onChange={(e) =>
                  setEditData((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-semibold block">
                    IP Assignments
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Configure static IP addresses for this member
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddIP}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add IP
                </Button>
              </div>

              <div className="space-y-2">
                {(editData?.ipList || []).length > 0 ? (
                  (editData.ipList || []).map((ip: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder="e.g. 192.168.1.100"
                        value={ip}
                        onChange={(e) => handleIPChange(idx, e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveIP(idx)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic py-4 text-center">
                    No IP assignments yet
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                Supports IPv4 format. You can use CIDR notation (e.g.,
                192.168.1.0/24)
              </p>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <label className="text-sm font-semibold block mb-1">
                    Authorization Status
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Control whether this member can access the network
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!editData?.authorized}
                    onChange={(e) =>
                      setEditData((prev: any) => ({
                        ...prev,
                        authorized: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded border-input cursor-pointer"
                  />
                  <span className="text-sm font-medium">
                    {editData?.authorized ? "Authorized" : "Not Authorized"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> Authorizing a member allows them to join
                and communicate within this network. Unauthorized members can
                request access but cannot use the network until approved.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
