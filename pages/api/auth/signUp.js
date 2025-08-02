import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import bcrypt from "bcrypt";
import { sendVerifyUserEmail } from "../../../resend/email";
import generateToken from "../../../utils/generateToken";

export default async function signUp(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body.userData;

      if (!name || !email || !password) {
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
        name,
        email,
        password: hashedPassword,
        verifyToken,
        verifyTokenExpiresAt: Date.now() + 3600000, // 1 hour
      });

      await newUser.save();

      // In a real app, you would send a verification email here
      // await sendVerifyUserEmail(email, verifyToken);

      res.status(201).json({
        message: "User created successfully. Please verify your email.",
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
