//in nextjs the middleware.js/.ts file always run on server side
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const authErr = () => {
  return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
};

export async function middleware(req) {
  const cookie_name = process.env.AUTH_JWT_COOKIE;
  const token = req.cookies.get(cookie_name)?.value;

  const secretBytes = new TextEncoder().encode(process.env.JWT_SECRET); //required by jose in byts format
  if (!token) authErr();
  try {
    const { payload } = await jwtVerify(token, secretBytes);
    
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
  matcher: ["/vis"],
};

 // *** MIDDLEWARE IN NEXT IS RUN IN EDGE RUNTIME DUE TO WHICH MODULES LIKE FS, CRYPTO, BCRYPT DIDN'T WORK HERE. ***