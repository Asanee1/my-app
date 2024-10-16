"use client";
import { useEffect, useState } from 'react';

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/appnews');
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        } else {
          console.error('Failed to fetch news');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">ข่าวสารกีฬา</h1>
      {news.length === 0 ? (
        <p>ไม่มีข้อมูลข่าวสาร</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => (
            <div key={item._id} className="bg-white shadow-md rounded-lg p-4">
              <img src={item.image} alt={item.title} className="w-full h-auto mb-4" />
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="text-gray-600">ลีก: {item.league}</p>
              <p className="text-gray-700 mt-2">{item.content}</p>
              <p className="mt-2 text-right">ผู้เขียน: {item.author}</p>
            </div>
          ))}
        </div>
      )}
    
    </div>
  );
}
