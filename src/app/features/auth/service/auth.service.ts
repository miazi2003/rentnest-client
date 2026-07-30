import { RegisterPayload } from "../types";

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}


export async function register(payload: RegisterPayload) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export async function getCurrentUser() {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/auth/me`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}