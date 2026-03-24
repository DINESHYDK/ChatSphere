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
        return res.status(401).json({ message: "INVALID_OTP" });
      }
      if (user.verifyTokenExpiresAt < Date.now()) {
        return res.status(401).json({ message: "OTP_EXPIRED" });
      }

      const { _id, userName, gender } = user;

      setTokenAndCookie(res, { _id, userName, gender });

      await UserModel.updateOne(
        { _id: _id },
        {
          $set: { isVerified: true },
          $unset: {
            verifyToken: "",
            verifyTokenExpiresAt: "",
            emailVerificationToken: "",
            email_verification: "",
          },
        },
      );
      return res.status(200).json({
        message: "SUCCESS",
        user: { _id, userName, gender },
      });
    } catch (err) {
      res.status(500).json({ message: `SOMETHING_WENT_WRONG: ${err}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
