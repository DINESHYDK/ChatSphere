import { sendResetPassEmail } from "../../../resend/email";
import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";
import generateToken from "../../../utils/generateToken";

export default async function forgotPassword(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { email } = req.body;
      let user = await UserModel.findOne({ email }).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Invalid email" });
      }
      let resetToken = generateToken();
      ((user.resetToken = resetToken),
        (user.resetTokenExpiresAt = Date.now + 60 * 60 * 100)); // *** valid for one hour ***
      await user.save();

      return res.status(200).json({ message: "success" });
    } catch (err) {
      console.log("Something went wrong", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
