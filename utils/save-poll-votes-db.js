// save polls from redis to db in bulk.

import PollVoteModel from "@/models/Polls/PollVoteModel";
import PollModel from "@/models/Polls/PollModel";
import client from "@/config/redis";
import connectToDatabase from "@/config/mongoose";

export default async function savePollVotesDB() {
  try {
    await connectToDatabase();

    const SYNC_HASH_NAME = "polls_to_sync";
    let cursor = "0";
    const POLLIDs = [];

    do {
      const result = await client.sscan(SYNC_HASH_NAME, cursor);

      cursor = result[0]; // Next cursor
      POLLIDs.push(...result[1]); // Current batch of elements
    } while (cursor !== "0");

    for (const pollId of POLLIDs) {
      const POLL_VOTERS_SYNC_HASH_NAME = `${pollId}_sync_voters`; // map == <user_id, {gender, option}>
      const POLL_VOTES_HASH_NAME = `poll_${pollId}_votes`; // map == <option,  votes>
      const POLL_VOTERS_HASH_NAME = `poll_${pollId}_voters`; // map == <user_id, option>

      let poll = await PollModel.findById(pollId);
      let total_votes = 0;

      const POLL_VOTES_HASH = await client.hgetall(POLL_VOTES_HASH_NAME);

      for (const [idx, no_of_votes] of Object.entries(POLL_VOTES_HASH)) {
        const poll_option = poll.pollOptions[idx].toObject();
        poll.pollOptions[idx] = {
          ...poll_option,
          votesCount: parseInt(no_of_votes, 10),
        };
        total_votes += parseInt(no_of_votes, 10);
      }

      poll.totalVotes = total_votes;
      await poll.save();

      const POLL_VOTERS_SYNC_HASH = await client.hgetall(
        POLL_VOTERS_SYNC_HASH_NAME,
      );

      let pollObjArr = [];
      for (const [userId, tuple] of Object.entries(POLL_VOTERS_SYNC_HASH)) {
        const { g, o } = tuple;
        let currObj = {
          pollId,
          userId,
          optionIndex: o,
          userGender: g,
        };
        pollObjArr.push(currObj);
      }

      const NEW_HASH_NAME = `${pollId}_sync_processing`; // rename to avoid lost update
      await client.rename(POLL_VOTERS_SYNC_HASH_NAME, NEW_HASH_NAME);
      await PollVoteModel.insertMany(pollObjArr);
      await client.del(NEW_HASH_NAME);

      await client.srem(SYNC_HASH_NAME, pollId);
    }
    await client.del(SYNC_HASH_NAME);
  } catch (err) {
    throw err;
  }
}
