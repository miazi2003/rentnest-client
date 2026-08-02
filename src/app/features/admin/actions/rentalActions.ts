"use server"

import { getAllRentalRequest } from "../../api/admin.api"

const rentalActions = async () => {
    try {
        const res = await getAllRentalRequest()
        return res
    } catch (error) {
        return {
            ok: false,
            status: 500,
            data: null,
            message: error instanceof Error ? error.message : "Failed to fetch Property",
        };
    }
}

export default rentalActions