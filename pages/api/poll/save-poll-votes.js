import connectToDatabase from "@/config/mongoose";
import PollVoteModel from "@/models/Polls/PollVoteModel";
import UserModel from "@/models/User/UserModel";
import PollModel from "../../../models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import client from "@/config/redis";
import { ROOT_DIR } from "@/config/paths";
import fs from "fs";
import savePollVotesDB from "@/utils/save-poll-votes-db";

export default async function SavePollVotes(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG(AUTH)" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const { _id, gender } = obj.message;
      const user_id = _id.toString();

      const { poll_id, option_idx } = req.body;

      const file_path = `${ROOT_DIR}/redis-scripts/add-poll-votes.lua`;
      const hash_name = `poll_${poll_id}_voters`;
      const poll_name = `poll_${poll_id}_votes`;

      fs.readFile(file_path, "utf-8", async (err, data) => {
        if (err)
          return res.status(404).json({ error: "ERROR_READING_LUA_FILE" });
        try {
          const result = await client.eval(data, {
            keys: [hash_name, poll_name, user_id, poll_id.toString()],
            arguments: [option_idx.toString(), gender],
          });

          const resObj = JSON.parse(result);
          const statusCode = parseInt(resObj.status);

          const MAX_SYNC_SET_SIZE = process.env.MAX_SYNC_SET_SIZE || "100";
          const sync_set_sz = (await client.scard("polls_to_sync")) || 0;
          if (sync_set_sz > parseInt(MAX_SYNC_SET_SIZE, 10)) {
            await savePollVotesDB();
            await client.set("last_sync_time", Date.now());
          }

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

// pages/api/poll/save-poll-votes.js
