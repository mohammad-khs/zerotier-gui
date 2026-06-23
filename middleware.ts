import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access protected routes
  if (pathname.startsWith("/network")) {
    // Get JWT token from cookies
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
    });

    // If no token exists, redirect to home page
    if (!token) {
      console.log(
        "[Middleware] Unauthenticated access to protected route, redirecting...",
      );
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("[Middleware] Authenticated access to protected route allowed");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/network/:path*"],
};
