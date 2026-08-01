import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/", "/login", "/register"];

  const isPublic =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/properties");

  const token = request.cookies.get("accessToken")?.value;

  if (
    token &&
    (pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPublic) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let role: string | undefined;

  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    let decoded: JwtPayload | null = null;
    try {
      decoded = jwt.verify(token, secret) as JwtPayload;
    } catch {
      decoded = jwt.decode(token) as JwtPayload | null;
    }

    role = decoded?.role;
  } catch (err) {
    console.error("Proxy Token Decode Error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role based protection
  if (
    pathname.startsWith("/dashboard/admin") &&
    role &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    pathname.startsWith("/dashboard/tenant") &&
    role &&
    role !== "TENANT"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    (pathname.startsWith("/dashboard/landlord") ||
      pathname.startsWith("/landlord")) &&
    role &&
    role !== "LANDLORD"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};