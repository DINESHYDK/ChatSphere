import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export default function setTokenAndCookie(res, userId) {
  const jwtKey = process.env.JWT_SECRET;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
    algorithm: "HS256",
  });
  res.setHeader(
    "Set-Cookie",
    serialize("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // *** cookie valid for 1 day ***
      path: "/", //*** This will make the cookie accessible to all routes ***
    })
  );
}
// *** res.setCookie only work in expressJS ***
