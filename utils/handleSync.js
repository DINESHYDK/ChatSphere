import client from "@/config/redis";
import savePollVotesDB from "./save-poll-votes-db";

export default async function handleSync() {
  try {
    const last_updation_time = (await client.get("last_sync_time")) || 0;
    const sync_set_sz = (await client.scard("poll_to_sync")) || 0;

    if (sync_set_sz > 100 || Date.now() - last_updation_time > 2 * 60 * 1000) {
      await savePollVotesDB();
      await client.set("last_sync_time", Date.now());
    }
  } catch (err) {
    throw err;
  }
}
