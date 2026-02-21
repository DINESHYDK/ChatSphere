import PollVoteModel from "@/models/Polls/PollVoteModel";
import PollModel from "@/models/Polls/PollModel";
import client from "@/config/redis";
import connectToDatabase from "@/config/mongoose";

export default async function savePollVotesDB() {
  try {
    await connectToDatabase();
    const SYNC_HASH_NAME = "polls_to_sync";

    for await (const POLL_IDs of client.sScanIterator(SYNC_HASH_NAME)) {
      POLL_IDs.forEach(async (pollId) => {
        const POLL_VOTES_SYNC_HASH_NAME = `${pollId}_sync_votes`;
        const POLL_VOTERS_SYNC_HASH_NAME = `${pollId}_sync_voters`;

        let poll = await PollModel.findById(pollId);

        const poll_promiseArr = poll.pollOptions.map(async (option, idx) => {
          let new_votes_str = await client.hGet(
            POLL_VOTES_SYNC_HASH_NAME,
            idx.toString(),
          );
          const new_votes = parseInt(new_votes_str || "0", 10);
          option = { ...option, votesCount: option.votesCount + new_votes };

          return option;
        });

        poll.pollOptions = await Promise.all(poll_promiseArr);
        // await poll.save();

        const voters_hash = await client.hScan(POLL_VOTERS_SYNC_HASH_NAME, "0");
        let pollObjArr = [];
        voters_hash.entries.forEach((tuple) => {
          let currObj = {
            pollId,
            userId: tuple.field,
            optionIdx: parseInt(tuple.value, 10),
          };

          pollObjArr.push(currObj);
        });
        
        console.log(pollObjArr);
      });
    }
  } catch (err) {
    throw err;
  }
}
