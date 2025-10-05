"use client";

import { FC, useState } from "react";
import { Member } from "@/types/networkMember";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface NetworkMembersSectionProps {
  members: Member[];
  networkId: string;
}

const NetworkMembersSection: FC<NetworkMembersSectionProps> = ({
  members,
  networkId,
}) => {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const handleDeleteMember = async (memberId: string) => {
    try {
      const res = await fetch(`/api/network/${networkId}/member/${memberId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete member ${res.status}`);
      }
      toast.success("Member deleted successfully");
      console.log("delete response : ", res);
      router.refresh();
    } catch (error) {
      toast.error(
        `Failed to delete member: ${(error as any)?.message || "Unknown error"}`
      );
    }
  };

  const handleAuthoirzed = async (checked: boolean, memberId: string) => {
    try {
      if (checked) {
        const res = await fetch(
          `http://5.57.32.82:8080/controller/network/${networkId}/member/${memberId}`,
          {
            method: "POST",

            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to delete member ${res.status}`);
        }
      } else {
        const res = await fetch(
          `http://5.57.32.82:8080/controller/network/${networkId}/member/${memberId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) {
          throw new Error(`Failed to delete member ${res.status}`);
        }
      }
      router.refresh();
    } catch (error) {
      console.error("fetch failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Network Members</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Member ID</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">IP Assignments</th>
              <th className="py-2 px-4 border-b">Authorized</th>
              <th className="py-2 px-4 border-b">Last Authorized</th>
              <th className="py-2 px-4 border-b">Creation Time</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{member.id}</td>
                <td className="py-2 px-4 border-b">{member.address}</td>
                <td className="py-2 px-4 border-b">
                  {member.ipAssignments.join(", ")}
                </td>
                <td className="py-2 px-4 border-b">
                  {member.authorized ? "Yes" : "No"}
                  <Input
                    checked={member.authorized}
                    value={member.authorized ? "on" : "off"}
                    onChange={(e) =>
                      handleAuthoirzed(e.target.checked, member.id)
                    }
                    type="checkbox"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(member.lastAuthorizedTime).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(member.creationTime).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NetworkMembersSection;
