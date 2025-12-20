import UserModel from "../../../models/User/UserModel";
import connectToDatabase from "../../../config/mongoose";
import bcrypt from "bcrypt";
import setTokenAndCookie from "../../../utils/generateJwtCookie";
import devLog from "../../../utils/logger";

export default async function resetPassword(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { token } = req.query;
      const { password } = req.body;
      let user = await UserModel.findOne({
        resetToken: token,
      }).select("-password");

      if (!user || user.resetTokenExpiresAt < Date.now()) {
        return res.status(401).json({ message: "INVALID_REQUEST" });
      }
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);

      ((user.password = hashedPassword),
        (user.resetToken = undefined),
        (user.resetTokenExpiresAt = undefined),
        await user.save());
      setTokenAndCookie(res, user._id);
      return res.status(200).json({ message: "PASSWORD_RESET" });
    } catch (err) {
      res.status(500).json({ message: `INTERNAL_SERVER_ERROR: ${err}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
