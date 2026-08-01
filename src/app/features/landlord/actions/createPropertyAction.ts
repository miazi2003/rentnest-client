"use server";

import { TCreatePropertyPayload } from "@/app/dashboard/landlord/types/landlord.types";
import { createProperty } from "../../api/landlord.api";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createPropertyAction(payload: TCreatePropertyPayload) {
  try {
    const res = await createProperty(payload);
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
