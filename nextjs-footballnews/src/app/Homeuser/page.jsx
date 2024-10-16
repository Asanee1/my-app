import React from 'react'
import { BiCalendar, BiUser } from "react-icons/bi";
import Navbar from "../components/Navbar";

function Homeuser() {
  return (
    <div>
    <div className="relative h-[88vh] bg-[url('/images/banner2.jpg')] bg-cover bg-center">
      {/* black overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.68)]"></div>
      <div className="relative z-[10] flex items-center h-[100%] text-white">
        <div className="w-[80%] mx-auto grid items-center grid-cols-1 lg:grid-cols-2 gap-[2rem]">
          {/* text content */}
          <div>
            <p className="sm:px-8 px-4 py-1 mb-[1rem] text-[24px] sm:text-[24px] bg-purple-600 text-white w-fit uppercase">
              FOOTBALL EURO 2024
            </p>
            <h1 className="text-[25px] sm:text-[32px] md:text-[38px] lg:text-[45px] text-white leading-[2rem] md:leading-[3.5rem] font-medium">
              ใครจะคว้าแชมป์ สเปน ปะทะ อังกฤษ ปิดฉาก ยูโร 2024 ทรูวิชั่นส์ ยิงสด
            </h1>
            <div className="flex items-center space-x-14">
              <div className="flex items-center space-x-2 mt-[1rem] sm:mt-[2rem]">
                <BiCalendar className="w-[1rem] h-[1rem] text-white uppercase" />
                <p className="text-[24px] sm:text-[24px] text-white uppercase">
                  15 July 2024
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-[1rem] sm:mt-[2rem]">
                <BiUser className="w-[1rem] h-[1rem] text-white uppercase" />
                <p className="text-[24px] sm:text-[24px] text-white uppercase">
                  NO NAME
                </p>
              </div>
            </div>
            <div className="mt-[2.4rem] flex items-center space-x-6">
              <button className="text-[20px] sm:px-8 sm:py-2.5 px-4 py-2 bg-purple-600 hover:bg-purple-800 transition-all text-white">
                อ่านเพิ่มเติม
              </button>
              <button className="text-[20px] sm:px-8 sm:py-2.5 px-4 py-2 bg-white hover:bg-gray-300 transition-all text-black">
                14/7/2024
              </button>
              
            </div>
            <div>
              
            </div>
          </div>
        </div>
      </div>
      HomeUser
    </div>
    </div>
    
  )
}

export default Homeuser