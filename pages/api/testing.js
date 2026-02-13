import { ROOT_DIR } from "@/config/paths";
import fs from "fs";
import client from "@/config/redis";

export default function handler(req, res) {
  try {
    const file_path = `${ROOT_DIR}/redis-scripts/add-poll-votes.lua`;
    const hash_name = "poll_123_votes";
    const poll_name = "poll_123";
    const userId = "user123"
    

    fs.readFile(file_path, "utf-8", async (err, data) => {
      if (err) return res.status(404).json({ error: "ERROR_READING_LUA_FILE" });
      try {
        const result = await client.eval(data, {
          keys: [hash_name, poll_name, userId],
          arguments: ["B"],
        });
        return res.status(200).json({ message: "SUCCESS" });
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    });

    res.status(200).json({ message: "Hello from the API!" });
  } catch (err) {
    res.status(404).json({ message: "X" });
    console.log(err);
  }
}
// pages/api/testing.js
