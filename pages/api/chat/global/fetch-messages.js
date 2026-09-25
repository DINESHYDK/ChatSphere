import GlobalMessageModel from "@/models/Messages/GlobalMessageModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import connectToDatabase from "@/config/mongoose";

// *** api/chat/global/fetch-messages?limit=...&id=... ***
export default async function FetchGlobalMessages(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const obj = await checkAuthAndCookie(req);
      if (!obj)
      return res.status(500).json({ message: "SOMETHING_WENT_WRONG" });
    if (obj.statusCode === 401)
      return res.status(401).json({ message: obj.message });

    const { last_message_id } = req.body.id;
    const { msg_limit } = parseInt(req.body.limit);

    if (!msg_limit || (last_message_id && !validateId(last_message_id)))
      return res.status(400).json({ message: "INVALID_REQUEST" });

    const last_message = await GlobalMessageModel.findOne({
      _id: last_message_id,
    });

    if (!last_message)
      return res.status(400).json({ message: "INVALID_REQUEST" });

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
