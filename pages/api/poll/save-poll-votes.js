import connectToDatabase from "@/config/mongoose";
import PollVoteModel from "@/models/Polls/PollVoteModel";
import PollModel from "@/models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import savePollVotesDB from "@/utils/save-poll-votes-db";
import { ROOT_DIR } from "@/config/paths";
import client from "@/config/redis";
import fs from "fs";

export default async function SavePollVotes(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj) return res.status(500).json({ message: "AUTH_ERROR" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const { _id, userName, gender } = obj.message; // *** _id already a string ***
      const { poll_id, option_idx } = req.body; // *** option_idx is a string ***

      if (typeof poll_id !== "string" || typeof option_idx !== "number")
        return res.status(400).json({ message: "INVALID_REQUEST" });
       
      // const t1 = Date.now()
      const poll = await PollModel.findById(poll_id);
      if (!poll) return res.status(400).json({ message: "INVALID_REQUEST" });
      // console.log("t1: ", Date.now() - t1);

      // *** Gender-Check  ***
      const poll_gender = poll.gender;
      if (poll_gender != "A" && gender != poll_gender)
        return res.status(400).json({ message: "INVALID_REQUEST" });

      // *** Invalid-option check ***
      if (option_idx < 0 || option_idx > poll.pollOptions.length - 1)
        return res.status(400).json({ message: "INVALID_REQUEST" });

      const file_path = `${ROOT_DIR}/redis-scripts/add-poll-votes.lua`;
      const hash_name = `poll_${poll_id}_voters`;
      const poll_name = `poll_${poll_id}_votes`;

      let response_obj = {};
      let response_status;

      // const t2 = Date.now()
      const user_vote = await PollVoteModel.findOne({
        pollId: poll_id,
        userId: _id,
      });
      // console.log("t2: ", Date.now() - t2);

      if (user_vote) {
        if (user_vote.optionIdx == option_idx)
          return res.status(200).json({ message: "SUCCESS, VOTE_POLLED" });

        // const t3 = Date.now()
        await PollVoteModel.deleteOne(user_vote);
        client.hIncrBy(poll_name, user_vote.option_idx.toString(), -1);
        // console.log("t3: ", Date.now() - t3);
      }

      try {
        const content = fs.readFileSync(file_path, "utf-8");
        const keys = [hash_name, poll_name, _id, poll_id];
        const args = [option_idx.toString(), gender];

        // const t4 = Date.now()
        const result_string = await client.eval(content, {
          keys,
          arguments: args,
        });
        // console.log("t4: ", Date.now() - t4);

        response_obj = JSON.parse(result_string);
        response_status = parseInt(response_obj.status);

        // await savePollVotesDB();
        const MAX_SYNC_SET_SIZE = process.env.MAX_SYNC_SET_SIZE || "100";
        const SYNC_SET_SIZE =
          (await client.scard("polls")) || 1 + MAX_SYNC_SET_SIZE;

        if (SYNC_SET_SIZE > parseInt(MAX_SYNC_SET_SIZE, 10)) {
          await savePollVotesDB();
          await client.set("last_sync_time", Date.now());
        }
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }

      // console.log(response_obj);
      return res
        .status(response_status)
        .json({ message: response_obj.message });
    } catch (err) {
      return res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
