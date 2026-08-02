import { cookies } from "next/headers";

export const getAuthToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) {
    throw new Error("User Not Logged In");
  }
  return token;
};