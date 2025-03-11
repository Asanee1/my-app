import { NextResponse } from "next/server";

// Simple in-memory cache for NewsAPI results (replace with Redis in production)
const newsCache = {};
const NEWS_CACHE_EXPIRATION = 15 * 60; // 15 minutes in seconds

export async function GET(req) {
  const urlObj = new URL(req.url);
  const source = urlObj.searchParams.get('source');
  const apiKey = "d3fb4bea105847568e9ef073a1ddc12a"; // Replace with your actual API key
  const pageSize = 30; // Reduced page size to 20
  let url = `https://newsapi.org/v2/everything?q=ฟุตบอล OR พรีเมียร์ลีก OR ยูฟ่า OR ลาลีกา OR บุนเดสลีกา OR ลีกเอิง OR ไทยลีก&language=th&pageSize=${pageSize}&apiKey=${apiKey}`;

  if (source) {
    url = `https://newsapi.org/v2/top-headlines?country=th&category=${source}&pageSize=${pageSize}&apiKey=${apiKey}`;
  }
  // Check the cache
  if (newsCache[url] && newsCache[url].expires > Date.now()) {
    console.log("News API Cache hit!");
    return NextResponse.json(newsCache[url].data);
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`News API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return NextResponse.json({ error: "No news articles found." }, { status: 404 });
    }

    const sortedArticles = data.articles.sort((a, b) => {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    });

    // Remove content and scraping here
    const articlesWithoutContent = sortedArticles.map((article) => ({
      ...article,
      content: "", // Remove content and scraping here
    }));

    // Cache the result
    newsCache[url] = {
      data: articlesWithoutContent,
      expires: Date.now() + NEWS_CACHE_EXPIRATION * 1000,
    };

    return NextResponse.json(articlesWithoutContent);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch news.", details: error.message },
      { status: 500 }
    );
  }
}
