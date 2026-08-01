"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { deleteProperty } from "../../api/landlord.api";

export async function deletePropertyAction(propertyId: string) {
  const result = await deleteProperty(propertyId);
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
