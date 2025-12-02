"use client";

import React, { FC, useState } from "react";
import { Member } from "@/types/networkMember";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import DeleteDialog from "./deleteDialog";
import EditMember from "./editMember";

interface NetworkMembersSectionProps {
  members: Member[];
  networkId: string;
}

const NetworkMembersSection: FC<NetworkMembersSectionProps> = ({
  members,
  networkId,
}) => {
  const router = useRouter();
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const handleAuthorized = async (checked: boolean, memberId: string) => {
    try {
      const res = await fetch(
        `http://5.57.32.82:8080/controller/network/${networkId}/member/${memberId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authorized: checked,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to authorize member: ${res.status} - ${errorText}`
        );
      }

      router.refresh();
    } catch (error) {
      console.error("fetch failed:", error);
    }
  };

  const openEdit = (member: Member) => {
    // load local metadata (name/description) if available, then open editor
    setEditingMemberId(member.id);
    (async () => {
      try {
        const res = await fetch(
          `/api/network/${networkId}/member/${member.id}`
        );
        if (res.ok) {
          const j = await res.json();
          const local = j?.data ?? {};
          setEditData({
            name: local.name ?? (member as any).name ?? "",
            description: local.description ?? (member as any).description ?? "",
            ipList: member.ipAssignments || [],
            authorized: !!member.authorized,
          });
        } else {
          // no local metadata, fallback to controller member fields
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
  };

  const handleDeleteClick = (memberId: string) => {
    setDeletingMemberId(memberId);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Network Members</h2>
      <div>
        <Table className="text-center">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-center">Member ID</TableHead>
              <TableHead className="text-center">Address</TableHead>
              <TableHead className="text-center">IP Assignments</TableHead>
              <TableHead className="text-center">Authorized</TableHead>
              <TableHead className="text-center">Last Authorized</TableHead>
              <TableHead className="text-center">Creation Time</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member: Member) => (
              <React.Fragment key={member.id}>
                <TableRow>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.address}</TableCell>
                  <TableCell>{member.ipAssignments.join(", ")}</TableCell>
                  <TableCell>
                    {member.authorized ? "Yes" : "No"}
                    <Input
                      checked={member.authorized}
                      value={member.authorized ? "on" : "off"}
                      onChange={(e) =>
                        handleAuthorized(e.target.checked, member.id)
                      }
                      type="checkbox"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(member.lastAuthorizedTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(member.creationTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => openEdit(member)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(member.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {editingMemberId === member.id && (
                  <EditMember
                    editData={editData}
                    setEditingMemberId={setEditingMemberId}
                    setEditData={setEditData}
                    router={router}
                    networkId={networkId}
                    member={member}
                  />
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <DeleteDialog
        networkId={networkId}
        deletingMemberId={deletingMemberId}
        setDeletingMemberId={setDeletingMemberId}
        router={router}
      />
    </div>
  );
};

export default NetworkMembersSection;
