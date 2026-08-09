import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const VALID_ROLES = new Set(["ADMIN", "LANDLORD", "TENANT"]);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/", "/about", "/contact", "/login", "/register"];

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

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");

    const decoded = jwt.verify(token, secret) as JwtPayload;
    const role = typeof decoded.role === "string" ? decoded.role : undefined;
    if (!role || !VALID_ROLES.has(role)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/dashboard/tenant") && role !== "TENANT") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if ((pathname.startsWith("/dashboard/landlord") || pathname.startsWith("/landlord")) && role !== "LANDLORD") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
