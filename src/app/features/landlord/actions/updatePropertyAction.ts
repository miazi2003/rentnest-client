"use server";

import { TCreatePropertyPayload } from "@/app/dashboard/landlord/types/landlord.types";
import { updateProperty } from "../../api/landlord.api";
import { revalidatePath, revalidateTag } from "next/cache";
import { propertyIdSchema, propertyPayloadSchema } from "../validations";
import { validationMessage } from "../../shared-validations";

export async function updatePropertyAction(
  propertyId: string,
  payload: TCreatePropertyPayload
) {
  try {
    const validatedId = propertyIdSchema.safeParse(propertyId);
    const validatedPayload = propertyPayloadSchema.safeParse(payload);
    if (!validatedId.success) {
      return { ok: false, status: 400, data: null, message: validationMessage(validatedId.error) };
    }
    if (!validatedPayload.success) {
      return { ok: false, status: 400, data: null, message: validationMessage(validatedPayload.error) };
    }

    const res = await updateProperty(validatedId.data, validatedPayload.data);
    if (res.ok) {
      revalidatePath("/dashboard/landlord/properties");
      revalidatePath(`/dashboard/landlord/properties/${validatedId.data}`);
      revalidatePath("/landlord/properties");
      revalidatePath("/properties");
      revalidatePath(`/properties/${validatedId.data}`);
      (revalidateTag as (tag: string) => void)("landlord-properties");
    }
    return res;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to update property",
    };
  }
}
