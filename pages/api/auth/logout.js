import * as cookie from "cookie";

export default function handler(req, res) {
  const serialized = cookie.serialize("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  res.setHeader("Set-Cookie", serialized);
  res.status(200).json({ message: "Logged out" });
}
