import connectToDatabase from "../../../config/mongoose";
import PollVoteModel from "../../../models/Polls/PollVoteModel";
import UserModel from "../../../models/User/UserModel";
import PollModel from "../../../models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import { ROOT_DIR } from "@/config/paths";
import fs from "fs";

export default async function SavePollVotes(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG(AUTH)" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const userId = obj.message._id;

      const { pollId, optionIndex } = req.body;

      if (!pollId) return res.status(400).json({ message: "MISSING_POLL_ID" });

      poll.pollOptions[optionIndex].votesCount =
        poll.pollOptions[optionIndex].votesCount + 1;
      poll.totalVotes = poll.totalVotes + 1;
      await poll.save();

      const newPollVote = await PollVoteModel.create({
        pollId,
        userId,
        optionIndex,
        userGender,
      });

      fs.readFile(file_path, "utf-8", async (err, data) => {
        if (err)
          return res.status(404).json({ error: "ERROR_READING_LUA_FILE" });
        try {
          const result = await client.eval(data, {
            keys: [hash_name, poll_name, userId],
            arguments: ["B"],
          });

          const resObj = JSON.parse(result);
          const statusCode = parseInt(resObj.status);

          return res.status(statusCode).json({ message: resObj.message });
        } catch (err) {
          return res.status(400).json({ error: err.message });
        }
      });
    } catch (err) {
      console.log("error is", err);
      return res.status(500).json({ message: "Internal server error: " });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
