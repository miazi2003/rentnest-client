import type { ContactPayload, ContactResponse } from "@/app/features/contact/types";

export async function submitContactMessage(payload: ContactPayload) {
  try {
    const baseUrl = process.env.BACKEND_URL;
    if (!baseUrl) throw new Error("BACKEND_URL is not configured");

    const response = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = (await response.json().catch(() => null)) as ContactResponse | null;

    return {
      ok: response.ok,
      status: response.status,
      data: data?.data ?? null,
      message: data?.message || (response.ok ? "Message submitted successfully" : "Unable to submit message"),
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: null,
      message: error instanceof Error ? error.message : "Unable to submit message",
    };
  }
}
