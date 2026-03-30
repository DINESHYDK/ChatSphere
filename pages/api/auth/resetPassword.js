import UserModel from "../../../models/User/UserModel";
import connectToDatabase from "../../../config/mongoose";
import bcrypt from "bcrypt";
import setTokenAndCookie from "../../../utils/generateJwtCookie";

export default async function resetPassword(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { token } = req.query || {};
      const { password } = req.body || {};

      if (!token || !password)
        return res.status(400).json({ message: "INVALID_REQUEST" });
      let user = await UserModel.findOne({
        resetToken: token,
      }).select("-password");

      if (
        !user ||
        !user.resetTokenExpiresAt ||
        user.resetTokenExpiresAt < Date.now()
      ) {
        return res.status(401).json({ message: "INVALID_REQUEST" });
      }
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);

      await UserModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: { password: hashedPassword },
          $unset: { resetToken: "", resetTokenExpiresAt: "" },
        },
      );
      const { _id, userName, gender } = user;

      setTokenAndCookie(res, { _id, userName, gender });
      return res.status(200).json({ message: "SUCCESS" });
    } catch (err) {
      res
        .status(500)
        .json({ message: `INTERNAL_SERVER_ERROR, ${err.message}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
