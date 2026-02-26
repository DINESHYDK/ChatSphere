import savePollVotesDB from "@/utils/save-poll-votes-db";
import client from "@/config/redis";

export default async function handler(req, res) {
  try {
    await client.hSet("poll_metadata", "699085aad465739acaa69f22", "G");

    const res3 = await client.hSet("699085aad465739acaa69f22_sync_voters", {
      "697606ea3d55907aa7ef5845": "1",
    }); // const result = await client.hScan("699085aad465739acaa69f22_sync_votes", '0');
    // console.log(result);

    // result.entries.forEach((val) => {
    //   console.log(val.value);
    // });
    // await savePollVotesDB();
    return res.status(200).json({ message: "hello" });
  } catch (err) {
    res.status(404).json({ message: "X" });
    console.log(err);
  }
}

// /home/vishesh/chatsphere/pages/api/testing.js
// /home/vishesh/chatsphere/pages/api/testing.js
