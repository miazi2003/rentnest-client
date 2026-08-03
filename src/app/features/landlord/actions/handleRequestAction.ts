"use server";

import { revalidatePath } from "next/cache";
import { handleAcceptOrRejectRequest } from "../../api/landlord.api";
import { rentalRequestStatusSchema } from "../validations";
import { validationMessage } from "../../shared-validations";

export async function handleRequestAction(requestId: string, status: string) {
  try {
    const validated = rentalRequestStatusSchema.safeParse({ requestId, status });
    if (!validated.success) {
      return { ok: false, status: 400, data: null, message: validationMessage(validated.error) };
    }
    const response = await handleAcceptOrRejectRequest(validated.data.requestId, validated.data.status);
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
