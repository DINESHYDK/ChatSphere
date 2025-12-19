import connectToDatabase from "../../../config/mongoose";
import messageModel from "../../../models/Messages/MessageModel";
import checkAuthAndCookie from "@/utils/checkAuth";

export default async function SavePrivateMessages(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj || !obj.statusCode || !obj.message)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const senderId = obj._id;
      const { receiverId, content, imageUrl } = req.body;
      const newMessage = await messageModel.create({
        senderId,
        receiverId,
        content,
        imageUrl,
        isDelivered: true,
      });
      return res.status(200).json({ message: "SUCCESS" });
    } catch (err) {
      return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
