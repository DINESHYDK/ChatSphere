import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import Cryptr from "cryptr";

export default function setTokenAndCookie(res, userId) {
  const jwt_cookie_name = process.env.AUTH_JWT_COOKIE;
  const auth_cookie_name = process.env.AUTH_USERID_COOKIE;
  const jwtKey = process.env.JWT_SECRET;

  const JWT_COOKIE = jwt.sign({ userId }, jwtKey, {
    expiresIn: "24h",
    algorithm: "HS256",
  });

  const cryptr = new Cryptr(jwtKey);
  const AUTH_COOKIE = cryptr.encrypt(userId);

  res.setHeader("Set-Cookie", [
    serialize(jwt_cookie_name, JWT_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    }),

    serialize(auth_cookie_name, AUTH_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    }),
  ]);
}

