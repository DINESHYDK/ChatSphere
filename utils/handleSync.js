import client from "@/config/redis";
import savePollVotesDB from "./save-poll-votes-db";

const MAX_TIME_LIMIT = 2 * 60 * 1000;
const MAX_SYNC_SET_SIZE = 100;

export async function handleSync() {
  try {
    const sync_set_sz = (await client.scard("poll_to_sync")) || 0;

    if (sync_set_sz > MAX_SYNC_SET_SIZE) {
      await savePollVotesDB();
      await client.set("last_sync_time", Date.now());
    }
  } catch (err) {
    throw err;
  }
}

export async function startSyncTime() {
  try {
    const myInterval = setInterval(() => {

    }, MAX_TIME_LIMIT);
    
    const last_sync_time = (await client.get("last_sync_time")) || 0;
    if (Date.now() - last_sync_time > MAX_TIME_LIMIT) {
      await savePollVotesDB();
      await client.set("last_sync_time", Date.now());
    }
  } catch (err) {
    throw err;
  }
}
