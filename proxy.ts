import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

// quick cookie check only, the real role checks happen in layouts and on the api
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const { pathname, search } = request.nextUrl

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirect", pathname + search)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/services/:id",
    "/profile/:path*",
    "/payment/:path*",
    "/onboarding",
  ],
}
