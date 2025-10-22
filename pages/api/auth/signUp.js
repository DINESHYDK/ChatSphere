import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import { sendVerifyUserEmail } from "../../../resend/email";

import bcrypt from "bcrypt";
import crypto from "crypto";
import generateToken from "../../../utils/generateOTP";
import devLog from "../../../utils/logger";

export default async function signUp(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { userName, email, password } = req.body.userData;

      if (!userName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const verifyToken = generateToken();
      const token = crypto.randomBytes(32).toString("hex");

      const newUser = new UserModel({
        userName,
        email,
        password: hashedPassword,
        emailVerificationToken: token,
        verifyToken,
        verifyTokenExpiresAt: Date.now() + 24 * 100 * 60 * 60, // *** Will expire in 24 hr ***
      });
      devLog("new user is ", newUser);
      await newUser.save();
      delete newUser.password;
      sendVerifyUserEmail(email, verifyToken);

      res.status(201).json({
        message: "User created successfully. Please verify your email.",
        newUser,
      });
    } catch (err) {
      console.error("SIGNUP ERROR", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
