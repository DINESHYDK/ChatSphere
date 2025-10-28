import connectToDatabase from "../../../config/mongoose";
import PollModel from "../../../models/Polls/PollModel";
import Cryptr from "cryptr";

export default async function SavePoll(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const cookie_name = process.env.AUTH_USERID_COOKIE;
      const encryptId = req.cookies[cookie_name];
      if (!encryptId) res.status(401).json({ message: "Unauthorised" });

      const secret = process.env.JWT_SECRET;
      const cryptr = new Cryptr(secret);

      const pollAutherId = cryptr.decrypt(encryptId);
      const { pollTitle, pollOptions, pollFor } = req.body;
      const newPoll = await PollModel.create({
        pollAutherId,
        pollTitle,
        pollOptions,
        pollFor,
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
