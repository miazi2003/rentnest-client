import { cookies } from "next/headers";

export const getRentalRequest = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("User not logged in");
    }

    const fetchPage = (page: number) => fetch(
      `${process.env.BACKEND_URL}/api/rentals?page=${page}&limit=100`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    const response = await fetchPage(1);
    const data = await response.json().catch(() => null);

    if (response.ok && data?.meta?.totalPages > 1 && Array.isArray(data?.data)) {
      const remainingResponses = await Promise.all(
        Array.from({ length: data.meta.totalPages - 1 }, (_, index) => fetchPage(index + 2)),
      );
      const remainingPayloads = await Promise.all(
        remainingResponses.map((pageResponse) => pageResponse.json().catch(() => null)),
      );
      const failedPageIndex = remainingResponses.findIndex((pageResponse) => !pageResponse.ok);
      if (failedPageIndex !== -1) {
        return {
          ok: false,
          status: remainingResponses[failedPageIndex].status,
          data: remainingPayloads[failedPageIndex],
          message: remainingPayloads[failedPageIndex]?.message || "Unable to load all rental requests",
        };
      }
      data.data = [
        ...data.data,
        ...remainingPayloads.flatMap((payload) => Array.isArray(payload?.data) ? payload.data : []),
      ];
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Failed to fetch rentals:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const getRentalRequestById = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/rentals/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Failed to fetch rental request by ID:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const createRentalRequest = async (payload: {
  propertyId: string;
  startDate: string;
  endDate: string;
}) => {
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

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/rentals`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error("Failed to create rental request:", error);

    return {
      ok: false,
      status: 500,
      data: null,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
