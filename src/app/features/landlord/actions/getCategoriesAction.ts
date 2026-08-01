"use server";

import { getCategories } from "@/app/features/api/property.api";
import { ICategory } from "@/app/dashboard/landlord/types/landlord.types";

export async function getCategoriesAction(): Promise<ICategory[]> {
  try {
    const res = await getCategories();
    if (res.data) {
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data.data)) return res.data.data;
      if (Array.isArray(res.data.categories)) return res.data.categories;
      if (Array.isArray(res.data.result)) return res.data.result;
      if (Array.isArray(res.data.data?.categories)) return res.data.data.categories;
    }
    return [];
  } catch (error) {
    console.error("getCategoriesAction error:", error);
    return [];
  }
}
