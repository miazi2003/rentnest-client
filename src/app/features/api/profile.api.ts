import { cookies } from "next/headers";
import type {
  ChangePasswordPayload,
  ProfileUser,
  UpdateProfilePayload,
} from "@/app/features/profile/types";

interface BackendResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

async function profileRequest<T>(path: string, init: RequestInit = {}) {
  try {
    const token = (await cookies()).get("accessToken")?.value;
    if (!token) return { ok: false, status: 401, data: null as T | null, message: "Authentication required" };

    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");

    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
    });
    const body = (await response.json().catch(() => null)) as BackendResponse<T> | null;

    return {
      ok: response.ok,
      status: response.status,
      data: body?.data ?? null,
      message: body?.message || (response.ok ? "Request completed successfully" : "Profile request failed"),
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null as T | null,
      message: error instanceof Error ? error.message : "Profile request failed",
    };
  }
}

export function getProfileApi() {
  return profileRequest<ProfileUser>("/api/profile", { method: "GET" });
}

export function updateProfileApi(payload: UpdateProfilePayload) {
  return profileRequest<ProfileUser>("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function changePasswordApi(payload: ChangePasswordPayload) {
  return profileRequest<null>("/api/profile/password", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
