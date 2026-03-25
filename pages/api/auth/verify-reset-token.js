import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";

export default async function verfiyResetToken(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { token } = req.query;
      if (!token) {
        res.status(401).json({ message: "INVALID_REQUEST" });
      }

      let user = await UserModel.findOne({
        resetToken: token,
      });
      if (!user) {
        return res.status(401).json({ message: "INVALID_RESET_TOKEN" });
      }
      if (user.resetTokenExpiresAt < Date.now()) {
        return res.status(401).json({ message: "OUTDATED_RESET_TOKEN" });
      }
      res.status(200).json({ message: "SUCCESS", user });
    } catch (err) {
      res.status(500).json({ message: `INTERNAL_ERROR, ${err.message}` });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
