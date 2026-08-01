"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to logout",
    };
  }
}
