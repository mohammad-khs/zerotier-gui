"use client";

import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteConfirmDialogProps {
  networkId: string;
  deletingMemberId: string | null;
  setDeletingMemberId: React.Dispatch<React.SetStateAction<string | null>>;
  onDeleteSuccess: () => void;
}

const DeleteConfirmDialog: FC<DeleteConfirmDialogProps> = ({
  networkId,
  deletingMemberId,
  setDeletingMemberId,
  onDeleteSuccess,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirmDelete = async () => {
    if (!deletingMemberId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/network/${networkId}/member/${deletingMemberId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }

      toast.success("Member removed from network");
      setDeletingMemberId(null);
      onDeleteSuccess();
    } catch (err: any) {
      toast.error(`Failed to delete member: ${err.message || err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={!!deletingMemberId}
      onOpenChange={(open) => {
        if (!open) setDeletingMemberId(null);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-red-100 dark:bg-red-950 p-2.5 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Remove Member</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base mt-4">
            Are you sure you want to remove this member from the network?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 my-2">
          <p className="text-xs text-amber-900 dark:text-amber-100">
            <strong>Warning:</strong> This action cannot be undone. The member
            will lose access to the network immediately.
          </p>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => setDeletingMemberId(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Removing..." : "Remove Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
