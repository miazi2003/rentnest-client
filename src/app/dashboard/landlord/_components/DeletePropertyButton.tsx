"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deletePropertyAction } from "@/app/features/landlord/actions/deletePropertyAction";
import { useRouter } from "next/navigation";

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const result = await deletePropertyAction(propertyId);
      if (result?.ok) {
        toast.success(result?.data?.message || "Property Deleted Successfully");
        router.refresh();
      } else {
        toast.error(result?.data?.message || result?.message || "Cannot delete property");
      }
    } catch {
      toast.error("Failed to delete property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      disabled={loading}
      onClick={handleDelete}
      className="rounded-2xl text-xs font-bold gap-1.5 cursor-pointer px-3 py-2 shrink-0"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      Delete
    </Button>
  );
}
