"use client"
import { Teko } from "next/font/google";
import Image from "next/image";
import Container from "../components/Container";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NextLogo from '../../../public/next.svg'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Homenews from "../Homenews/page";
import Homeuser from "../Homeuser/page";


const teko = Teko({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Home() {

    const { data: session } = useSession();
    if (!session) redirect("/login");
    console.log(session)

  return (
    <main className={teko.className}>
      <Container>

        <Navbar session={session} />
        <Homeuser />
          <div className="flex-grow text-center p-10">
            <h3 className="text-5xl">Welcome, {session?.user?.name}</h3>
            <p className="text-2xl mt-3">Your email address: {session?.user?.email}</p>
            <p className="text-2xl mt-3">Your user role: {session?.user?.role}</p>
          </div>
        <Footer />
      </Container>
    </main>
    
  );
}
