"use server";

import { getRentalRequestForLandlord } from "../../api/landlord.api";

export async function getIncomingRequestsAction() {
    const response = await getRentalRequestForLandlord();
    if (!response.ok) {
      throw new Error(response.message || "Unable to load incoming rental requests");
    }
    const data = response?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.requests)) return data.requests;
    return [];
}
