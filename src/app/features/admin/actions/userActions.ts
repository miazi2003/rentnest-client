"use server";

import { revalidatePath } from "next/cache";
import { getUsersList, updateUserStatus } from "../../api/admin.api";
import { adminUserStatusUpdateSchema } from "../validations";
import { validationMessage } from "../../shared-validations";

export async function getUsersAction() {
  try {
    const res = await getUsersList();
    return res;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

export async function updateUserStatusAction(
  userId: string,
  status: "ACTIVE" | "BANNED"
) {
  try {
    const validated = adminUserStatusUpdateSchema.safeParse({ userId, status });

    if (!validated.success) {
      return {
        ok: false,
        status: 400,
        data: null,
        message: validationMessage(validated.error),
      };
    }

    const result = await updateUserStatus(
      validated.data.userId,
      validated.data.status
    );

    if (result.ok) {
      revalidatePath("/dashboard/admin");
      revalidatePath("/dashboard/admin/users");
    }

    return result;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Failed to update user status",
    };
  }
}
