"use client"

import React from "react";
import { Teko } from "next/font/google";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from "../components/Navbar";

export default function profile() {
    const { data: session } = useSession();
    if (!session) redirect("/login");
    console.log(session)
  return (
    <div>
      <Navbar session={session} />
      <div className="flex-grow text-center p-10">
        <h3 className="text-5xl">Welcome, {session?.user?.name}</h3>
        <p className="text-2xl mt-3">
          Your email address: {session?.user?.email}
        </p>
        <p className="text-2xl mt-3">Your user role: {session?.user?.role}</p>
      </div>
    </div>
  );
}

