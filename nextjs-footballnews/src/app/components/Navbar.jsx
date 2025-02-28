"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // สถานะของเมนู

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // เปิด/ปิดเมนู
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // ปิดเมนูเมื่อกดปุ่มปิด
  };

  return (
    <nav className="relative flex justify-between items-center shadow-md p-5 bg-white">
      <div className="flex items-center w-[90%] mx-auto">
        <Link href={session ? "/welcome" : "/"}>
          <div className="flex items-center">
            <Image
              src="/images/Applogo.png"
              width={70}
              height={70}
              alt="mylogo"
            />
            <h2 className="text-[35px] lg:text-[45px] uppercase text-purple-600 duration-700 ml-4">
              NEWS
              <span className="text-[35px] lg:text-[45px] uppercase text-black duration-700">
                FOOTBALL
              </span>
            </h2>
          </div>
        </Link>

        {/* เมนูหลัก */}
        <div className={`flex-1 flex justify-center lg:justify-start ml-16 ${isMenuOpen ? "hidden" : "block"} lg:block`}>
          <ul className="flex flex-col lg:flex-row lg:space-x-16 space-y-4 lg:space-y-0 items-center text-black">
            <li className="text-[18px] lg:text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
              <Link href={session ? "/welcome" : "/"}>HOME</Link>
            </li>
            <li className="relative text-[18px] lg:text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
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
            <li className="text-[18px] lg:text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
              <Link href="/livescore">LIVE SCORE</Link>
            </li>
            <li className="text-[18px] lg:text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
              <Link href="#">About</Link>
            </li>
            <li className="text-[18px] lg:text-[24px] font-medium uppercase translate-all hover:text-purple-800 duration-200">
              <Link href="#">NEWS</Link>
            </li>
          </ul>
        </div>

        {/* ปุ่มสำหรับเข้าสู่ระบบและออกจากระบบ */}
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

        {/* เมนู Hamburger สำหรับมือถือ */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex flex-col space-y-2 ml-4"
        >
          <div className="w-6 h-1 bg-black"></div>
          <div className="w-6 h-1 bg-black"></div>
          <div className="w-6 h-1 bg-black"></div>
        </button>
      </div>

      {/* Sidebar สำหรับมือถือ */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-2/3 bg-white h-full z-50 transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 flex justify-between items-center">
          <Image
            src="/images/Applogo.png"
            width={70}
            height={70}
            alt="mylogo"
          />
          <button onClick={closeMenu} className="text-black text-3xl">X</button>
        </div>

        <ul className="flex flex-col p-5 space-y-4 text-black">
          <li>
            <Link href={session ? "/welcome" : "/"} className="text-xl font-medium">
              HOME
            </Link>
          </li>
          <li>
            <Link href="/livescore" className="text-xl font-medium">
              LIVE SCORE
            </Link>
          </li>
          <li>
            <Link href="#">About</Link>
          </li>
          <li>
            <Link href="#">NEWS</Link>
          </li>
          <li>
            <Link href="/login">
              <button className="btn btn-outline btn-primary text-xl">LOGIN</button>
            </Link>
          </li>
          <li>
            <Link href="/register">
              <button className="btn btn-active btn-primary text-xl">REGISTER</button>
            </Link>
          </li>
        </ul>
      </div>

      {/* พื้นหลังทึบเมื่อเปิดเมนู */}
      {isMenuOpen && (
        <div
          onClick={closeMenu}
          className="lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
        ></div>
      )}
    </nav>
  );
}

export default Navbar;
