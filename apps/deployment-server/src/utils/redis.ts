import { redis } from "redis-config";

//Publish logs
const getCurrentDateTimeInIST = (): string => {
  const date = new Date();

  // Set the timezone to Indian Standard Time (IST)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const indianDateTime = date.toLocaleString("en-IN", options);

  // Replace commas and slashes to match the desired format
  const formattedDateTime = indianDateTime.replace(/\//g, "-").replace(/,/, "");

  return formattedDateTime; // Returns date in the format: "2024-02-22 10:30:12"
};

export const publishLogs = async (project_name: string, logs: string[]) => {
  logs.forEach(async (log) => {
    await redis.publish(
      `logs:${project_name}`,
      `[${getCurrentDateTimeInIST()}] ${log}`
    );
  });
};
