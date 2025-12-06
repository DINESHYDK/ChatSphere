import connectToDatabase from "../../../../config/mongoose";
import globalMessageModel from "../../../../models/Messages/GlobalMessageModel";
import Cryptr from "cryptr";

export default async function SaveGlobalMessages(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const cookie_name = process.env.AUTH_USERID_COOKIE;
      const encryptId = req.cookies[cookie_name];
      if (!encryptId) res.status(401).json({ message: "Unauthorised" });

      const secret = process.env.JWT_SECRET;
      const cryptr = new Cryptr(secret);

      const senderId = cryptr.decrypt(encryptId);
      
      const { content, imageUrl } = req.body;

      const newMessage = await globalMessageModel.create({
        senderId,
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
