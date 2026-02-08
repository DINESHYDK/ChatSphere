import connectToDatabase from "@/config/mongoose";
import PollModel from "@/models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import isValidUrl from "@/utils/isValidURL";
import client from "@/config/redis";

export default async function SavePoll(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG(AUTH)" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const userId = obj.message._id;

      const { title, gender, pollOptions } = req.body.pollData;
      if (!title || !gender || !pollOptions)
        return res.status(400).send("INVALID REQUEST");

      for (let options of pollOptions) {
        if (options.imageUrl !== "" && !isValidUrl(options.imageUrl))
          return res.status(400).send("INVALID REQUEST");
      }

      // const poll_votes_hash = await client.hSet("poll_votes", {});

      const newPoll = new PollModel({
        userId,
        title,
        pollOptions,
        gender,
      });
      await newPoll.save();

      let optionObj = {};
      for (let i = 0; i < pollOptions.length; i++) {
        let str = String.fromCharCode(65 + i);
        optionObj = { ...optionObj, [str]: 0 };
      }
      const optionHash = await client.hSet(
        `poll:${newPoll._id.toString()}_votes`,
        optionObj,
      );

      return res.status(200).json({ message: "SUCCESS" });
    } catch (err) {
      return res.status(500).json({ message: `Something went wrong, ${err}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
