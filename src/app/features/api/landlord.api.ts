import { cookies } from "next/headers";

export const getMyProperties = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/landlord/properties`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: {
          tags: ["landlord-properties"],
        },
      }
    );

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Failed to fetch properties:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

//get rentel request for landlord

export const getRentalRequestForLandlord = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/landlord/requests`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "force-cache",
        next: {
          tags: ["landlord-requests"],
        },
      }
    );

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Failed to fetch requests:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
};


// handle approve or reject request

export const handleAcceptOrRejectRequest = async(requestId : string , status : string) =>{
try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/landlord/requests/${requestId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Failed to Patch :", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
}