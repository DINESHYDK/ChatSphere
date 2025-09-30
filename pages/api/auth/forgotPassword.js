import { sendResetPassEmail } from "../../../resend/email";
import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import generateAuthToken from "../../../utils/generateAuthToken";
import { VERIFY_API_LIMIT } from "../../../utils/verifyApiLimit";

export default async function forgotPassword(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { email } = req.body;

      let user = await UserModel.findOne({ email }).select("-password");
      if (!user) {
        console.log("Invalid email");
        return res.status(401).json({ message: "Invalid Credentials" });
      }
      if (!user.isVerified) {
        console.log("Invalid email");
        return res.status(401).json({ message: "Invalid Credentials" });
      }
      const { no_of_requests } = user.password_reset;

      if (no_of_requests >= 2) {
        let { last_updation_time } = user.password_reset;
        if (!VERIFY_API_LIMIT(last_updation_time)) {
          console.log("Too many email verify requests");
          return res
            .status(429)
            .json({ message: "Too many requests, Try again later" });
        }
        user.password_reset.no_of_requests = 0;
      }
      const resetToken = generateAuthToken();
      user.resetToken = resetToken;
      user.resetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // *** valid for 24 hour ***
      await sendResetPassEmail(email, resetToken);

      user.password_reset = {
        last_updation_time: Date.now(),
        no_of_requests: no_of_requests + 1,
      };
      await user.save();

      return res.status(200).json({ message: "Password reset email sent" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = { api: { bodyParser: true } }; // Optional but safe
