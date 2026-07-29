import { z } from "zod";
import { ROLE } from "./types";

export const loginValidation = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});



export const registerValidation = z.object({
  name: z.string().min(3, "Name is required"),

  email: z.email("Invalid email"),

  password: z.string().min(8, "Password must be at least 8 characters"),

   phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Invalid phone number"),

  role: z
    .nativeEnum(ROLE)
    .refine(
      (role) => role === ROLE.LANDLORD || role === ROLE.TENANT,
      {
        message: "You are not allowed to register with this role.",
      }
    ),
});