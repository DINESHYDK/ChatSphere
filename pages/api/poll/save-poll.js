import connectToDatabase from "@/config/mongoose";
import PollModel from "@/models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";

export default async function SavePoll(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const userId = obj._id;
      const { title, gender, pollOptions } = req.body.pollData;

      const newPoll = new PollModel({
        userId,
        title,
        pollOptions,
        gender,
      });
      await newPoll.save();

      return res.status(200).json({ message: "SUCCESS" });
    } catch (err) {
      return res.status(500).json({ message: `Something went wrong, ${err}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
