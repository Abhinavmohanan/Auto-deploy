import Redis from "ioredis";
require("dotenv").config();
const redisUri = process.env.REDIS_URI;
export const redis = new Redis(redisUri!, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000); // delay in milliseconds
    return delay;
  },
});
