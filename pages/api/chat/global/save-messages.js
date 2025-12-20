import checkAuthAndCookie from "@/utils/checkAuth";
import connectToDatabase from "../../../../config/mongoose";
import globalMessageModel from "../../../../models/Messages/GlobalMessageModel";

export default async function SaveGlobalMessages(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const senderid = obj.message._id;
      const { content, imageUrl } = req.body;

      const newMessage = await globalMessageModel.create({
        senderId,
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
