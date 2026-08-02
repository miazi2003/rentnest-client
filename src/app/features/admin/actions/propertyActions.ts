"use server"

import { getAllProperty } from "../../api/admin.api"

const PropertyAction = async() => {
  try {
    const res = await getAllProperty();
    return res;
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to fetch Property",
    };
  }
}

export default PropertyAction