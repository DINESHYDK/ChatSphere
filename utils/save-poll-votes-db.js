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
        const POLL_VOTERS_SYNC_HASH_NAME = `${pollId}_sync_voters`;
        const POLL_VOTES_HASH_NAME = `poll_${pollId}_votes`;
        const POLL_VOTERS_HASH_NAME = `poll_${pollId}_voters`;

        let poll = await PollModel.findById(pollId);
        let total_votes = 0;

        const votes_set = await client.hScan(POLL_VOTES_HASH_NAME, "0");
        votes_set.entries.forEach((tuple, idx) => {
          const prev_option = poll.pollOptions[idx].toObject();
          poll.pollOptions[idx] = {
            ...prev_option,
            votesCount: parseInt(tuple.value, 10),
          };
          total_votes += parseInt(tuple.value, 10);
        });

        poll.totalVotes = total_votes;

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

        await client.rename(POLL_VOTERS_SYNC_HASH_NAME, `${pollId}_sync_processing`);
        // await PollVoteModel.insertMany(pollObjArr);
        await client.del(`${pollId}_sync_processing`);

        await client.sRem(SYNC_HASH_NAME, pollId);
      });
    }
   await client.del(SYNC_HASH_NAME);
  } catch (err) {
    throw err;
  }
}
