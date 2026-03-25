import connectToDatabase from "@/config/mongoose";
import PollModel from "@/models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import isValidUrl from "@/utils/isValidURL";
import client from "@/config/redis";
import fs from "fs";
import { ABSOLUTE_PATHS } from "@/constants/absolute-paths";
import GET_STATUS_AND_MESSAGE from "@/constants/get-status-and-message";
import { resolveSoa } from "dns";

export default async function SavePoll(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message }); 
      if (obj.statusCode === 500) throw obj;

      const userId = obj.message._id;

      const { title, gender, pollOptions } = req.body.pollData || {};
      if (!title || !gender || !pollOptions)
        return res.status(400).json({ message: "MISSING_INPUT" });
      for (let options of pollOptions) {
        if (options.imageUrl !== "" && !isValidUrl(options.imageUrl))
          return res.status(400).json({ message: "INVALID_REQUEST" });
      }

      if (pollOptions.length > 6)
        return res.status(400).json({ message: "INVALID_REQUEST" });

      const newPoll = new PollModel({
        userId,
        title,
        pollOptions,
        gender,
      });
      await newPoll.save();

      const LUA_FILE_PATH = ABSOLUTE_PATHS.LUA.ADD_POLL;
      const POLL_NAME = `poll_${newPoll._id.toString()}_votes`;
      const len = pollOptions.length;

      try {
        const data = await fs.readFileSync(LUA_FILE_PATH, "utf-8");
        const result = await client.eval(data, {
          keys: [POLL_NAME, newPoll._id.toString()],
          arguments: [len.toString(), gender],
        });

        const { STATUS_CODE, MESSAGE } = GET_STATUS_AND_MESSAGE[result];

        return res.status(STATUS_CODE).json({ message: MESSAGE });
      } catch {
        return res
          .status(500)
          .json({ message: `SOMETHING WENT WRONG, ${err.message}` });
      }
    } catch (err) {
      return res.status(500).json({ message: `SOMETHING WENT WRONG, ${err.message}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
