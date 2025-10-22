//in nextjs the middleware.js/.ts file always run on server side
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const authErr = () => {
  return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
};

export async function middleware(req) {
  const cookie_name = process.env.AUTH_COOKIE;

  const token = req.cookies.get(cookie_name)?.value;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  if (!token) authErr();

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload) authErr();
    const { userId } = payload;

    if (!userId) authErr();
    return NextResponse.next();
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export const config = {
  matcher: ["/api/chat/:path*"],
};
