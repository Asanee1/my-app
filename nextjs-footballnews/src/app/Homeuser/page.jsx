"use client";
import React, { useEffect, useState } from "react";
import { BiCalendar, BiUser } from "react-icons/bi";

import NewsList from "../news/list/page";
import FootballProgramWidget from "../components/FootballProgramWidget";
import { useSession } from "next-auth/react";
import Link from "next/link"; // Import Link

function Homeuser() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "NO NAME";
  const [currentBanner, setCurrentBanner] = useState(0);
  const [news, setNews] = useState([
    {
      title: "ใครจะคว้าแชมป์ สเปน ปะทะ อังกฤษ ปิดฉาก ยูโร 2024 ทรูวิชั่นส์ ยิงสด",
      subtitle: "FOOTBALL EURO 2024",
      date: "15 July 2024",
      author: "NO NAME",
      image: "/images/banner2.jpg",
      url: "https://www.google.com/",
    },
    {
      title:
        "คมกริบ! มาซาทาดะ อิชิอิ โค้ชใหญ่บอลไทยสาดวาทะเด็ด หลังลูกทีมเรียงหน้าถล่ม ติมอร์-เลสเต ยับเยิน",
      subtitle: "ชิงแชมป์อาเซียน 2024",
      date: "9 December 2024",
      author: "Sports football",
      image: "/images/banner3.jpg",
      url: "https://www.google.com/",
    },
    {
      title: "เชลซี ยิงแซงชนะ สเปอร์ส คาเล้า 4-3 ไล่บี้ ลิเวอร์พูล แค่ 4 แต้ม",
      subtitle: "Premier League",
      date: "9 December 2024",
      author: "siamrath",
      image: "/images/banner4.jpg",
      url: "https://www.google.com/",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevBanner) => (prevBanner + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [news.length]);

  return (
    <div>

      <div
        className="relative h-[88vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${news[currentBanner].image})`,
        }}
      >
        {/* black overlay */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.68)]"></div>
        <div className="relative z-[10] flex items-center h-[100%] text-white">
          <div className="w-[80%] mx-auto grid items-center grid-cols-1 lg:grid-cols-2 gap-[1.5rem]">
            {/* text content */}
            <div>
              <p className="sm:px-6 px-3 py-1 mb-[0.8rem] text-[22px] sm:text-[22px] bg-purple-600 text-white w-fit uppercase">
                {news[currentBanner].subtitle}
              </p>
              <h1 className="text-[24px] sm:text-[30px] md:text-[36px] lg:text-[42px] text-white leading-[2rem] md:leading-[3rem] font-medium">
                {news[currentBanner].title}
              </h1>
              <div className="flex items-center space-x-6 mt-[1rem]">
                <div className="flex items-center space-x-1">
                  <BiCalendar className="w-[1rem] h-[1rem] text-white" />
                  <p className="text-[22px] text-white uppercase">
                    {news[currentBanner].date}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <BiUser className="w-[1rem] h-[1rem] text-white" />
                  <p className="text-[22px] text-white uppercase">
                    {news[currentBanner].author}
                  </p>
                </div>
              </div>

              <div className="mt-[2rem] flex items-center space-x-4">
                <Link
                  href={news[currentBanner].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="text-[18px] sm:px-6 sm:py-2 px-3 py-2 bg-purple-600 hover:bg-purple-800 transition-all text-white rounded-lg">
                    อ่านเพิ่มเติม
                  </button>
                </Link>
                <button className="text-[18px] sm:px-6 sm:py-2 px-3 py-2 bg-white hover:bg-gray-300 transition-all text-black rounded-lg">
                  14/7/2024
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FootballProgramWidget />
      <div className="mt-6">
        <NewsList />
      </div>
    </div>
  );
}

export default Homeuser;
