"use server";

import { getUsersList } from "../../api/admin.api";

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
