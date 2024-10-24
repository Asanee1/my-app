"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex justify-between items-center shadow-md p-5 bg-white">
      <div className="flex items-center w-[90%] mx-auto">
        <Link href={session ? "/welcome" : "/"}>
          <div className="flex items-center">
            <Image
              src="/images/Applogo.png"
              width={70}
              height={70}
              alt="mylogo"
            />
            <h2 className="text-[45px] uppercase text-purple-600 duration-700 ml-4">
              NEWS
              <span className="text-[45px] uppercase text-black duration-700">
                FOOTBALL
              </span>
            </h2>
          </div>
        </Link>

        <div className="flex-1 flex justify-center lg:justify-start ml-16">
          <ul className="hidden lg:flex items-center space-x-16 text-black">
            <li className="text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
              <Link href={session ? "/welcome" : "/"}>HOME</Link>
            </li>
            <li className="relative text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                League
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <ul className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-60 z-50 text-sm">
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2 text-xl">
                    <Link href="/premierLeague">
                      English Premier League (EPL)
                    </Link>
                  </li>
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2 text-xl">
                    <Link href="/LaLigaLeague">Spanish La Liga</Link>
                  </li>
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2 text-xl">
                    <Link href="/bundesligaLeague">German Bundesliga</Link>
                  </li>
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2 text-xl">
                    <Link href="/SerieALeague">Italian Serie A</Link>
                  </li>
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2 text-xl">
                    <Link href="/Ligue1League">French Ligue 1</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
              <Link href="/livescore">LIVE SCORE</Link>
            </li>
            <li className="text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
              <Link href="#">About</Link>
            </li>
            <li className="text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
              <Link href="#">NEWS</Link>
            </li>
          </ul>
        </div>

        <ul className="flex items-center space-x-4">
          {!session ? (
            <>
              <li>
                <Link href="/login">
                  <button className="btn btn-outline btn-primary text-xl">
                    LOGIN
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <button className="btn btn-active btn-primary text-xl">
                    REGISTER
                  </button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/profile">
                  <button className="btn btn-success text-xl">Profile</button>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="btn btn-error text-xl"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
