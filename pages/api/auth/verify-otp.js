import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import setTokenAndCookie from "../../../utils/generateJwtCookie";
import devLog from "../../../utils/logger";

export default async function verifyOTP(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { token } = req.body;
      let user = await UserModel.findOne({
        verifyToken: token,
      }).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Invalid OTP" });
      }
      if (user.verifyTokenExpiresAt < Date.now()) {
        return res.status(401).json({ message: "Token expired" });
      }
      // console.log("user is ", user._id.toString());
      setTokenAndCookie(res, user._id.toString());
      ((user.isVerified = true),
        (user.verifyToken = undefined),
        (user.verifyTokenExpiresAt = undefined),
        (user.emailVerificationToken = undefined),
        await user.save());
      return res.status(200).json({ message: "Email verified", user });
    } catch (err) {
      devLog("Something went wrong", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
