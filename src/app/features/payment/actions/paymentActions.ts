"use server";

import {
  createCheckoutSession,
  verifyPaymentSession,
} from "@/app/features/api/payment.api";
import { getRentalRequestById } from "@/app/features/api/rental.api";
import {
  createCheckoutSessionValidation,
  verifyPaymentSessionValidation,
} from "@/app/features/payment/validations";

export async function handleCreateCheckoutSessionAction(rentalRequestId: string) {
  try {
    // 1. Zod schema validation
    const validated = createCheckoutSessionValidation.safeParse({
      rentalRequestId,
    });

    if (!validated.success) {
      return {
        ok: false,
        status: 400,
        message: validated.error.issues[0]?.message || "Invalid rentalRequestId",
        data: null,
      };
    }

    // 2. Execute service call
    const result = await createCheckoutSession(validated.data.rentalRequestId);
    return result;
  } catch (error) {
    console.error("Action error createCheckoutSession:", error);
    return {
      ok: false,
      status: 500,
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }
}

export async function handleVerifyPaymentSessionAction(sessionId: string) {
  try {
    // 1. Zod schema validation
    const validated = verifyPaymentSessionValidation.safeParse({ sessionId });

    if (!validated.success) {
      return {
        ok: false,
        status: 400,
        message: validated.error.issues[0]?.message || "Invalid sessionId",
        data: null,
      };
    }

    // 2. Execute service call
    const result = await verifyPaymentSession(validated.data.sessionId);

    // If verification success, fetch updated rental request details
    if (result.ok && result.data?.rentalRequestId) {
      const rentalDetail = await getRentalRequestById(result.data.rentalRequestId);
      return {
        ...result,
        data: {
          ...result.data,
          rentalRequest: rentalDetail.ok ? rentalDetail.data : null,
        },
      };
    }

    return result;
  } catch (error) {
    console.error("Action error verifyPaymentSession:", error);
    return {
      ok: false,
      status: 500,
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }
}
