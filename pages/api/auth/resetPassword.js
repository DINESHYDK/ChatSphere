import UserModel from "../../../models/User/UserModel";
import connectToDatabase from "../../../config/mongoose";
import bcrypt from "bcrypt";

export default async function resetPassword(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { token } = req.query;
      const { password } = req.body;
      let user = await UserModel.findOne({
        resetToken: token,
      }).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      if (user.resetTokenExpiresAt < Date.now()) {
        return res.status(401).json({ message: "Token expired" });
      }
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);

      ((user.password = hashedPassword),
        (user.resetToken = undefined),
        (user.resetTokenExpiresAt = undefined),
        await user.save());

      return res.status(200).json({ message: "success", user });
    } catch (err) {
      console.log("Something went wrong", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
