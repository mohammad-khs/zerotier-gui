"use client";

import React, { FC, useState, useMemo } from "react";
import { Member } from "@/types/networkMember";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import MemberCard from "./MemberCard";
import EditMemberDialog from "./EditMemberDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { Search, Users } from "lucide-react";

interface NetworkMembersSectionProps {
  members: Member[];
  networkId: string;
}

const NetworkMembersSection: FC<NetworkMembersSectionProps> = ({
  members,
  networkId,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "authorized" | "pending"
  >("all");

  // Filter members based on search and status
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member as any).name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        member.address?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "authorized" && member.authorized) ||
        (filterStatus === "pending" && !member.authorized);

      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, filterStatus]);

  const handleToggleAuthorization = async (
    memberId: string,
    authorized: boolean,
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/controller/network/${networkId}/member/${memberId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ authorized }),
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to update member: ${res.status}`);
      }

      toast.success(authorized ? "Member authorized" : "Member access revoked");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update member status");
      console.error(error);
    }
  };

  const authorizedCount = members.filter((m) => m.authorized).length;
  const pendingCount = members.length - authorizedCount;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Network Members</h1>
        </div>
        <p className="text-muted-foreground">
          Manage devices connected to your ZeroTier network
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground font-medium">
            Total Members
          </p>
          <p className="text-3xl font-bold mt-1">{members.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            Authorized
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
            {authorizedCount}
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
            Pending
          </p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All Members
          </Button>
          <Button
            variant={filterStatus === "authorized" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("authorized")}
            className={
              filterStatus === "authorized"
                ? "bg-green-600 hover:bg-green-700"
                : ""
            }
          >
            Authorized
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
            className={
              filterStatus === "pending"
                ? "bg-amber-600 hover:bg-amber-700"
                : ""
            }
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Members Grid */}
      <div>
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onEdit={setEditingMember}
                onDelete={setDeletingMemberId}
                onToggleAuthorization={handleToggleAuthorization}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== "all"
                ? "No members match your filters"
                : "No members yet"}
            </p>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditMemberDialog
        open={!!editingMember}
        member={editingMember}
        onOpenChange={(open) => {
          if (!open) setEditingMember(null);
        }}
        networkId={networkId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        networkId={networkId}
        deletingMemberId={deletingMemberId}
        setDeletingMemberId={setDeletingMemberId}
        onDeleteSuccess={() => router.refresh()}
      />
    </div>
  );
};

export default NetworkMembersSection;
