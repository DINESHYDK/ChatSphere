import Cryptr from "cryptr";
import { cookies } from "next/headers";
import validateId from "@/utils/validateId";

import MessageModel from "@/models/Messages/MessageModel";
import connectToDatabase from "@/config/mongoose";
import UserModel from "@/models/User/UserModel";

// *** api/chat/private-chat/fetch-messages?limit=...&id=... ***

export default async function fetchMessages(req, res) {
  await connectToDatabase();
  if (req.method === "GET") {
    const cookie_name = process.env.AUTH_USERID_COOKIE;
    const encryptId = req.cookies[cookie_name];

    if (!encryptId) return res.status(401).json({ message: "Unauthorized" });

    const key = process.env.JWT_SECRET;
    const cryptr = new Cryptr(key);

    const user1_id = cryptr.decrypt(encryptId);
    const { user2_id } = req.body;

    if (!validateId(user1_id) || !validateId(user2_id))
      return res.status(400).json({ message: "Invalid request" });

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
      return res.status(400).json({ message: "Invalid request" });

    const user_1 = await UserModel.findById(user1_id);
    if (!user_1) return res.status(401).json({ message: "Unauthorised" });

    const user_2 = await UserModel.findById(user2_id);
    if (!user_2) return res.status(400).json({ message: "Invalid request" });

    const last_message = await MessageModel.findOne(queryFilter);
    if (!last_message)
      return res.status(400).json({ message: "Invalid request" });

    const messages = await MessageModel.find(queryFilter)
      .sort({ createdAt: -1 })
      .limit(msg_limit);

    return res.status(200).json({ messages });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
