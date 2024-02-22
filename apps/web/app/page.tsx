"use client"
import DeployCard from "@/components/DeployCard";
import Logs from "@/components/Logs";
import React from "react";


export default function Page(): JSX.Element {

  return (
    <main className="justify-center items-center p-5 flex flex-col">
      <div className="font-sans space-y-5 w-2/5">
        <h1 className="font-bold text-5xl">Auto deploy</h1>
        <h2 className="text-gray-600">Connect your GitHub repository and deploy with a single click.</h2>
        <DeployCard />
        <Logs />
      </div>
    </main>
  );
}
