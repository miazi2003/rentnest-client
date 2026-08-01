"use server";

import { createRentalRequest } from "@/app/features/auth/service/auth.service";

export async function createRentalAction(payload: {
  propertyId: string;
  startDate: string;
  endDate: string;
}) {
  try {
    const result = await createRentalRequest(payload);
    return result;
  } catch (err) {
    return {
      ok: false,
      status: 500,
      message: err instanceof Error ? err.message : "Failed to create rental request",
    };
  }
}
