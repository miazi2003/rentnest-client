import { cookies } from "next/headers";

export async function getUsersList() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        ok: false,
        status: 401,
        data: null,
        message: "User not logged in",
      };
    }

    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");

    const response = await fetch(`${baseUrl}/api/admin/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data,
      message: data?.message ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch users",
    };
  }
}



//get All property
export async function getAllProperty() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        ok: false,
        status: 401,
        data: null,
        message: "User not logged in",
      };
    }

    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");

    const response = await fetch(`${baseUrl}/api/admin/properties`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data,
      message: data?.message ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch Property:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch users",
    };
  }
}


//get all rental request
export const getAllRentalRequest = async() =>{
      try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        ok: false,
        status: 401,
        data: null,
        message: "User not logged in",
      };
    }

    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");

    const response = await fetch(`${baseUrl}/api/admin/rentals`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data,
      message: data?.message ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch Renatls:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch Rentals",
    };
  }
}
