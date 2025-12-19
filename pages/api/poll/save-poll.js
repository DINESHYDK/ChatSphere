import connectToDatabase from "../../../config/mongoose";
import PollModel from "../../../models/Polls/PollModel";
import Cryptr from "cryptr";

export default async function SavePoll(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const cookie_name = process.env.AUTH_USERID_COOKIE;
      console.log(cookie_name);
      const encryptId = req.cookies[cookie_name];
      if (!encryptId) res.status(401).json({ message: "Unauthorised" });
      
      const secret = process.env.JWT_SECRET;
      const cryptr = new Cryptr(secret);
      
      const userId = cryptr.decrypt(encryptId);
      const { title, gender, pollOptions } = req.body.pollData;
      console.log('new poll on server side ', pollData);
      
      const newPoll = await PollModel.create({
        userId,
        title,
        pollOptions,
        gender,
      });

      return res.status(200).json({ message: "success" });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
