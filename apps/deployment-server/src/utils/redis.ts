import { redis } from "redis-config";

//Publish logs

export const publishLogs = async (project_name: string, logs: string[]) => {
  logs.forEach(async (log) => {
    await redis.publish(`logs:${project_name}`, log);
  });
};
