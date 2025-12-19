import { jwtVerify } from "jose";
import connectToDatabase from "@/config/mongoose";
import UserModel from "@/models/User/UserModel";
import { cookies } from "next/headers";
import devLog from "./logger";

class visError {
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
    if (!jwt_cookie) return new visError(401, "UNAUTHENTICATED");

    const secret_key = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(jwt_cookie, secret_key);
    const TIME_IN_SECOND = Math.floor(Date.now() / 1000);

    if (!payload || payload.exp < TIME_IN_SECOND)
      return new visError(401, "UNAUTHENTICATED");

    const { userId } = payload;
    if (!userId) return new visError(401, "UNAUTHETICATED");

    const user = await UserModel.findById(userId);
    if (!user) return new visError(401, "UNAUTHENTICATED");
    delete user.password;

    return new visError(200, user);
  } catch (err) {
    devLog("AUTH Error", err);
  }
}
