"use server";

import { getCurrentUser } from "@/app/features/api/auth.api";

export async function getCurrentUserAction() {
  try {
    const res = await getCurrentUser();
    return res;
  } catch {
    return null;
  }
}
