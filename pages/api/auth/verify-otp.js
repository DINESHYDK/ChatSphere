import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import setTokenAndCookie from "../../../utils/generateTokenAndCookie";

export default async function verifyOTP(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { token } = req.body;
      let user = await UserModel.findOne({
        verifyToken: token,
      }).select("-password");
      console.log("crossed here");
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      if (user.verifyTokenExpiresAt < Date.now()) {
        return res.status(401).json({ message: "Token expired" });
      }
      setTokenAndCookie(res, user._id);
      ((user.isVerified = true),
        (user.verifyToken = undefined),
        (user.verifyTokenExpiresAt = undefined),
        (user.emailVerificationToken = undefined),
        (user.email_verification_requests = undefined),
        await user.save());
      return res.status(200).json({ message: "Email verified", user });
    } catch (err) {
      console.log("Something went wrong", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
