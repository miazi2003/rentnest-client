"use server";

import { cookies } from "next/headers";

export async function getDashboardAction() {
  try {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) {
      return {
        ok: false,
        status: 401,
        data: null,
        message: "User not logged in",
      };
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/landlord/dashboard`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
    console.error("Failed to fetch landlord dashboard:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
