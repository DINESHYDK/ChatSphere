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
        return res.status(500).json({ message: "AUTH_ERROR" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const userId = obj.message._id;

      const { title, gender, pollOptions } = req.body.pollData;
      if (!title || !gender || !pollOptions)
        return res.status(400).json({ message: "MISSING_INPUT" });
      for (let options of pollOptions) {
        if (options.imageUrl !== "" && !isValidUrl(options.imageUrl))
          return res.status(400).json({ message: "INVALID_IMAGE_URL" });
      }

      const newPoll = new PollModel({
        userId,
        title,
        pollOptions,
        gender,
      });
      await newPoll.save();

      let response_obj = {};
      let response_status;

      // calling lua script
      const file_path = `${ROOT_DIR}/redis-scripts/add-poll.lua`;
      const poll_name = `poll_${newPoll._id.toString()}_votes`;
      const len = pollOptions.length;

      try {
        const content = fs.readFileSync(file_path, "utf-8");
        const result_string = await client.eval(content, {
          keys: [poll_name, newPoll._id.toString()],
          arguments: [len.toString(), gender],
        });

        response_obj = JSON.parse(result_string);
        response_status = parseInt(response_obj.status);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }

      return res
        .status(response_status)
        .json({ message: response_obj?.message ?? "SOMETHING_WENT_WRONG" });
    } catch (err) {
      return res.status(500).json({ message: `Something went wrong ${err}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
