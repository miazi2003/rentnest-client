"use server";

import { revalidatePath } from "next/cache";
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../../api/category.api";
import { categoryIdSchema, categorySchema } from "../validations";
import { validationMessage } from "../../shared-validations";

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
    const validated = categorySchema.safeParse(payload);
    if (!validated.success) {
      return { ok: false, status: 400, data: null, message: validationMessage(validated.error) };
    }
    const res = await createCategoryApi(validated.data);
    if (res.ok) {
      revalidatePath("/dashboard/admin/categories");
      revalidatePath("/properties");
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
    const validatedId = categoryIdSchema.safeParse(id);
    const validatedPayload = categorySchema.safeParse(payload);
    if (!validatedId.success) {
      return { ok: false, status: 400, data: null, message: validationMessage(validatedId.error) };
    }
    if (!validatedPayload.success) {
      return { ok: false, status: 400, data: null, message: validationMessage(validatedPayload.error) };
    }
    const res = await updateCategoryApi(validatedId.data, validatedPayload.data);
    if (res.ok) {
      revalidatePath("/dashboard/admin/categories");
      revalidatePath("/properties");
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
    const validated = categoryIdSchema.safeParse(id);
    if (!validated.success) {
      return { ok: false, status: 400, data: null, message: validationMessage(validated.error) };
    }
    const res = await deleteCategoryApi(validated.data);
    if (res.ok) {
      revalidatePath("/dashboard/admin/categories");
      revalidatePath("/properties");
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
