'use client';
import Image from "next/image";
import Homenews from "./Homenews/page";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {


  return (
    <main>
        <Homenews />
    </main>
    
  );
}