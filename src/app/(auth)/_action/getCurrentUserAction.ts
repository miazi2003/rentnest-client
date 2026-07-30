"use server";

import { getCurrentUser } from "@/app/features/auth/service/auth.service";

export async function getCurrentUserAction() {
  try {
    const res = await getCurrentUser();
    return res;
  } catch {
    return null;
  }
}
