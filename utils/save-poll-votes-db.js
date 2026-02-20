// import PollVoteModel from "@/models/Polls/PollVoteModel";
import PollModel from "@/models/Polls/PollModel";
import client from "@/config/redis";
import connectToDatabase from "@/config/mongoose";

export default async function savePollVotesDB() {
  try {
    await connectToDatabase();
    const SYNC_HASH_NAME = "polls_to_sync";

    for await (const IDs of client.sScanIterator(SYNC_HASH_NAME)) {
      IDs.forEach(async (id) => {
        const POLL_VOTES_SYNC_HASH_NAME = `${id}_sync_votes`;
        const POLL_VOTERS_SYNC_HASH_NAME = `${id}_sync_voters`;

        // console.log(POLL_VOTERS_SYNC_HASH_NAME);
        let poll = await PollModel.findById(id);
        console.log('poll is ', poll);

        const option_length = poll.pollOptions.length;
        for (let i = 0; i < option_length; i++) {
          let new_votes = await client.hGet(POLL_VOTES_SYNC_HASH_NAME, toString(i));
          
          poll.pollOptions[i] = {
            ...poll.pollOptions[i],
            votesCount: poll.pollOptions[i].votesCount + new_votes,
          };
        }
        await poll.save();
        console.log('done');
      });
    }
  } catch (err) {
    console.log("err is ", err);
  }
}
