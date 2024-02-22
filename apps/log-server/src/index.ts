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
  socket.on("subscribe", (channel) => {
    socket.join(`logs:${channel}`);
    socket.emit("log", `Starting deployment of ${channel}`);
  });
});

const initRedis = async () => {
  redis.psubscribe("logs:*");
  redis.on("pmessage", (pattern, channel, message) => {
    io.to(channel).emit("log", message);
  });
};

initRedis();

io.listen(port);
