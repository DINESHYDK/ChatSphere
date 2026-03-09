import savePollVotesDB from "@/utils/save-poll-votes-db";
import client from "@/config/redis";

export default async function handler(req, res) {
  try {
    // const res3 = await client.hSet("699085aad465739acaa69f22_sync_voters", {
    //   "697606ea3d55907aa7ef5845": "1",
    // });
    //  // const result = await client.hScan("699085aad465739acaa69f22_sync_votes", '0');
    // console.log(result);

    // result.entries.forEach((val) => {
    //   console.log(val.value);
    // });


    const res1 = await client.sAdd('polls_to_sync', '69af074745d2a07d716ee197');

    // await savePollVotesDB();
    console.log('hello');
    return res.status(200).json({ message: "hello" });
  } catch (err) {
    res.status(404).json({ message: "X" });
    console.log(err);
  }
}

// /home/vishesh/chatsphere/pages/api/testing.js
// /home/vishesh/chatsphere/pages/api/testing.js
// pages/api/testing.js