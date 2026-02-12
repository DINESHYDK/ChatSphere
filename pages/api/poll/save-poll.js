import connectToDatabase from "@/config/mongoose";
import PollModel from "@/models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import isValidUrl from "@/utils/isValidURL";
import client from "@/config/redis";
import fs from "fs";

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

      const poll_name = `poll_${newPoll._id.toString()}_votes`;
      const len = pollOptions.length;

      fs.readFile(
        "/home/vishesh/chatsphere/redis-scripts/add-poll.lua",
        "utf-8",
        async (err, data) => {
          const result = await client.eval(data, {
            keys: [poll_name],
            arguments: [len.toString()],
          });
          return res.status(200).json({ result: result });
        },
      );
    } catch (err) {
      return res.status(500).json({ message: `Something went wrong, ${err}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
