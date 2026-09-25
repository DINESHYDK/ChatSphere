import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import setTokenAndCookie from "../../../utils/generateJwtCookie";

export default async function signIn(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { email, password } = req.body.userData;

      if (!email || !password) {
        return res.status(400).json({ message: "ALL_FIELDS_ARE_REQUIRED" });
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "INVALID_CREDENTIALS" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "INVALID_CREDENTIALS" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ message: "EMAIL_VERIFICATION_PENDING" });
      }
      setTokenAndCookie(res, user._id);

      const newUser = user.toObject();
      delete newUser.password;
      res.status(200).json({ message: "SUCCESS", newUser });

    } catch (err) {
      console.error("SIGNIN ERROR", err);
      res.status(500).json({ message: `INTERNAL_SERVER_ERROR: ${err}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
