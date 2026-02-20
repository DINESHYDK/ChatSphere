import savePollVotesDB from "@/utils/save-poll-votes-db";
import client from "@/config/redis";

export default async function handler(req, res) {
  try {
    await savePollVotesDB();
    return res.status(200).json({ message: "hello" });
  } catch (err) {
    res.status(404).json({ message: "X" });
    console.log(err);
  }
}

// /home/vishesh/chatsphere/pages/api/testing.js
// /home/vishesh/chatsphere/pages/api/testing.js
