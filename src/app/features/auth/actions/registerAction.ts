"use server";

import { register } from "@/app/features/api/auth.api";
import {
  registerState,
  ROLE,
} from "@/app/features/auth/types";
import { registerValidation } from "@/app/features/auth/validations";

export async function registerAction(
  prevState: registerState,
  formData: FormData
): Promise<registerState> {
  const roleValue = (formData.get("role") as string) || "TENANT";

  const validatedFields = registerValidation.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    role: roleValue as ROLE,
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
    const result = await register(validatedFields.data);

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
      data: result.data.data,
    };
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Something went wrong during registration",
      data: null,
    };
  }
}
