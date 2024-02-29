"use client"
import DeployCard from "@/components/DeployCard";
import Logs from "@/components/Logs";
import { useDispatch } from 'react-redux';
import React from "react";
import { Inter as FontSans } from "next/font/google"

import { cn } from "../lib/utils"
import { useEffect } from "react";
import { socketConnect, socketDisconnect, socketOnConnect, socketOnDisconnect } from "@/lib/redux/socketSlice";
import { Navbar } from "@/components/Navbar";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { AccessDeniedScreen } from 'supertokens-auth-react/recipe/session/prebuiltui';
import { UserRoleClaim, PermissionClaim } from 'supertokens-auth-react/recipe/userroles';
import { useRouter } from 'next/navigation'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function Page(): JSX.Element {
  const dispatch = useDispatch()
  const router = useRouter();

  useEffect(() => {
    dispatch(socketConnect());

    dispatch(socketOnConnect(() => {
      console.log("Connected to socket server");
    }));

    dispatch(socketOnDisconnect(() => {
      console.log("Disconnected from socket server");
    }))

    return () => {
      if (dispatch) {
        dispatch(socketDisconnect());
      }
    };

  }, []);

  return (
    <SessionAuth
      onSessionExpired={() => {
        console.log("Session expired");
        router.push("/auth");
        //Redirect to /auth

      }}
      accessDeniedScreen={AccessDeniedScreen} overrideGlobalClaimValidators={(globalValidators) => [
        ...globalValidators, UserRoleClaim.validators.includes("test_user"), PermissionClaim.validators.includes("access"),]}>
      <>          <Navbar />
        <main className={cn("justify-center items-center p-5 flex flex-col", fontSans.className)}>
          <div className="font-sans space-y-5 w-2/5">
            <h1 className="font-bold text-5xl">Auto deploy</h1>
            <h2 className="text-gray-600">Connect your GitHub repository and deploy with a single click.</h2>
            <DeployCard />
            <Logs />
          </div>
        </main>
      </>
    </SessionAuth >
  );
}
