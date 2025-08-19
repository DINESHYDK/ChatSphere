import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/User/UserModel";

export default async function verifyEmail(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    try {
      const { token } = req.query;
      if (!token) {
        console.log("Invalid credentials");
        res.status(401).json({ message: "Authentication failed" });
      }

      let user = await UserModel.findOne({
        emailVerificationToken: token,
        isVerified: false,
      });

      if (!user) {
        console.log("Invalid User credentials");
        return res.status(404).json({ message: "Invalid user credentials" });
      }
      res.status(200).json({ message: "success", user });
    } catch (err) {
      console.log("Something went wrong", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
