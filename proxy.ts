import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify_token } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Add pathname to headers so we can access it in server components
  response.headers.set("x-pathname", request.nextUrl.pathname);

  const pathname = request.nextUrl.pathname;

  // Protected routes
  const is_dashboard_route = pathname.startsWith("/dashboard");
  const is_admin_route =
    pathname.startsWith("/admin") && !pathname.startsWith("/dashboard");
  const is_protected_user_route =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/my-items") ||
    pathname.startsWith("/notifications");

  // Check if route needs authentication
  if (is_dashboard_route || is_admin_route || is_protected_user_route) {
    // Get access token from authorization header (localStorage token sent by client)
    const authorization_header = request.headers.get("authorization");
    const access_token = authorization_header?.replace("Bearer ", "");

    if (!access_token) {
      // Redirect to login if no token
      const login_url = new URL("/login", request.url);
      login_url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(login_url);
    }

    try {
      // Verify JWT token
      const payload = verify_token(access_token);

      if (!payload) {
        // Invalid token, redirect to login
        const login_url = new URL("/login", request.url);
        login_url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(login_url);
      }

      // Role-based routing
      if (is_dashboard_route) {
        // Only admin can access /dashboard/**
        if (payload.role !== "admin") {
          // Redirect to appropriate route
          if (
            payload.role === "moderator" ||
            payload.role === "support_staff"
          ) {
            // Redirect to /admin instead
            const admin_path = pathname.replace("/dashboard", "/admin");
            return NextResponse.redirect(new URL(admin_path, request.url));
          } else {
            // Redirect students to home
            return NextResponse.redirect(new URL("/", request.url));
          }
        }
      } else if (is_admin_route) {
        // Admin should use /dashboard instead
        if (payload.role === "admin") {
          const dashboard_path = pathname.replace("/admin", "/dashboard");
          return NextResponse.redirect(new URL(dashboard_path, request.url));
        }

        // Moderator and support_staff can access /admin/**
        if (payload.role !== "moderator" && payload.role !== "support_staff") {
          // Students cannot access admin routes
          return NextResponse.redirect(new URL("/", request.url));
        }

        // Check specific page access for moderator and support_staff
        if (
          pathname.includes("/users") ||
          pathname.includes("/analytics") ||
          pathname.includes("/logs")
        ) {
          // Only admin can access these pages
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        if (pathname.includes("/support") && payload.role !== "support_staff") {
          // Only support_staff can access support page
          return NextResponse.redirect(new URL("/admin", request.url));
        }

        if (
          (pathname.includes("/reports") ||
            pathname.includes("/share-items")) &&
          payload.role === "support_staff"
        ) {
          // support_staff cannot access reports and share-items
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      }

      // Add user info to headers for use in server components
      response.headers.set("x-user-id", payload.userId);
      response.headers.set("x-user-email", payload.email);
      response.headers.set("x-user-role", payload.role);

      return response;
    } catch (error) {
      // Invalid token, redirect to login
      const login_url = new URL("/login", request.url);
      login_url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(login_url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register (auth pages)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
