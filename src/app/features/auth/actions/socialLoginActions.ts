"use server";

import { cookies } from "next/headers";
import { facebookLoginApi, googleLoginApi } from "@/app/features/api/auth.api";
import type { SocialAuthState } from "@/app/features/auth/types";
import { z } from "zod";

const credentialValidation = z.string().trim().min(1, "Authentication credential is required").max(10000);

async function completeSocialLogin(
  request: () => ReturnType<typeof googleLoginApi>
): Promise<SocialAuthState> {
  const result = await request();
  const accessToken = result.data?.data?.accessToken;

  if (!result.ok || !accessToken) {
    return {
      success: false,
      statusCode: result.status,
      message: result.message || "Social login failed",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    success: true,
    statusCode: result.status,
    message: result.message || "Login successful",
  };
}

export async function googleLoginAction(credential: string): Promise<SocialAuthState> {
  const validation = credentialValidation.safeParse(credential);
  if (!validation.success) {
    return { success: false, statusCode: 400, message: validation.error.issues[0].message };
  }
  return completeSocialLogin(() => googleLoginApi(validation.data));
}

export async function facebookLoginAction(accessToken: string): Promise<SocialAuthState> {
  const validation = credentialValidation.safeParse(accessToken);
  if (!validation.success) {
    return { success: false, statusCode: 400, message: validation.error.issues[0].message };
  }
  return completeSocialLogin(() => facebookLoginApi(validation.data));
}
