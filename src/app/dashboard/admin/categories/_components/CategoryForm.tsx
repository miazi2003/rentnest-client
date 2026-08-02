"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Tag, Loader2, FileText, CheckCircle2 } from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/features/category/actions/categoryActions";

export interface ICategory {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  createdAt?: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ICategory | null;
  onSuccess?: () => void;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: CategoryFormModalProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id || initialData?._id);
  const categoryId = initialData?.id || initialData?._id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Category description is required.");
      return;
    }

    try {
      setLoading(true);
      const payload = { name: name.trim(), description: description.trim() };

      if (isEditing && categoryId) {
        const res = await updateCategoryAction(categoryId, payload);
        if (res.ok) {
          toast.success(res.message || "Category updated successfully!");
          router.refresh();
          if (onSuccess) onSuccess();
          onClose();
        } else {
          toast.error(res.message || "Failed to update category.");
        }
      } else {
        const res = await createCategoryAction(payload);
        if (res.ok) {
          toast.success(res.message || "Category created successfully!");
          router.refresh();
          if (onSuccess) onSuccess();
          onClose();
        } else {
          toast.error(res.message || "Failed to create category.");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent className="max-w-lg rounded-3xl p-6 space-y-6">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </span>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isEditing ? "Edit Category" : "Create New Category"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            {isEditing
              ? "Update property category details below."
              : "Add a new category for properties across the platform."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
              Category Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. Luxury Villa, Commercial Office"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of property types under this category..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              required
              className="w-full p-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
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
              type="submit"
              disabled={loading}
              className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-5 shadow-sm gap-2 cursor-pointer transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isEditing ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditing ? "Update Category" : "Create Category"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CategoryForm() {
  return null;
}
