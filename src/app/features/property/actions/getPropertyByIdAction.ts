"use server";

import { getPropertyById } from "@/app/features/api/property.api";

export async function getPropertyByIdAction(id: string) {
  try {
    const result = await getPropertyById(id);

    if (!result || !result.ok) {
      return {
        ok: false,
        status: result?.status || 500,
        data: null,
        message: result?.data?.message || "Failed to fetch property details",
      };
    }

    const property = result?.data?.data ?? result?.data;

    return {
      ok: true,
      status: 200,
      data: property,
    };
  } catch (err) {
    console.error("getPropertyByIdAction error:", err);

    return {
      ok: false,
      status: 500,
      data: null,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
}
