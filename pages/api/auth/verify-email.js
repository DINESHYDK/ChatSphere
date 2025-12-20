import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import { sendVerifyUserEmail } from "../../../resend/email";
import { VERIFY_API_LIMIT } from "../../../utils/verifyApiLimit";
import devLog from "../../../utils/logger";

export default async function verifyEmail(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { token, resend } = req.query;
      if (!token) {
        return res.status(401).json({ message: "INVALID_REQUEST" });
      }
      let user = await UserModel.findOne({
        emailVerificationToken: token,
        isVerified: false,
      });
      if (!user) {
        return res.status(404).json({ message: "INVALID_REQUEST" });
      }
      const { no_of_requests } = user.email_verification;
      if (no_of_requests >= 2) {
        let { last_updation_time } = user.email_verification;
        if (!VERIFY_API_LIMIT(last_updation_time)) {
          return res.status(429).json({ message: "TOO_MANY_REQUESTS" });
        }
        user.email_verification.no_of_requests = 0;
      }
      if (resend === "true" && no_of_requests < 2) {
        await sendVerifyUserEmail(user.email, user.verifyToken);
      }
      user.email_verification = {
        last_updation_time: Date.now(),
        no_of_requests: no_of_requests + 1,
      };
      await user.save();
      delete user.password;
      return res.status(200).json({ message: "SUCCESS", user });
    } catch (err) {
      res.status(500).json({ message: `INTERNAL_SERVER_ERROR: ${err}` });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
