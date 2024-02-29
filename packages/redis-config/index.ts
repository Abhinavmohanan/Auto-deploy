import Redis from "ioredis";
require("dotenv").config();
// const redisUri = process.env.REDIS_URI;
export const redis = new Redis("redis://redis:6379" /*redisUri*/, {
  port: 6379,
  autoResubscribe: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000); // delay in milliseconds
    return delay;
  },
});
