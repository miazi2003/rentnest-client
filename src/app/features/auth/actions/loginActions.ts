"use server";

import { cookies } from "next/headers";
import { login } from "@/app/features/api/auth.api";
import { LoginState } from "@/app/features/auth/types";
import { loginValidation } from "@/app/features/auth/validations";

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const validatedFields = loginValidation.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      statusCode: 400,
      message: validatedFields.error.issues[0].message,
      data: null,
    };
  }

  try {
    const result = await login(validatedFields.data);

    if (!result.ok) {
      return {
        success: false,
        statusCode: result.status,
        message: result.data?.message || "Login failed",
        data: null,
      };
    }

    // Save cookie in Next.js
    const cookieStore = await cookies();

    cookieStore.set("accessToken", result.data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      statusCode: result.status,
      message: result.data?.message || "Login successful",
      data: result.data.data.user,
    };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Something went wrong",
      data: null,
    };
  }
}
