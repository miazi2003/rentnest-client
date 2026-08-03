import { z } from "zod";
import { ROLE } from "./types";

export const loginValidation = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email").max(254, "Email is too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password is too long"),
});



export const registerValidation = z.object({
  name: z.string().trim().min(3, "Name must contain at least 3 characters").max(80, "Name cannot exceed 80 characters"),

  email: z.string().trim().toLowerCase().email("Invalid email").max(254, "Email is too long"),

  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password is too long"),

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
