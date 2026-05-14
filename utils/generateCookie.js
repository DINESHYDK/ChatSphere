import { serialize } from "cookie";
import crypto from "crypto";
import client from "@/config/redis";

export default async function generateCookie(res, _id, gender) {
  const session_cookie_name = process.env.AUTH_SESSION_COOKIE;

  const SESSION_COOKIE = crypto.randomBytes(32).toString("hex");
  const SESSION_OBJ = {
    _id,
    gender,
    exp_time: Date.now() + 24 * 60 * 60 * 1000,
  };

  await client.set(SESSION_COOKIE, SESSION_OBJ, { keepSerializer: true });
  res.setHeader("Set-Cookie", [
    serialize(session_cookie_name, SESSION_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    }),
  ]);
}
