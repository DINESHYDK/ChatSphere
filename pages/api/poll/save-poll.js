import connectToDatabase from "@/config/mongoose";
import PollModel from "@/models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import isValidUrl from "@/utils/isValidURL";
import client from "@/config/redis";
import fs from "fs";
import { ROOT_DIR } from "@/config/paths";

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

      const newPoll = new PollModel({
        userId,
        title,
        pollOptions,
        gender,
      });
      await newPoll.save();

      // calling lua script
      const file_path = `${ROOT_DIR}/redis-scripts/add-poll.lua`;
      const poll_name = `poll_${newPoll._id.toString()}_votes`;
      const len = pollOptions.length;

      fs.readFile(file_path, "utf-8", async (err, data) => {
        if (err)
          return res.status(404).json({ error: "ERROR_READING_LUA_FILE" });
        try {
          const result = await client.eval(data, {
            keys: [poll_name, newPoll._id.toString()],
            arguments: [len.toString(), gender],
          });
          return res.status(200).json({ message: "SUCCESS" });
        } catch (err) {
          // const message =  err.message.split(" ")[1];
          console.log('obj is ', JSON.parse(message));
          return res.status(400).json({ error: err.message });
        }
      });
    } catch (err) {
      return res.status(500).json({ message: `Something went wrong, ${err}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
