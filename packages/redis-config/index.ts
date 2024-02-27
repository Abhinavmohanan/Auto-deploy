import Redis from "ioredis";
require("dotenv").config();
export const redis = new Redis("redis://redis:6379", {
  port: 6379,
  autoResubscribe: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000); // delay in milliseconds
    return delay;
  },
});
