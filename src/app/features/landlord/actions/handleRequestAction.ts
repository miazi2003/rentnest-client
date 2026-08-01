"use server";

import { revalidatePath } from "next/cache";
import { handleAcceptOrRejectRequest } from "../../api/landlord.api";

export async function handleRequestAction(requestId: string, status: string) {
  try {
    const response = await handleAcceptOrRejectRequest(requestId, status);
    if (response.ok) {
      revalidatePath("/dashboard/landlord/requests");
    }
    return response;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to update request",
    };
  }
}
