"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../api/category.api";

export async function getCategoriesAction() {
  try {
    const res = await getCategoriesApi();
    return res;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}

export async function createCategoryAction(payload: {
  name: string;
  description: string;
}) {
  try {
    const res = await createCategoryApi(payload);
    if (res.ok) {
      revalidatePath("/dashboard/admin/categories");
      revalidatePath("/properties");
      (revalidateTag as (tag: string) => void)("categories");
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

export async function updateCategoryAction(
  id: string,
  payload: { name: string; description: string }
) {
  try {
    const res = await updateCategoryApi(id, payload);
    if (res.ok) {
      revalidatePath("/dashboard/admin/categories");
      revalidatePath("/properties");
      (revalidateTag as (tag: string) => void)("categories");
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const res = await deleteCategoryApi(id);
    if (res.ok) {
      revalidatePath("/dashboard/admin/categories");
      revalidatePath("/properties");
      (revalidateTag as (tag: string) => void)("categories");
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
