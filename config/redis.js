import { Redis } from "@upstash/redis";

// Clean, stateless initialization
const client = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default client;
