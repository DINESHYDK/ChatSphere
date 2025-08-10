import { sendResetPassEmail } from "../../../resend/email";
import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import generateAuthToken from "../../../utils/generateAuthToken";

export default async function forgotPassword(req, res) {
  
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { email } = req.body;

      let user = await UserModel.findOne({ email }).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }
      const resetToken = generateAuthToken();
      user.resetToken = resetToken;
      user.resetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // *** valid for 24 hour ***
      await user.save();

      await sendResetPassEmail(email, resetToken);

      return res.status(200).json({ message: "Password reset email sent" });
    } catch (err) {
      console.log("Something went wrong", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = { api: { bodyParser: true } }; // Optional but safe
