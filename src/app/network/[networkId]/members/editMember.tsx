import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Member } from "@/types/networkMember";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface EditMemberProps {
  editData: any;
  setEditingMemberId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditData: React.Dispatch<any>;
  router: AppRouterInstance;
  networkId: string;
  member: Member;
}

const EditMember: FC<EditMemberProps> = ({
  editData,
  setEditData,
  setEditingMemberId,
  networkId,
  router,
  member,
}) => {
  const [editSaving, setEditSaving] = useState(false);

  const handleSaveEdit = async (memberId: string) => {
    if (!editData) return;
    setEditSaving(true);
    try {
      // Build body but only include optional fields when they have data
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

      // ipAssignments: take from ipList array and filter out empty strings
      const ips = (editData.ipList || [])
        .map((ip: string) => (ip ?? "").toString().trim())
        .filter((ip: string) => ip.length > 0);
      if (ips.length > 0) {
        // simple validation for IPv4/CIDR-like entries (basic)
        const invalid = ips.filter((ip: string) => {
          return !/^\d{1,3}(?:\.\d{1,3}){3}(?:\/\d{1,2})?$/.test(ip);
        });
        if (invalid.length > 0) {
          toast.error(`Invalid IPs: ${invalid.join(", ")}`);
          setEditSaving(false);
          return;
        }
        body.ipAssignments = ips;
      }

      // authorized is boolean; include only if it is not undefined
      if (typeof editData.authorized !== "undefined") {
        body.authorized = !!editData.authorized;
      }

      // send update via Next.js API proxy to handle CORS/auth centrally
      const res = await fetch(`/api/network/${networkId}/member/${memberId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Save failed: ${res.status} ${errorText}`);
      }
      toast.success("Member updated");
      setEditingMemberId(null);
      setEditData(null);
      router.refresh();
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message || err}`);
    } finally {
      setEditSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setEditData(null);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setEditData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <>
      <TableRow>
        <TableCell colSpan={7}>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <Input
                  name="name"
                  value={editData?.name ?? ""}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Authorized</label>
                <input
                  type="checkbox"
                  name="authorized"
                  checked={!!editData?.authorized}
                  onChange={handleEditChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  className="w-full p-2 rounded bg-white text-black"
                  value={editData?.description ?? ""}
                  onChange={handleEditChange}
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">IP Assignments</label>
                <div className="space-y-2">
                  {(editData?.ipList || []).map((ip: string, ipIdx: number) => (
                    <div key={ipIdx} className="flex gap-2 items-center">
                      <Input
                        value={ip}
                        onChange={(e) => {
                          const newList = [...(editData.ipList || [])];
                          newList[ipIdx] = e.target.value;
                          setEditData((prev: any) => ({
                            ...prev,
                            ipList: newList,
                          }));
                        }}
                        placeholder="e.g. 192.168.191.1/24"
                        className="flex-1"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newList = editData.ipList.filter(
                            (_: string, idx: number) => idx !== ipIdx
                          );
                          setEditData((prev: any) => ({
                            ...prev,
                            ipList: newList,
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditData((prev: any) => ({
                        ...prev,
                        ipList: [...(prev.ipList || []), ""],
                      }));
                    }}
                  >
                    + Add IP
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Add or remove IP assignments. Empty IPs will be skipped on save.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleSaveEdit(member.id)}
                disabled={editSaving}
              >
                {editSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default EditMember;
