"use server";

import { submitContactMessage } from "@/app/features/api/contact.api";
import type { ContactActionState } from "@/app/features/contact/types";
import { contactValidation } from "@/app/features/contact/validations";

export async function contactAction(payload: unknown): Promise<ContactActionState> {
  const validation = contactValidation.safeParse(payload);
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    return {
      success: false,
      statusCode: 400,
      message: validation.error.issues[0]?.message || "Check the contact form fields",
      data: null,
      errors: Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, value?.[0]])),
    };
  }

  const result = await submitContactMessage({
    ...validation.data,
    subject: validation.data.subject || undefined,
  });

  return {
    success: result.ok,
    statusCode: result.status,
    message: result.message,
    data: result.data,
  };
}
