"use server";

import { TCreatePropertyPayload } from "@/app/dashboard/landlord/types/landlord.types";
import { createProperty } from "../../api/landlord.api";
import { revalidatePath } from "next/cache";
import { propertyPayloadSchema } from "../validations";
import { validationMessage } from "../../shared-validations";

export async function createPropertyAction(payload: TCreatePropertyPayload) {
  try {
    const validated = propertyPayloadSchema.safeParse(payload);
    if (!validated.success) {
      return { ok: false, status: 400, data: null, message: validationMessage(validated.error) };
    }

    const res = await createProperty(validated.data);
    if (res.ok) {
      revalidatePath("/dashboard/landlord/properties");
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to create property",
    };
  }
}
