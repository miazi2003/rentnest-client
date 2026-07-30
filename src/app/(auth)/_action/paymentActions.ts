"use server";

import {
  createCheckoutSession,
  verifyPaymentSession,
  getRentalRequestById,
} from "@/app/features/auth/service/auth.service";

export async function handleCreateCheckoutSessionAction(rentalRequestId: string) {
  try {
    // Validate request status on server before proceeding
    if (rentalRequestId) {
      const reqRes = await getRentalRequestById(rentalRequestId);
      const reqData = reqRes?.data?.data ?? reqRes?.data;
      const statusUpper = (reqData?.status || "").toUpperCase();

      if (statusUpper === "ACTIVE" || statusUpper === "COMPLETED") {
        return {
          ok: false,
          status: 400,
          data: null,
          message: "Rental request is already paid and active/completed. Double payment blocked.",
        };
      }
    }

    const result = await createCheckoutSession(rentalRequestId);
    return result;
  } catch (error) {
    console.error("Action error createCheckoutSession:", error);
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

export async function handleVerifyPaymentSessionAction(sessionId: string) {
  try {
    const result = await verifyPaymentSession(sessionId);
    return result;
  } catch (error) {
    console.error("Action error verifyPaymentSession:", error);
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
