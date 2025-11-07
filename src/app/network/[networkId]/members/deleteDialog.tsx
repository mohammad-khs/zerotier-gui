import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { FC } from "react";
import toast from "react-hot-toast";

interface DeleteDialogProps {
  networkId: string;
  deletingMemberId: string | null;
  setDeletingMemberId: React.Dispatch<React.SetStateAction<string | null>>;
  router: AppRouterInstance;
}

const DeleteDialog: FC<DeleteDialogProps> = ({
  networkId,
  deletingMemberId,
  setDeletingMemberId,
  router,
}) => {

  const confirmDelete = async () => {
    if (!deletingMemberId) return;
    try {
      const res = await fetch(
        `/api/network/${networkId}/member/${deletingMemberId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      toast.success("Member deleted");
      setDeletingMemberId(null);
      router.refresh();
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message || err}`);
    }
  };

  return (
    <>
      <Dialog
        open={!!deletingMemberId}
        onOpenChange={(open) => {
          if (!open) setDeletingMemberId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setDeletingMemberId(null)}>
              Cancel
            </Button>
          </DialogFooter>
          <DialogClose />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteDialog;
