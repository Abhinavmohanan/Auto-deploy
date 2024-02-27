import { redis } from "redis-config";
import { Server } from "socket.io";
require("dotenv").config();

const port = parseInt(process.env.PORT!) || 3000;

const io = new Server({
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("subscribe", async (channel) => {
    socket.join(`logs:${channel}`);
    console.log("Client joined " + channel);
    socket.emit("log", `Starting deployment of ${channel}`);
  });
});

const initRedis = async () => {
  redis.psubscribe("logs:*");
  redis.on("pmessage", (pattern, channel, message) => {
    console.log("To " + channel + " " + message);
    io.to(channel).emit("log", message);
  });
  redis.on("error", function (err) {
    console.error("Redis error:", err);
    redis.connect();
  });
  redis.on("connection", () => {
    console.log("Connected to Redis");
  });
};

initRedis();

io.listen(port);
