import { createClient } from "redis";

const redisClient =
  global.redis ||
  createClient({
    url: process.env.REDIS_URL,
  });
// const redisClient = createClient();

redisClient.on("error", (err) => console.log("Redis Client Error", err));
// if (!global.redis) global.redis = redisClient;
if (!global.redis) await redisClient.connect();
global.redis = redisClient;
export default redisClient;
