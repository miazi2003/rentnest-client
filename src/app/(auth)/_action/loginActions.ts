"use server";

import { login } from "@/app/features/auth/service/auth.service";
import { LoginState } from "@/app/features/auth/types";
import { loginValidation } from "@/app/features/auth/validations";

export async function loginAction(
    prevState: any,
    formData: FormData
): Promise<LoginState> {
    const result = loginValidation.safeParse(
        {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        }
    )

    if(!result.success){
          return {
    success: false,
    statusCode: 400,
    message: result.error.issues[0].message,
    data: null,
  }; 
    }

    const payload = result.data;

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