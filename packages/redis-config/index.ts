import Redis from "ioredis";
require("dotenv").config();
const redisUri = process.env.REDIS_URI;
export const redis = new Redis(redisUri!);
