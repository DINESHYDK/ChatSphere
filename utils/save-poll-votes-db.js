// import PollVoteModel from "@/models/Polls/PollVoteModel";
// import PollModel from "@/models/Polls/PollModel";
import client from "@/config/redis";

// export default async function savePollVotesDB(poll_arr) {
export default async function savePollVotesDB() {
  console.log("running");
  // const len = poll_arr.length;
  if (length == 0) return;
  // for (let poll_id of poll_arr) {
  //   const poll_votes_sync_hash = `${poll_id}_sync_votes`; // key->option value->no_of_votes
  //   const poll_voters_sync_hash = `${poll_id}_sync_votes`; // key->user_id value->option

  // }
  try {
    const res7 = await client.hSet("myhash", "field1", "foo");
    console.log(res7); // 1
    // const option = await client.
    //  const scan4Res2 = await client.hScan("poll_6991b03a62732d8272e238ee_votes", "0");
  } catch (err) {
    console.log("err is ", err);
  }
  console.log(scan4Res2.entries);
  // const syncArr = JSON.parse(poll_arr_json_string);
  // const poll_sync_votes_hash = ``;
}
