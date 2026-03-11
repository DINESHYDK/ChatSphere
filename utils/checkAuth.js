import { jwtVerify } from "jose";
import connectToDatabase from "@/config/mongoose";
// import UserModel from "@/models/User/UserModel";
import { cookies } from "next/headers";
import devLog from "./logger";

class res {
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

export default async function checkAuthAndCookie(req) {
  await connectToDatabase();

  try {
    const jwt_cookie_name = process.env.AUTH_JWT_COOKIE;
    const jwt_cookie = req.cookies[jwt_cookie_name];
    if (!jwt_cookie) return new res(401, "UNAUTHENTICATED");

    const secret_key = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(jwt_cookie, secret_key);
    const TIME_IN_SECOND = Math.floor(Date.now() / 1000);

    if (!payload || payload.exp < TIME_IN_SECOND)
      return new res(401, "UNAUTHENTICATED");

    const { _id, userName, gender } = payload;
    return new res(200, { _id, userName, gender });
  } catch (err) {
    return new res(500, err.message);
  }
}
