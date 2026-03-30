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
      const { userName, email, password } = req.body.userData || {};

      let gender;
      switch (req.body.userData.gender) {
        case "M":
          gender = "B";
          break;
        case "F":
          gender = "G";
          break;
        default:
          gender = null;
      }

      if (!userName || !email || !password || !gender) {
        return res.status(400).json({ message: "ALL_FIELDS_ARE_REQUIRED" });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        if (existingUser.isVerified)
          return res.status(409).json({ message: "INVALID_REQUEST" });
        await UserModel.deleteOne({ email });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const verifyToken = generateToken();
      const token = crypto.randomBytes(32).toString("hex");

      const newUser = new UserModel({
        userName,
        gender,
        email,
        password: hashedPassword,
        emailVerificationToken: token,
        verifyToken,
        verifyTokenExpiresAt: Date.now() + 15 * 60 * 1000 /* 15 minutes */,
      });
      await newUser.save();
      sendVerifyUserEmail(email, verifyToken);

      const new_user_res_obj = {
        userName,
        gender,
        emailVerificationToken: token,
      };
      res.status(201).json({
        message: "ACCOUNT_CREATED, PLEASE_VERIFY_YOUR_EMAIL",
        newUser: new_user_res_obj,
      });
    } catch (err) {
      console.error("SIGNUP ERROR", err);
      res
        .status(500)
        .json({ message: `INTERNAL_SERVER_ERROR, ${err.message}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
