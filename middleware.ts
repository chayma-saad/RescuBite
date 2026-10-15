import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/restaurant") && token?.role !== "RESTAURANT") {
      return NextResponse.redirect(new URL("/browse", req.url));
    }
    if (pathname.startsWith("/charity") && token?.role !== "CHARITY") {
      return NextResponse.redirect(new URL("/browse", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/restaurant/:path*", "/reservations/:path*", "/charity/:path*"],
};
