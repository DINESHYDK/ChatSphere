import { NextResponse } from "next/server";
import client from "./config/redis";
import devLog from "./utils/logger";

export async function middleware(request) {
  const SESSION_COOKIE = process.env.AUTH_SESSION_COOKIE;
  let cookie = request.cookies.get(SESSION_COOKIE)?.value;

  if (!cookie) {
    if (request.nextUrl.pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ message: "UNAUTHENTICATED" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const res = await client.get(cookie);
  console.log('res is ', res);
  if (!res) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { _id, gender, exp_time } = res;
  if (exp_time < Date.now()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("session_info", JSON.stringify({ _id, gender }), {
    keepSerializer: true,
  });

  // Pass the new headers to the response
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  // const my_header = new Headers();

  // return NextResponse.next(); // setting user-id in header of request
}
export const config = {
  // matcher: ["/chat/:path*", "/api/cloudinary/:path*"],
  matcher: ["/api/poll/:path*"],
};
