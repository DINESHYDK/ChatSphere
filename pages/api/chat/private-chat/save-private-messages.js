import connectToDatabase from "../../../config/mongoose";
import messageModel from "../../../models/Messages/MessageModel";
import Cryptr from "cryptr";

export default async function SavePrivateMessages(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const cookie_name = process.env.AUTH_USERID_COOKIE;
      const encryptId = req.cookies[cookie_name];
      if (!encryptId) res.status(401).json({ message: "Unauthorised" });

      const secret = process.env.JWT_SECRET;
      const cryptr = new Cryptr(secret);

      const senderId = cryptr.decrypt(encryptId);
      const { receiverId, content, imageUrl } = req.body;
      const newMessage = await messageModel.create({
        senderId,
        receiverId,
        content,
        imageUrl,
        isDelivered: true,
      });
      return res.status(200).json({ message: "success" });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
