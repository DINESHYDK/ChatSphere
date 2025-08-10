import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import bcrypt from "bcrypt";
import generateToken from "../../../utils/generateAuthToken";
import { sendVerifyUserEmail } from "../../../resend/email";

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
        return res.status(409).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const verifyToken = generateToken();

      const newUser = new UserModel({
        userName,
        email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpiresAt: Date.now() + 24 * 100 * 60 * 60, // *** Will expire in 24 hr ***
      });

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
