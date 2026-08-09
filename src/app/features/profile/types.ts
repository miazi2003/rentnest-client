import type { IUser } from "@/app/features/auth/types";

export interface ProfileUser extends IUser {
  provider?: "LOCAL" | "GOOGLE" | "FACEBOOK";
}

export interface UpdateProfilePayload {
  name: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileActionResult<T = null> {
  ok: boolean;
  status: number;
  data: T;
  message: string;
  errors?: Record<string, string>;
}
