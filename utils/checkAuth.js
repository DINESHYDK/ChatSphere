import { jwtVerify } from "jose";
import connectToDatabase from "@/config/mongoose";
import UserModel from "@/models/User/UserModel";
import { cookies } from "next/headers";

class AUTH_RESPONSE {
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
    if (!jwt_cookie) return new AUTH_RESPONSE(401, "AUTH_ERROR");

    const secret_key = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(jwt_cookie, secret_key);
    const TIME_IN_SECOND = Math.floor(Date.now() / 1000);

    if (!payload || payload.exp < TIME_IN_SECOND)
      return new AUTH_RESPONSE(401, "AUTH_ERROR");

    let { _id, userName, gender } = payload;
    if (!_id || !userName || !gender)
      return new AUTH_RESPONSE(401, "AUTH_ERROR");

    _id = _id.toString();
    const user = { _id, userName, gender };

    if (!user) return new AUTH_RESPONSE(401, "AUTH_ERROR");
    
    console.log('i am hitting');
    return new AUTH_RESPONSE(200, user);
  } catch (err) {
    console.log("AUTH_ERROR", err);
  }
}
