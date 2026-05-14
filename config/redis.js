// import { createClient } from "redis";

// let client = global.client;
// if (!client) {
//   client = global.client = createClient({
//     url: `redis://${process.env.REDIS_URL}`,
//   });
//   client.connect();
// }
// client.on("error", (err) => console.log("Redis Client Error", err));
// export default client

import { Redis } from "@upstash/redis";
let client = global.client;

if (!client) {
  client = global.client = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// await redis.set("foo", "bar");
// await redis.get("foo");
export default client;
