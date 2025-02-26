"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await axios.get("/api/transfers"); // ดึงข้อมูลทั้งหมด
        setTransfers(response.data.response || []); // แสดงข้อมูลจาก API
      } catch (error) {
        console.error("Error fetching transfers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Transfers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transfers.length > 0 ? (
          transfers.map((transfer, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-lg bg-white">
              <h2 className="font-semibold">{transfer.player.name}</h2>
              <p>From: {transfer.team_from.name}</p>
              <p>To: {transfer.team_to.name}</p>
              <p>Fee: {transfer.transfer_fee || "Undisclosed"}</p>
              <p>Date: {transfer.transfer_date}</p>
            </div>
          ))
        ) : (
          <p>No transfer data available.</p>
        )}
      </div>
    </div>
  );
}
