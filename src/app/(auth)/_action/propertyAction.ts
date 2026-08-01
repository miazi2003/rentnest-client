"use server";

import { getProperty } from "@/app/features/auth/service/auth.service";

const propertyAction = async () => {
  try {
    const result = await getProperty();

    if (!result || !result.ok) {
      return {
        ok: false,
        status: result?.status || 500,
        data: [],
        meta: null,
        message: result?.data?.message || "Failed to fetch properties",
      };
    }

    // Safely extract properties array regardless of response nesting
    const rawData = result.data;
    const properties = Array.isArray(rawData?.data)
      ? rawData.data
      : Array.isArray(rawData)
      ? rawData
      : [];

    return {
      ok: true,
      status: 200,
      data: properties,
      meta: rawData?.meta || null,
    };
  } catch (err) {
    console.error("propertyAction error:", err);

    return {
      ok: false,
      status: 500,
      data: [],
      meta: null,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
};

export default propertyAction;