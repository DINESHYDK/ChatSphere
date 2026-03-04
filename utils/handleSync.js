import client from "@/config/redis";
import savePollVotesDB from "./save-poll-votes-db";

const MAX_TIME_LIMIT = 2 * 60 * 1000;
const MAX_SYNC_SET_SIZE = 100;

let myInterval;
export async function startTimer() {
  myInterval = setInterval(() => {
    startSync();
  }, MAX_TIME_LIMIT);
  return myInterval;
}

export async function handleSync() {
  try {
    const sync_set_sz = (await client.scard("poll_to_sync")) || 0;
    if (sync_set_sz < MAX_SYNC_SET_SIZE) return;

    await savePollVotesDB();
    await client.set("last_sync_time", Date.now());
    clearInterval(myInterval);
  } catch (err) {
    throw err;
  }
}

export async function startSync() {
  try {
    clearInterval(myInterval);
    // const let_sync_time = await client.get("last_sync_time");
    

    await savePollVotesDB();
    await client.set("last_sync_time", Date.now());
    startTimer();
  } catch (err) {
    throw err;
  }
}
