import { cookies } from "next/headers";
import type { TenantReviewsResponse } from "@/app/features/review/types";

export const getMyReviews = async (page = 1, limit = 10) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        ok: false,
        status: 401,
        data: null,
        message: "Authentication required",
      };
    }

    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");

    const response = await fetch(
      `${baseUrl}/api/reviews/me?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const body = (await response.json().catch(() => null)) as TenantReviewsResponse | null;

    return {
      ok: response.ok,
      status: response.status,
      data: response.ok ? body : null,
      message: body?.message || (response.ok ? "Reviews loaded successfully" : "Unable to load reviews"),
    };
  } catch (error) {
    console.error("Failed to fetch tenant reviews:", error);
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Unable to load reviews",
    };
  }
};

export const createReview = async (payload: {
  propertyId: string;
  rating: number;
  comment: string;
}) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/reviews`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Failed to create review:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const getPropertyReviews = async (propertyId: string) => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/reviews/property/${propertyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Failed to fetch property reviews:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
