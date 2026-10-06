import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/auth/google/callback"];
const AUTH_ROUTES = ["/login", "/register"];

function getCookie(req: NextRequest, name: string): string | undefined {
  return req.cookies.get(name)?.value;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = getCookie(req, "devassess-session");
  const role = getCookie(req, "devassess-role");
  const isAuthenticated = session === "true";

  // Allow public routes through.
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    // If already authenticated and visiting an auth route, send them home.
    if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(roleHome(role), req.url));
    }
    return NextResponse.next();
  }

  // Everything else requires a session.
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based edge guard. The client guard in each layout is the source of
  // truth, but this avoids flashes of the wrong role's UI at the edge.
  const requiredRole = getRequiredRole(pathname);
  if (requiredRole && role !== requiredRole) {
    return NextResponse.redirect(new URL(roleHome(role), req.url));
  }

  return NextResponse.next();
}

function getRequiredRole(pathname: string): string | null {
  if (pathname.startsWith("/admin")) return "ADMIN";
  if (pathname.startsWith("/company")) return "COMPANY";
  if (pathname.startsWith("/candidate")) return "CANDIDATE";
  return null;
}

function roleHome(role?: string): string {
  switch (role) {
    case "ADMIN":
      return "/admin/dashboard";
    case "COMPANY":
      return "/company/dashboard";
    case "CANDIDATE":
      return "/candidate/dashboard";
    default:
      return "/login";
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
