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

    const baseUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://localhost:5000";

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