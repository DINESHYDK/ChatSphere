import PollVoteModel from "@/models/Polls/PollVoteModel";
import PollModel from "@/models/Polls/PollModel";
import client from "@/config/redis";
import connectToDatabase from "@/config/mongoose";
import mongoose from "mongoose";

export default async function savePollVotesDB() {
  try {
    await connectToDatabase();

    const BULK_VOTES_TO_UPDATE = [];
    let BULK_VOTERS_TO_WRITE = [];

    const POLL_IDs = await client.sMembers("polls");
    await client.rename("polls", "polls_to_sync");

    const promises = POLL_IDs.map(async (POLL_ID) => {
      const POLL_VOTES_HASH_NAME = `poll_${POLL_ID}_votes`;
      const POLL_VOTERS_HASH_NAME = `poll_${POLL_ID}_voters`;

      const POLL_VOTES_OBJ = {
        updateMany: {
          filter: {
            _id: new mongoose.Types.ObjectId(POLL_ID),
          },
        },
      };

      const poll_votes = await client.hGetAll(POLL_VOTES_HASH_NAME);
      const popular_votes = Object.entries(poll_votes)
        .map((k, v) => [parseInt(k[0]), parseInt(k[1])])
        .filter((obj) => obj.v != 0);

      const total_options = poll_votes.length;

      let total_change_in_votes = 0;
      const update = { $inc: {} };
      const arrayFilters = [];

      for (const [option_no, change_in_votes] of popular_votes) {
        update["$inc"][`pollOptions.$[i${option_no}].votesCount`] =
          change_in_votes; // only option_no will hit error
        arrayFilters.push({ [`i${option_no}.index`]: parseInt(option_no) });

        total_change_in_votes += change_in_votes;
      }

      update["$inc"]["totalVotes"] = total_change_in_votes;

      POLL_VOTES_OBJ["updateMany"] = {
        ...POLL_VOTES_OBJ["updateMany"],
        update,
        arrayFilters,
      };

      BULK_VOTES_TO_UPDATE.push(POLL_VOTES_OBJ);

      const poll_voters = await client.hGetAll(POLL_VOTERS_HASH_NAME);

      for (const [userId, optionIndex] of Object.entries(poll_voters)) {
        BULK_VOTERS_TO_WRITE.push({
          pollId: new mongoose.Types.ObjectId(POLL_ID),
          userId: new mongoose.Types.ObjectId(userId),
          optionIndex: parseInt(optionIndex),
        });
      }

      await client.del(POLL_VOTES_HASH_NAME);
      await client.del(POLL_VOTERS_HASH_NAME);
    });
    await Promise.all(promises);

    await client.del("polls_to_sync");
    await PollModel.bulkWrite(BULK_VOTES_TO_UPDATE);
    await PollVoteModel.insertMany(BULK_VOTERS_TO_WRITE);
    await client.set("last_sync_time", Date.now());
  } catch (err) {
    throw err;
  }
}
