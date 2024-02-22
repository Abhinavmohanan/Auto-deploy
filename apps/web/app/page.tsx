"use client"
import DeployCard from "@/components/DeployCard";
import Logs from "@/components/Logs";
import React from "react";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@repo/typescript-config"

const socketUrl = process.env.NEXT_PUBLIC_LOG_SERVER


export default function Page(): JSX.Element {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(socketUrl!, { autoConnect: false });

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <main className="justify-center items-center p-5 flex flex-col">
      <div className="font-sans space-y-5 w-2/5">
        <h1 className="font-bold text-5xl">Auto deploy</h1>
        <h2 className="text-gray-600">Connect your GitHub repository and deploy with a single click.</h2>
        <DeployCard socket={socket} />
        <Logs socket={socket} />
      </div>
    </main>
  );
}
