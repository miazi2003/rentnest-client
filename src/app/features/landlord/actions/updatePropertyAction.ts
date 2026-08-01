"use server";

import { TCreatePropertyPayload } from "@/app/dashboard/landlord/types/landlord.types";
import { updateProperty } from "../../api/landlord.api";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updatePropertyAction(
  propertyId: string,
  payload: TCreatePropertyPayload
) {
  try {
    const res = await updateProperty(propertyId, payload);
    if (res.ok) {
      revalidatePath("/dashboard/landlord/properties");
      revalidatePath(`/dashboard/landlord/properties/${propertyId}`);
      revalidatePath("/landlord/properties");
      revalidatePath("/properties");
      revalidatePath(`/properties/${propertyId}`);
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
