"use server";

import { getProperty } from "@/app/features/auth/service/auth.service";

const propertyAction = async () => {
  try {
    const result = await getProperty();

    return {
      ok: true,
      status: 200,
      data: result,
    };
  } catch (err) {
    console.error("propertyAction error:", err);

    return {
      ok: false,
      status: 500,
      data: null,
      message: err instanceof Error ? err.message : "Something went wrong",
    };
  }
};

export default propertyAction;