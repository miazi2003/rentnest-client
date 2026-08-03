"use server";

import { createRentalRequest } from "@/app/features/api/rental.api";
import { createRentalValidation, type CreateRentalInput } from "../validations";
import { validationMessage } from "../../shared-validations";

export async function createRentalAction(payload: CreateRentalInput) {
  try {
    const validated = createRentalValidation.safeParse(payload);
    if (!validated.success) {
      return { ok: false, status: 400, data: null, message: validationMessage(validated.error) };
    }
    const result = await createRentalRequest(validated.data);
    return result;
  } catch (err) {
    return {
      ok: false,
      status: 500,
      message: err instanceof Error ? err.message : "Failed to create rental request",
    };
  }
}
