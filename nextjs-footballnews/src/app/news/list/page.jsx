"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: false });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (response.ok) {
          const data = await response.json();
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

  if (loading) return <p className="text-center text-lg py-10">กำลังโหลด...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  const featuredNews = news[0];
  const otherNews = news.slice(1);

  return (
    <div
      ref={ref}
      className={`px-6 pt-6 md:px-10 md:pt-8 transition-all duration-1000 ${
        inView ? "animate-fade-in-up" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="bg-white shadow-xl rounded-lg p-8">
      <h1 className="text-4xl font-semibold mb-8 text-left text-black">ข่าวล่าสุด</h1>
        {news.length === 0 ? (
          <p className="text-center text-lg">ไม่มีข้อมูลข่าวสาร</p>
        ) : (
          <div>
            {/* Featured News */}
            {featuredNews && (
              <Link
                href={`/news?newsId=${encodeURIComponent(
                  featuredNews.title.replace(/\s/g, "")
                )}`}
                passHref
                legacyBehavior
              >
                <a className="flex flex-col md:flex-row gap-6 mb-10 p-5 border-b border-gray-200 hover:bg-gray-50 transition duration-300 rounded-lg">
                  <img
                    src={featuredNews.urlToImage || "/placeholder.jpg"}
                    alt={featuredNews.title}
                    className="w-full md:w-1/2 h-80 object-cover rounded-lg shadow-md"
                  />
                  <div className="md:w-1/2 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-3 hover:text-purple-600 transition-colors line-clamp-3">
                      {featuredNews.title}
                    </h2>
                    <p className="text-gray-600 text-lg mb-3 line-clamp-3">
                      {featuredNews.description}
                    </p>
                    <p className="text-gray-500 text-base">
                      📅 {featuredNews.source.name || "ไม่ระบุ"} • {featuredNews.author || "ไม่ระบุ"}
                    </p>
                  </div>
                </a>
              </Link>
            )}

            {/* Other News */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
              {otherNews.map((item, index) => (
                <Link
                  href={`/news?newsId=${encodeURIComponent(
                    item.title.replace(/\s/g, "")
                  )}`}
                  key={index}
                  passHref
                  legacyBehavior
                >
                  <a className="bg-gray-100 rounded-lg p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-transform duration-300">
                    <img
                      src={item.urlToImage || "/placeholder.jpg"}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-md mb-3 shadow"
                    />
                    <h3 className="text-lg font-bold line-clamp-2 hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.source.name || "ไม่ระบุ"} • {item.author || "ไม่ระบุ"}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
