"use client";
import { useEffect, useState } from 'react';

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news'); // ดึงข้อมูลจาก API ของตัวเอง
        if (response.ok) {
          const data = await response.json();
          setNews(data);
        } else {
          setError('Failed to fetch news');
        }
      } catch (error) {
        setError('Error: ' + error.message);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item, index) => (
            <div 
              key={index} 
              className="bg-white shadow-md rounded-lg p-4 group transform transition-transform duration-300 ease-in-out hover:scale-105"
            >
              <div className="overflow-hidden">
                <img 
                  src={item.urlToImage || '/path/to/placeholder.jpg'} 
                  alt={item.title || 'ข่าวกีฬา'} 
                  className="w-full h-auto mb-4"
                />
              </div>
              <h2 className="text-xl font-bold">
                {item.title ? item.title : 'ไม่มีหัวข้อข่าว'}
              </h2>
              <p className="text-gray-600">
                ลีก: {item.source.name ? item.source.name : 'ไม่ระบุ'}
              </p>
              <p className="text-gray-700 mt-2">
                {item.description ? item.description : 'ไม่มีรายละเอียดเพิ่มเติม'}
              </p>
              <p className="mt-2 text-right">
                ผู้เขียน: {item.author ? item.author : 'ไม่ระบุ'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  
}
