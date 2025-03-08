"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link"; 
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Container from "../components/Container";
import Footer from "../components/Footer";

export default function NewsDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newsId = searchParams.get("newsId");

  const [newsDetail, setNewsDetail] = useState(null);
  const [newsList, setNewsList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articleContent, setArticleContent] = useState(null); 

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("Failed to fetch news.");
        const data = await response.json();

        setNewsList(data); 

        const selectedNews = data.find((item) => item.title.replace(/\s/g, "") === newsId);
        if (selectedNews) {
          setNewsDetail(selectedNews);
        } else {
          setError("News not found.");
        }
      } catch (err) {
        setError(err.message || "Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    if (newsId) fetchNews();
  }, [newsId]);

  useEffect(() => {
    const fetchArticleContent = async (articleUrl) => {
      try {
        const response = await fetch(`/api/get-article-content?url=${encodeURIComponent(articleUrl)}`);
        if (!response.ok) throw new Error("Failed to fetch article content.");
        const data = await response.json();
        if (data.content) {
          setArticleContent(data.content);
        } else {
          setError("Failed to load article content.");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch article content.");
      }
    };

    if (newsDetail?.url) {
      fetchArticleContent(newsDetail.url);
    }
  }, [newsDetail]);

  if (loading) {
    return (
      <Container>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-700">
          กำลังโหลด...
        </div>
        <Footer />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-lg font-medium text-red-600">
          ข้อผิดพลาด: {error}
        </div>
        <Footer />
      </Container>
    );
  }

  if (!newsDetail) {
    return (
      <Container>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-lg font-medium text-gray-600">
          ไม่พบบทความข่าว
        </div>
        <Footer />
      </Container>
    );
  }

  return (
    <Container>
      <Navbar />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📌 ข่าวหลัก */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline text-lg font-semibold mb-4 flex items-center"
          >
            ← กลับ
          </button>
          <h1 className="text-4xl font-extrabold mb-6 text-gray-900 leading-tight">
            {newsDetail.title}
          </h1>
          {newsDetail.urlToImage && (
            <img
              src={newsDetail.urlToImage}
              alt={newsDetail.title}
              className="w-full max-h-[500px] object-cover rounded-lg shadow-md"
            />
          )}
          <p className="text-gray-600 mt-6 text-lg leading-relaxed">{newsDetail.description}</p>
          {/* เพิ่มการเว้นระยะระหว่างรายละเอียดของข่าว */}
          <div className="mt-4 text-gray-500 text-lg">
            <p>Source: <span className="font-semibold">{newsDetail.source.name}</span></p>
            <p>Author: <span className="font-semibold">{newsDetail.author ? newsDetail.author : "Unknown"}</span></p>
          </div>

          {/* ✅ แสดงเนื้อหาข่าว */}
          {articleContent ? (
            <div className="text-gray-800 mt-8 text-lg leading-relaxed tracking-wide">
              {articleContent}
            </div>
          ) : (
            <p className="text-gray-500 mt-4 text-lg">กำลังโหลดเนื้อหาข่าว...</p>
          )}
        </div>

        {/* 📌 ข่าวอื่นๆ (Widget) */}
        <div className="lg:col-span-1 bg-gray-100 p-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-purple-700">ข่าวอื่นๆ</h2>
          <div className="space-y-6">
            {newsList.length > 1 ? (
              newsList
                .filter((item) => item.title !== newsDetail.title) // ✅ ไม่แสดงข่าวที่กำลังอ่าน
                .slice(0, 5)
                .map((item, index) => (
                  <Link key={index} href={`/news?newsId=${encodeURIComponent(item.title.replace(/\s/g, ""))}`}>
                    <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-300 p-4 rounded-lg transition-all">
                      <img
                        src={item.urlToImage || "/path/to/placeholder.jpg"}
                        alt={item.title}
                        className="w-28 h-28 object-cover rounded-md shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold line-clamp-2 text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.source.name}</p>
                      </div>
                    </div>
                  </Link>
                ))
            ) : (
              <p className="text-gray-500 text-lg">ไม่มีข่าวเพิ่มเติม</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}
