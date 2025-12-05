import connectToDatabase from "@/config/mongoose";
import MessageModel from "@/models/Messages/MessageModel";
import UserModel from "@/models/User/UserModel";
import Cryptr from "cryptr";
import { cookies } from "next/headers";

//API will be like api/chat/private-chat/fetch-messages?limit=..&skip=...
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

    const msg_limit = parseInt(req.params.limit || "20");
    const no_msg_skip = parseInt(req.params.no_msg_skip || "0");

    const user_1 = await UserModel.findById(user1_id);
    if (!user_1) return res.status(401).json({ message: "Unauthorised" });

    const user_2 = await UserModel.findById(user2_id);
    if (!user_2) return res.status(404).json({ message: "User not found" });

    const messages = await MessageModel.find({
      $or: [
        { senderId: user1_id, receiverId: user2_id },
        { receiverId: user1_id, senderId: user2_id },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(msg_limit)
      .skip(no_msg_skip);

    return res.status(200).json({ messages });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
