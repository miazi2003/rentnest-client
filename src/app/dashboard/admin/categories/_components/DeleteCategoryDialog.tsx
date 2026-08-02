"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { deleteCategoryAction } from "@/app/features/category/actions/categoryActions";
import { ICategory } from "./CategoryForm";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: ICategory | null;
  onSuccess?: () => void;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  category,
  onSuccess,
}: DeleteCategoryDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!category) return null;
  const categoryId = category.id || category._id;

  const handleDelete = async () => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const res = await deleteCategoryAction(categoryId);
      if (res.ok) {
        toast.success(res.message || "Category deleted successfully!");
        router.refresh();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Failed to delete category.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while deleting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent className="max-w-md rounded-3xl p-6 space-y-5">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800 flex items-center justify-center mx-auto sm:mx-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Delete Category
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              "{category.name}"
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl text-xs font-semibold px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-4 gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Category</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
