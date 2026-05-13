import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import client from "@/config/redis";


export default function setTokenAndCookie(res, userObj) {
  const session_cookie_name = process.env.AUTH_SESSION_COOKIE;

  const SESSION_COOKIE = crypto.randomBytes(32).toString("hex");
  
  
  // const auth_cookie_name = process.env.AUTH_USERID_COOKIE;
  // const jwtKey = process.env.JWT_SECRET;

  // const JWT_COOKIE = jwt.sign(userObj, jwtKey, {
  //   expiresIn: "24h",
  //   algorithm: "HS256",
  // });

  // const { _id } = userObj;
  // const cryptr = new Cryptr(jwtKey);
  // const AUTH_COOKIE = cryptr.encrypt(_id);

  res.setHeader("Set-Cookie", [
    serialize(session_cookie_name, SESSION_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    }),
  ])

  //   serialize(auth_cookie_name, AUTH_COOKIE, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: "strict",
  //     maxAge: 24 * 60 * 60,
  //     path: "/",
  //   }),
  // ]);
}
