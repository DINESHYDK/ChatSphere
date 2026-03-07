export default async function handleSync(req, res) {
  try {
    const MAX_SYNC_TIME = parseInt(process.env.MAX_SYNC_TIME || "120000");
    let last_sync_time = parseInt(await client.get("last_sync_time"));

    if (Date.now() - last_sync_time < MAX_SYNC_TIME)
      return res.status(200).json({ message: "Success" });
    await savePollVotesDB();
    await client.set("last_sync_time", Date.now());
  } catch (err) {
    return res.status(500).json({ message: "ERROR_SYNCING_POLLS" });
    throw err;
  }
}

