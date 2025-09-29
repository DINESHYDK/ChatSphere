import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import { sendVerifyUserEmail } from "../../../resend/email";

export default async function verifyEmail(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { token, resend } = req.query;
      if (!token) {
        console.log("Invalid credentials");
        return res.status(401).json({ message: "Authentication failed" });
      }
      let user = await UserModel.findOne({
        emailVerificationToken: token,
        isVerified: false,
      });
      if (!user) {
        console.log("Invalid User credentials");
        return res.status(404).json({ message: "Invalid user credentials" });
      }
      if (user.email_verification_requests >= 2) {
        console.log("Too many email verify requests");
        return res
          .status(429)
          .json({ message: "Too many requests, Try again later" });
      }
      if (resend === "true" && user.email_verification_requests < 2) {
        await sendVerifyUserEmail(user.email, user.verifyToken);
      }
      user.email_verification_requests += 1;
      await user.save();
      return res.status(200).json({ message: "Success", user });
    } catch (err) {
      console.log("Something went wrong", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
