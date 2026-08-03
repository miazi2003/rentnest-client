"use server";

import { getRentalRequestForLandlord } from "../../api/landlord.api";

export async function getIncomingRequestsAction() {
    const response = await getRentalRequestForLandlord();
    const data = response?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.requests)) return data.requests;
    return [];
}
