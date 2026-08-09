"use server";

import { revalidatePath } from "next/cache";
import { changePasswordApi, updateProfileApi } from "@/app/features/api/profile.api";
import type {
  ChangePasswordPayload,
  ProfileActionResult,
  ProfileUser,
  UpdateProfilePayload,
} from "@/app/features/profile/types";
import {
  changePasswordValidation,
  updateProfileValidation,
} from "@/app/features/profile/validations";

function fieldErrors(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).map(([field, messages]) => [field, messages?.[0] || "Invalid value"]),
  );
}

export async function updateProfileAction(payload: UpdateProfilePayload): Promise<ProfileActionResult<ProfileUser | null>> {
  const validation = updateProfileValidation.safeParse(payload);
  if (!validation.success) {
    return {
      ok: false,
      status: 400,
      data: null,
      message: validation.error.issues[0]?.message || "Check the profile fields",
      errors: fieldErrors(validation.error),
    };
  }

  const result = await updateProfileApi(validation.data);
  if (result.ok) revalidatePath("/dashboard/profile");
  return result;
}

export async function changePasswordAction(payload: ChangePasswordPayload): Promise<ProfileActionResult> {
  const validation = changePasswordValidation.safeParse(payload);
  if (!validation.success) {
    return {
      ok: false,
      status: 400,
      data: null,
      message: validation.error.issues[0]?.message || "Check the password fields",
      errors: fieldErrors(validation.error),
    };
  }

  return changePasswordApi(validation.data);
}
