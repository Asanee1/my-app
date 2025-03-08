"use client"; // This MUST be at the top!
import { useEffect, useState } from "react";
import Link from "next/link"; // Ensure Link is imported

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news"); // Fetch data from your API
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Add here
          setNews(data);
        } else {
          setError("Failed to fetch news");
        }
      } catch (error) {
        setError("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-8 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">ข่าวสารกีฬา</h1>
      {news.length === 0 ? (
        <p>ไม่มีข้อมูลข่าวสาร</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <Link
              href={`/news?newsId=${encodeURIComponent(
                item.title.replace(/\s/g, "")
              )}`} // Change here
              key={index}
              legacyBehavior
              passHref
            >
              <a className="bg-white shadow-md rounded-lg p-4 group transition-transform duration-300 ease-in-out hover:scale-105 block">
                <div className="overflow-hidden mb-4">
                  <img
                    src={item.urlToImage || "/path/to/placeholder.jpg"}
                    alt={item.title || "ข่าวกีฬา"}
                    className="w-full h-70 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                  {item.title || "ไม่มีหัวข้อข่าว"}
                </h2>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.description || "ไม่มีรายละเอียดเพิ่มเติม"}
                </p>
                <p className="text-gray-700 text-sm">
                  ผู้เขียน: {item.author || "ไม่ระบุ"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  แหล่งที่มา: {item.source.name || "ไม่ระบุ"}
                </p>
              </a>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
