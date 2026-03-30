import connectToDatabase from "@/config/mongoose";
import checkAuthAndCookie from "@/utils/checkAuth";
import client from "@/config/redis";
import fs from "fs";
import savePollVotesDB from "@/utils/save-poll-votes-db";
import validateId from "@/utils/validateId";
import GET_STATUS_AND_MESSAGE from "@/constants/get-status-and-message";
import { ABSOLUTE_PATHS } from "@/constants/absolute-paths";

export default async function SavePollVotes(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });
      if (obj.statusCode === 500) throw obj;

      const { _id, gender } = obj.message;
      const USER_ID = _id.toString();

      const POLL_ID = req.body.poll_id;
      const OPTION_IDX = parseInt(req.body.option_idx, 10);

      if (!validateId(POLL_ID) || typeof OPTION_IDX != "number") {
        return res.status(400).json({ message: "INVALID_REQUEST" });
      }

      const LUA_FILE_PATH = ABSOLUTE_PATHS.LUA.ADD_POLL_VOTES;
      const HASH_NAME = `poll_${POLL_ID}_voters`;
      const POLL_NAME = `poll_${POLL_ID}_votes`;

      try {
        const data = fs.readFileSync(LUA_FILE_PATH, "utf-8");
        const result = await client.eval(data, {
          keys: [HASH_NAME, POLL_NAME, USER_ID, POLL_ID.toString()],
          arguments: [OPTION_IDX.toString(), gender],
        });

        const MAX_SYNC_SET_SIZE = process.env.MAX_SYNC_SET_SIZE || "100";
        const sync_set_sz = (await client.sCard("polls_to_sync")) || 0;
        if (sync_set_sz > parseInt(MAX_SYNC_SET_SIZE, 10)) {
          await savePollVotesDB();
          await client.set("last_sync_time", Date.now());
        }

        const { STATUS_CODE, MESSAGE } = GET_STATUS_AND_MESSAGE[result];
        return res.status(STATUS_CODE).json({ message: MESSAGE });
      } catch (err) {
        return res
          .status(500)
          .json({ message: `SOMETHING WENT WRONG, ${err.message}` });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: `SOMETHING WENT WRONG, ${err.message}` });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// pages/api/poll/save-poll-votes.js
