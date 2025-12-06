import Cryptr from "cryptr";

import GlobalMessageModel from "@/models/Messages/GlobalMessageModel";
import validateId from "@/utils/validateId";
import UserModel from "@/models/User/UserModel";

// *** api/chat/global/fetch-messages?limit=...&id=... ***
export default async function FetchGlobalMessages(req, res) {
  if (req.method === "GET") {
    const cookie_name = process.env.AUTH_USERID_COOKIE;
    const encryptId = req.cookies[cookie_name];

    if (!encryptId) return res.status(401).json({ message: "Unauthorized" });

    const { last_message_id } = req.body.id;
    const { msg_limit } = parseInt(req.body.limit);

    if (!msg_limit || (last_message_id && !validateId(last_message_id)))
      return res.status(400).json({ message: "Invalid request" });

    const last_message = await GlobalMessageModel.findOne({
      _id: last_message_id,
    });

    if (!last_message)
      return res.status(400).json({ message: "Invalid request" });

    const key = process.env.JWT_SECRET;
    const cryptr = new Cryptr(key);
    const user_id = cryptr.decrypt(encryptId);

    if (!validateId(user_id))
      return res.status(401).json({ message: "Unauthorised" });
    const user = await UserModel.findById(user._id);
    if (!user) return res.status(401).json({ message: "Unauthorised" });

    const queryFilter = last_message_id ? {} : { _id: { $lt: last_msg_id } };
    const messages = await GlobalMessageModel.find(queryFilter)
      .sort({ createdAt: -1 })
      .limit(msg_limit);

    return res.status(200).json({ messages });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
