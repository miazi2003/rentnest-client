"use server";

import { login } from "@/app/features/auth/service/auth.service";
import { LoginState } from "@/app/features/auth/types";

export async function loginAction(
  prevState: any,
  formData: FormData
) : Promise<LoginState> {
  const payload = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const result = await login(payload);

    if (!result.ok) {
      return {
        success: false,
        statusCode: result.status,
        message: result.data?.message || "Login failed",
        data: null,
      };
    }

    return {
      success: true,
      statusCode: result.status,
      message: result.data?.message || "Logged in successfully",
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Something went wrong",
      data: null,
    };
  }
}