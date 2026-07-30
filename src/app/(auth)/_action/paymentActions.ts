"use server";

import {
  createCheckoutSession,
  verifyPaymentSession,
} from "@/app/features/auth/service/auth.service";

export async function handleCreateCheckoutSessionAction(rentalRequestId: string) {
  try {
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
