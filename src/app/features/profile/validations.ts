import { z } from "zod";

export const updateProfileValidation = z.object({
  name: z.string().trim().min(1, "Name cannot be empty"),
  phone: z.string().trim().optional(),
});

export const changePasswordValidation = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });
