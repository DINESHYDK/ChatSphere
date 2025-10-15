import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import devLog from '../../../utils/logger'

export default async function verfiyResetToken(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { token } = req.query;
      if (!token) {
        devLog("Invalid credentials");
        res.status(401).json({ message: "Authentication failed" });
      }

      let user = await UserModel.findOne({
        resetToken: token,
      });
      if (!user) {
        devLog("Invalid OTP");
        return res
          .status(401)
          .json({ message: "Invalid Password reset token" });
      }
      if (user.resetTokenExpiresAt < Date.now()) {
        devLog("Reset Token Expired");
        return res.status(401).json({ message: "Reset token expired" });
      }
      res.status(200).json({ message: "success", user });
    } catch (err) {
      devLog("Something went wrong", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
