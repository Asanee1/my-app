"use client";
import React, { useEffect, useState } from "react";
import { BiCalendar, BiUser } from "react-icons/bi";
import Navbar from "../components/Navbar";
import NewsList from "../news/list/page"; 
import FootballProgramWidget from "../components/FootballProgramWidget";
import Link from "next/link"; // Import Link

function Homenews() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [news, setNews] = useState([
    {
      title:
        "ใครจะคว้าแชมป์ สเปน ปะทะ อังกฤษ ปิดฉาก ยูโร 2024 ทรูวิชั่นส์ ยิงสด",
      subtitle: "FOOTBALL EURO 2024", // ข้อความที่ต้องการเปลี่ยน
      date: "15 July 2024",
      author: "NO NAME",
      image: "/images/banner2.jpg",
      url: "https://www.google.com/",
    },
    {
      title:
        "คมกริบ! มาซาทาดะ อิชิอิ โค้ชใหญ่บอลไทยสาดวาทะเด็ด หลังลูกทีมเรียงหน้าถล่ม ติมอร์-เลสเต ยับเยิน",
      subtitle: "ชิงแชมป์อาเซียน 2024  ", // ข้อความที่ต้องการเปลี่ยน
      date: "9 December 2024",
      author: "Sports football",
      image: "/images/banner3.jpg",
      url: "https://www.google.com/",
    },
    {
      title:
        "เชลซี ยิงแซงชนะ สเปอร์ส คาเล้า 4-3 ไล่บี้ ลิเวอร์พูล แค่ 4 แต้ม",
      subtitle: "Premier League", // ข้อความที่ต้องการเปลี่ยน
      date: "9 December 2024",
      author: "siamrath",
      image: "/images/banner4.jpg",
      url: "https://www.google.com/",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevBanner) => (prevBanner + 1) % news.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [news.length]);

  return (
    <div>
      <Navbar />
      <div
        className="relative h-[88vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${news[currentBanner].image})`,
        }}
      >
        {/* black overlay */}
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.68)]"></div>
        <div className="relative z-[10] flex items-center h-[100%] text-white">
          <div className="w-[80%] mx-auto grid items-center grid-cols-1 lg:grid-cols-2 gap-[2rem]">
            {/* text content */}
            <div>
              <p className="sm:px-8 px-4 py-1 mb-[1rem] text-[24px] sm:text-[24px] bg-purple-600 text-white w-fit uppercase">
                {news[currentBanner].subtitle}
                {/* ใช้ค่า subtitle ที่เปลี่ยนแปลง */}
              </p>
              <h1 className="text-[25px] sm:text-[32px] md:text-[38px] lg:text-[45px] text-white leading-[2rem] md:leading-[3.5rem] font-medium">
                {news[currentBanner].title}
              </h1>
              <div className="flex items-center space-x-14">
                <div className="flex items-center space-x-2 mt-[1rem] sm:mt-[2rem]">
                  <BiCalendar className="w-[1rem] h-[1rem] text-white uppercase" />
                  <p className="text-[24px] sm:text-[24px] text-white uppercase">
                    {news[currentBanner].date}
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-[1rem] sm:mt-[2rem]">
                  <BiUser className="w-[1rem] h-[1rem] text-white uppercase" />
                  <p className="text-[24px] sm:text-[24px] text-white uppercase">
                    {news[currentBanner].author}
                  </p>
                </div>
              </div>

              <div className="mt-[2.4rem] flex items-center space-x-6">
                <Link
                  href={news[currentBanner].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="text-[20px] sm:px-8 sm:py-2.5 px-4 py-2 bg-purple-600 hover:bg-purple-800 transition-all text-white rounded-lg">
                    อ่านเพิ่มเติม
                  </button>
                </Link>
                <button className="text-[20px] sm:px-8 sm:py-2.5 px-4 py-2 bg-white hover:bg-gray-300 transition-all text-black rounded-lg">
                  14/7/2024
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FootballProgramWidget />
      {/* เพิ่ม NewsList */}
      <div className="mt-8">
        <NewsList />
      </div>
    </div>
  );
}

export default Homenews;
