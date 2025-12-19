import MessageModel from "@/models/Messages/MessageModel";
import connectToDatabase from "@/config/mongoose";
import UserModel from "@/models/User/UserModel";
import checkAuthAndCookie from "@/utils/checkAuth";

// *** api/chat/private-chat/fetch-messages?limit=...&id=... ***

export default async function fetchMessages(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    const obj = await checkAuthAndCookie(req);
      if (!obj)
      return res.status(500).json({ message: "SOMETHING_WENT_WRONG" });
    if (obj.statusCode === 401)
      return res.status(401).json({ message: obj.message });

    const user1_id = obj._id;
    const { user2_id } = req.body;

    const queryFilter = {
      $or: [
        { senderId: user1_id, receiverId: user2_id },
        { senderId: user2_id, receiverId: user1_id },
      ],
    };
    const msg_limit = parseInt(req.query.limit);
    const last_msg_id = req.query.id;
    if (last_msg_id) queryFilter._id = { $lt: last_msg_id };

    if (!msg_limit || (last_msg_id && !validateId(last_msg_id)))
      return res.status(400).json({ message: "INVALID_REQUEST" });

    const user_2 = await UserModel.findById(user2_id);
    if (!user_2) return res.status(400).json({ message: "INVALID_REQUEST" });

    const last_message = await MessageModel.findOne(queryFilter);
    if (!last_message)
      return res.status(400).json({ message: "INVALID_REQUEST" });

    const messages = await MessageModel.find(queryFilter)
      .sort({ createdAt: -1 })
      .limit(msg_limit);

    return res.status(200).json({ messages });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
