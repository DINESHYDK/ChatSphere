import { ROOT_DIR } from "@/config/paths";
import fs from "fs";
import client from "@/config/redis";

export default function handler(req, res) {
  try {
    const file_path = `${ROOT_DIR}/redis-scripts/add-poll-votes.lua`;
    const hash_name = "poll_6991b03a62732d8272e238ee_voters";
    const poll_name = "poll_6991b03a62732d8272e238ee_votes";
    const userId = "user123";
    const poll_id = "6991b03a62732d8272e238ee";

    fs.readFile(file_path, "utf-8", async (err, data) => {
      if (err) return res.status(404).json({ error: "ERROR_READING_LUA_FILE" });
      try {
        const result = await client.eval(data, {
          keys: [hash_name, poll_name, userId, poll_id],
          arguments: ["3", "G"],
        });

        const resObj = JSON.parse(result);
        const statusCode = parseInt(resObj.status);

        return res.status(statusCode).json({ message: resObj.message });
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    });
  } catch (err) {
    res.status(404).json({ message: "X" });
    console.log(err);
  }
}
// pages/api/testing.js
