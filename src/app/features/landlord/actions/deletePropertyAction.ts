"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { deleteProperty } from "../../api/landlord.api";
import { propertyIdSchema } from "../validations";
import { validationMessage } from "../../shared-validations";

export async function deletePropertyAction(propertyId: string) {
  const validated = propertyIdSchema.safeParse(propertyId);
  if (!validated.success) {
    return { ok: false, status: 400, data: null, message: validationMessage(validated.error) };
  }
  const result = await deleteProperty(validated.data);
  if (result.ok) {
    revalidatePath("/landlord/properties");
    revalidatePath("/dashboard/landlord/properties");
    revalidatePath("/dashboard/landlord/requests");
    revalidatePath("/dashboard/tenant");
    revalidatePath("/properties");
    (revalidateTag as (tag: string) => void)("landlord-requests");
    (revalidateTag as (tag: string) => void)("landlord-properties");
  }
  return result;
}
