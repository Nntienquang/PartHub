import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const role = token.role as string;

    // Admin routes - only ADMIN can access
    if (path.startsWith("/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Employer routes - EMPLOYER or ADMIN can access
    if (path.startsWith("/employer")) {
      if (role !== "EMPLOYER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes that don't need authentication
        if (
          path.startsWith("/auth") ||
          path === "/" ||
          path.startsWith("/jobs") ||
          path.startsWith("/companies") ||
          path.startsWith("/blog") ||
          path.startsWith("/api/uploadthing") ||
          path === "/about" ||
          path === "/contact" ||
          path === "/terms" ||
          path === "/privacy"
        ) {
          return true;
        }

        // Protected routes need token
        if (path.startsWith("/admin") || path.startsWith("/employer")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/employer/:path*",
  ],
};


