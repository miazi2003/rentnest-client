import { cookies } from "next/headers";
import { RegisterPayload } from "../types";
import { NextResponse } from "next/server";

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}


export async function register(payload: RegisterPayload) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();


  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function getCurrentUser() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

// Tenant Role

// get rental

export const getRentalRequest = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/rentals`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // optional
      }
    );

    const data = await response.json();

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

//get properties

export const getPaymentHistory = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      throw new Error("User not logged in");
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/payments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store", // optional
      }
    );

    const data = await response.json();

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
