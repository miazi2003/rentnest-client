"use server";


import { register } from "@/app/features/auth/service/auth.service";
import {
    registerState,
    ROLE,
} from "@/app/features/auth/types";
import { registerValidation } from "@/app/features/auth/validations";
import { cookies } from "next/headers";

export async function registerAction(
    prevState: registerState,
    formData: FormData
): Promise<registerState> {
    const role = formData.get("role");

    // if (role !== ROLE.LANDLORD && role !== ROLE.TENANT) {
    //     return {
    //         success: false,
    //         statusCode: 403,
    //         message: "You are not allowed to register with this role.",
    //         data: null,
    //     };
    // }

    const result = registerValidation.safeParse(
        {
            name: formData.get("userName") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            phone: formData.get("phone") as string,
            role,
        }
    )

    if (!result.success) {
        return {
            success: false,
            statusCode: 400,
            message: result.error.issues[0].message,
            data: null,
        };
    }

    const payload = result.data;

    try {
        const result = await register(payload);

        if (!result.ok) {
            return {
                success: false,
                statusCode: result.status,
                message: result.data?.message || "Registration failed",
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
            message: result.data?.message || "Registration successful",
            data: result.data,
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