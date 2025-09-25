import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import setTokenAndCookie from "../../../utils/generateTokenAndCookie";

export default async function signIn(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { email, password } = req.body.userData;

      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isVerified) {
        return res
          .status(403)
          .json({ message: "Please verify your email first" });
      }
      setTokenAndCookie(res, user._id);
      delete user.password;
      res.status(200).json({ message: "Logged in successfully", user });
    } catch (err) {
      console.error("SIGNIN ERROR", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
