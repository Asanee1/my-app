"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Function to add highlight effect
  const getLinkClass = (path) => {
    return `text-lg lg:text-xl font-medium uppercase hover:text-purple-800 duration-200 ${
      pathname === path
        ? "text-purple-800 font-bold underline decoration-2 decoration-purple-800"
        : ""
    }`;
  };

  // Animation for the logo on hover
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const logoStyles = {
    transform: isLogoHovered ? "scale(1.1)" : "scale(1)",
    transition: "transform 0.3s ease",
  };
  if (status === "loading") return <div>Loading...</div>;

  return (
    <nav className="relative flex justify-between items-center shadow-md p-4 bg-white sticky top-0 z-50">
      {/* Added sticky and z-50 */}
      <div className="container mx-auto flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          href={session ? "/welcome" : "/"}
          className="flex items-center"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <div className="flex items-center" style={logoStyles}>
            <Image
              src="/images/Applogo.png"
              width={50}
              height={50}
              alt="mylogo"
            />
            <h2 className="text-2xl lg:text-3xl uppercase text-purple-600 ml-2">
              NEWS
              <span className="text-2xl lg:text-3xl uppercase text-black">
                FOOTBALL
              </span>
            </h2>
          </div>
        </Link>

        {/* Main Menu (Desktop) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center ml-8">
          <ul className="flex space-x-8 items-center text-black">
            <li className={getLinkClass(session ? "/welcome" : "/")}>
              <Link href={session ? "/welcome" : "/"}>HOME</Link>
            </li>
            {/* League Dropdown */}
            <li className="relative text-lg lg:text-xl font-medium uppercase hover:text-purple-800 duration-200">
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
                <ul className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50 text-base animate-fade-in">
                  {/* Added animation */}
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2">
                    <Link href="/premierLeague">English Premier League </Link>
                  </li>
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2">
                    <Link href="/LaLigaLeague">Spanish La Liga</Link>
                  </li>
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2">
                    <Link href="/bundesligaLeague">German Bundesliga</Link>
                  </li>
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2">
                    <Link href="/SerieALeague">Italian Serie A</Link>
                  </li>
                  <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2">
                    <Link href="/Ligue1League">French Ligue 1</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={getLinkClass("/livescore")}>
              <Link href="/livescore">LIVE SCORE</Link>
            </li>
            <li className={getLinkClass("/about")}>
              {" "}
              {/* Added route for About */}
              <Link href="/about">About</Link>
            </li>
            <li className={getLinkClass("/news")}>
              {/* Added route for News */}
              <Link href="/news">NEWS</Link>
            </li>
          </ul>
        </div>

        {/* Auth Buttons (Desktop) */}
        <ul className="hidden lg:flex items-center space-x-4">
          {!session ? (
            <>
              <li>
                <Link href="/login">
                  <button className="btn btn-outline btn-primary text-lg animate-pulse">
                    {" "}
                    {/* Added animation */}
                    LOGIN
                  </button>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <button className="btn btn-active btn-primary text-lg animate-bounce">
                    {" "}
                    {/* Added animation */}
                    REGISTER
                  </button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/profile">
                  <button className="btn btn-success text-lg">Profile</button>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut()}
                  className="btn btn-error text-lg"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Hamburger Menu (Mobile) */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex flex-col space-y-2 ml-4"
        >
          <div className="w-6 h-1 bg-black animate-pulse"></div>{" "}
          {/* Added animation */}
          <div className="w-6 h-1 bg-black animate-pulse"></div>{" "}
          {/* Added animation */}
          <div className="w-6 h-1 bg-black animate-pulse"></div>{" "}
          {/* Added animation */}
        </button>
      </div>

      {/* Sidebar (Mobile) */}
      <div
        className={`lg:hidden fixed top-0 left-0 w-3/4 bg-white h-full z-50 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <Image
            src="/images/Applogo.png"
            width={50}
            height={50}
            alt="mylogo"
          />
          <button onClick={closeMenu} className="text-black text-3xl">
            X
          </button>
        </div>

        <ul className="flex flex-col p-4 space-y-4 text-black text-lg">
          {/* เพิ่ม text-lg */}
          <li>
            <Link
              href={session ? "/welcome" : "/"}
              className={`font-medium ${
                pathname === (session ? "/welcome" : "/")
                  ? "text-purple-800 font-bold underline decoration-2 decoration-purple-800"
                  : ""
              }`}
              onClick={() => {
                closeMenu();
                setIsDropdownOpen(false);
              }}
            >
              HOME
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                toggleDropdown();
              }}
              className="flex items-center focus:outline-none w-full justify-between"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <span className="font-medium">League</span>
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
              <ul className="ml-4 flex flex-col space-y-2 mt-2">
                <li className="text-black hover:bg-purple-800 hover:text-white px-4 py-2">
                  <Link
                    href="/premierLeague"
                    onClick={() => {
                      closeMenu();
                      setIsDropdownOpen(false);
                    }}
                  >
                    English Premier League (EPL)
                  </Link>
                </li>
                <li
                  className="text-black hover:bg-purple-800 hover:text-white px-4 py-2"
                  onClick={() => {
                    closeMenu();
                    setIsDropdownOpen(false);
                  }}
                >
                  <Link href="/LaLigaLeague">Spanish La Liga</Link>
                </li>
                <li
                  className="text-black hover:bg-purple-800 hover:text-white px-4 py-2"
                  onClick={() => {
                    closeMenu();
                    setIsDropdownOpen(false);
                  }}
                >
                  <Link href="/bundesligaLeague">German Bundesliga</Link>
                </li>
                <li
                  className="text-black hover:bg-purple-800 hover:text-white px-4 py-2"
                  onClick={() => {
                    closeMenu();
                    setIsDropdownOpen(false);
                  }}
                >
                  <Link href="/SerieALeague">Italian Serie A</Link>
                </li>
                <li
                  className="text-black hover:bg-purple-800 hover:text-white px-4 py-2"
                  onClick={() => {
                    closeMenu();
                    setIsDropdownOpen(false);
                  }}
                >
                  <Link href="/Ligue1League">French Ligue 1</Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link
              href="/livescore"
              className={`font-medium ${
                pathname === "/livescore"
                  ? "text-purple-800 font-bold underline decoration-2 decoration-purple-800"
                  : ""
              }`}
              onClick={() => {
                closeMenu();
                setIsDropdownOpen(false);
              }}
            >
              LIVE SCORE
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={`font-medium ${
                pathname === "/about"
                  ? "text-purple-800 font-bold underline decoration-2 decoration-purple-800"
                  : ""
              }`}
              onClick={() => {
                closeMenu();
                setIsDropdownOpen(false);
              }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/news"
              className={`font-medium ${
                pathname === "/news"
                  ? "text-purple-800 font-bold underline decoration-2 decoration-purple-800"
                  : ""
              }`}
              onClick={() => {
                closeMenu();
                setIsDropdownOpen(false);
              }}
            >
              NEWS
            </Link>
          </li>
          {!session ? (
            <>
              <li>
                <Link
                  href="/login"
                  onClick={() => {
                    closeMenu();
                    setIsDropdownOpen(false);
                  }}
                >
                  <button className="btn btn-outline btn-primary text-lg">
                    LOGIN
                  </button>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  onClick={() => {
                    closeMenu();
                    setIsDropdownOpen(false);
                  }}
                >
                  <button className="btn btn-active btn-primary text-lg">
                    REGISTER
                  </button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/profile"
                  onClick={() => {
                    closeMenu();
                    setIsDropdownOpen(false);
                  }}
                >
                  <button className="btn btn-success text-lg">Profile</button>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    signOut();
                    closeMenu();
                    setIsDropdownOpen(false);
                  }}
                  className="btn btn-error text-lg"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Darken Background (Mobile) */}
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
