"use server";

import { getRentalRequestForLandlord } from "../../api/landlord.api";

export async function getIncomingRequestsAction() {
    const response = await getRentalRequestForLandlord()
    const allRequest = response.data?.data;
    return allRequest 
}
