"use server";


import { register } from "@/app/features/auth/service/auth.service";
import {
    LoginState,
    RegisterPayload,
    ROLE,
} from "@/app/features/auth/types";

export async function registerAction(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const role = formData.get("role");

    // শুধু LANDLORD এবং TENANT allow
    if (role !== ROLE.LANDLORD && role !== ROLE.TENANT) {
        return {
            success: false,
            statusCode: 403,
            message: "You are not allowed to register with this role.",
            data: null,
        };
    }

    const payload: RegisterPayload = {
        name: formData.get("userName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phone: formData.get("phone") as string,
        role,
    };

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