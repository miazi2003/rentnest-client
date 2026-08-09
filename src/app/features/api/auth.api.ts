import { cookies } from "next/headers";
import {
  FacebookLoginPayload,
  GoogleLoginPayload,
  RegisterPayload,
  SocialAuthResponse,
} from "../auth/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  try {
    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);

    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return { ok: false, status: 500, data: null, message: error instanceof Error ? error.message : "Login failed" };
  }
}

export async function register(payload: RegisterPayload) {
  try {
    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => null);

    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    return { ok: false, status: 500, data: null, message: error instanceof Error ? error.message : "Registration failed" };
  }
}

async function socialLogin(
  endpoint: "/api/auth/google" | "/api/auth/facebook",
  payload: GoogleLoginPayload | FacebookLoginPayload
) {
  try {
    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = (await response.json().catch(() => null)) as SocialAuthResponse | null;

    return {
      ok: response.ok,
      status: response.status,
      data,
      message: data?.message || (response.ok ? "Login successful" : "Social login failed"),
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Social login failed",
    };
  }
}

export function googleLoginApi(credential: string) {
  return socialLogin("/api/auth/google", { credential });
}

export function facebookLoginApi(accessToken: string) {
  return socialLogin("/api/auth/facebook", { accessToken });
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        ok: false,
        status: 401,
        data: null,
        message: "No token found",
      };
    }

    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");
    const response = await fetch(
      `${baseUrl}/api/auth/me`,
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
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Failed to fetch user",
    };
  }
}
