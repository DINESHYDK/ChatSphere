import connectToDatabase from "@/config/mongoose";
import PollVoteModel from "@/models/Polls/PollVoteModel";
import UserModel from "@/models/User/UserModel";
import PollModel from "@/models/Polls/PollModel";
import checkAuthAndCookie from "@/utils/checkAuth";
import handleSync from "@/utils/handleSync";
import { ROOT_DIR } from "@/config/paths";
import client from "@/config/redis";
import fs from "fs";
import { hash } from "crypto";

// function checkRedisEdgeCases(keys, args) {
//   for (const key of keys) {
//     if (!key || typeof key != "string") return false;
//   }
//   for (const arg of args) {
//     if (!arg || typeof arg != "string") return false;
//   }
// }

export default async function SavePollVotes(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const obj = await checkAuthAndCookie(req);
      if (!obj)
        return res.status(500).json({ message: "SOMETHING_WENT_WRONG(AUTH)" });
      if (obj.statusCode === 401)
        return res.status(401).json({ message: obj.message });

      const { _id, gender } = obj.message; // *** _id already a string ***
      const { poll_id, option_idx } = req.body;

      const file_path = `${ROOT_DIR}/redis-scripts/add-poll-votes.lua`;
      const hash_name = `poll_${poll_id}_voters`;
      const poll_name = `poll_${poll_id}_votes`;

      let response_obj = {};
      let response_status;

      try {
        const content = fs.readFileSync(file_path, "utf-8");
        const result_string = await client.eval(content, {
          keys: [hash_name, poll_name, _id, poll_id],
          arguments: [option_idx, gender],
        });

        response_obj = JSON.parse(result_string);
        response_status = parseInt(response_obj.status);

        // const t1 = Date.now()
        // await handleSync();
        // console.log(Date.now() - t1);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
      return res
        .status(response_status)
        .json({ message: response_obj.message });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error: " });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
