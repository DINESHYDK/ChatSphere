import connectToDatabase from "@/config/mongoose";
import PollModel from "@/models/Polls/PollModel";
import isValidUrl from "@/utils/isValidURL";
import client from "@/config/redis";
import fs from "fs";
import { ABSOLUTE_PATHS } from "@/constants/absolute-paths";
import GET_STATUS_AND_MESSAGE from "@/constants/get-status-and-message";

export default async function SavePoll(req, res) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const userId = JSON.parse(req.headers.session_info ?? "{}")._id;
      if (!userId) return res.status(401).json({ message: "UNAUTHENTICATED" });

      const { title, gender, pollOptions } = req.body.pollData ?? {};
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

      const LUA_FILE_PATH = ABSOLUTE_PATHS.LUA.ADD_POLL;
      const POLL_NAME = `poll_${newPoll._id.toString()}_votes`;
      const len = pollOptions.length;

      await newPoll.save();
      try {
        const data = fs.readFileSync(LUA_FILE_PATH, "utf-8");
        const result = await client.eval(
          data,
          [POLL_NAME, newPoll._id.toString()],
          [len.toString(), gender],
        );

        const { STATUS_CODE, MESSAGE } = GET_STATUS_AND_MESSAGE[result];

        return res.status(STATUS_CODE).json({ message: MESSAGE });
      } catch (err) {
        return res
          .status(500)
          .json({ message: `SOMETHING WENT WRONG, ${err.message}` });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: `SOMETHING WENT WRONG, ${err.message}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
