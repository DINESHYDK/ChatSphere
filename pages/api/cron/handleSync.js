import client from "@/config/redis";
import savePollVotesDB from "@/utils/save-poll-votes-db";

export default async function handleSync(req, res) {
  try {
    const CRON_API_SECRET = process.env.API_SECRET_HEADER;

    if (req.headers.authorization !== `Bearer ${CRON_API_SECRET}`)
      return res.status(403).json({ message: "NOT_ALLOWED" });

    const MAX_SYNC_TIME = parseInt(process.env.MAX_SYNC_TIME || "120000");
    const last_sync_time = await client.get("last_sync_time");

    if (last_sync_time && Date.now() - parseInt(last_sync_time) < MAX_SYNC_TIME)
      return res.status(200).json({ message: "POLL_SYNCED" });
    await savePollVotesDB();
    await client.set("last_sync_time", Date.now());

    return res.status(200).json({ message: "POLL_SYNCED" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "ERROR_SYNCING_POLLS" });
  }
}
