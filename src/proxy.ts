import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ["/", "/login", "/register"];

  const isPublic =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/properties");

  const token = request.cookies.get("accessToken")?.value;
console.log("pathname:", pathname);
console.log("token:", token);

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

  let role: string;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    role = decoded.role;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role based protection
  if (
    pathname.startsWith("/dashboard/admin") &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    pathname.startsWith("/dashboard/tenant") &&
    role !== "TENANT"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    pathname.startsWith("/dashboard/landlord") &&
    role !== "LANDLORD"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};