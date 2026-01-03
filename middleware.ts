import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth", "/register"];

  // If the path is public, allow
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For protected routes, you would check for a valid session/JWT here
  // For now, we'll block direct access to /vote, /enroll, /consent, /history
  const protectedRoutes = ["/vote", "/enroll", "/consent", "/history"];
  if (protectedRoutes.includes(pathname)) {
    // TODO: Check for valid session/JWT cookie or header
    // If no session, redirect to auth
    const loginUrl = new URL("/auth", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow other paths (e.g., API routes, static files)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
