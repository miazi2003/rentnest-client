"use server";

import { getMyProperties } from "../../api/landlord.api";

export async function getMyPropertiesAction() {
  const result = await getMyProperties();
  if (!result.ok) {
    throw new Error(result.message || "Unable to load landlord properties");
  }
  const data = result?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.properties)) return data.properties;
  return [];
}
