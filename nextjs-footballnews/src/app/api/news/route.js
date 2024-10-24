import { NextResponse } from 'next/server';

export async function GET(req) {
  const apiKey = 'd3fb4bea105847568e9ef073a1ddc12a';
  const url = `https://newsapi.org/v2/everything?q=ฟุตบอล OR พรีเมียร์ลีก OR ยูฟ่า OR ลาลีกา OR บุนเดสลีกา OR ลีกเอิง OR ไทยลีก&language=th&pageSize=50&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok && data.articles.length > 0) {
      // คำที่ต้องการกรองออก
      const excludedWords = [
        'วอลเลย์บอล', 'การพนัน', 'casino', 'พนัน', 'ufabet', 'เว็บตรง', 
        'ฝาก-ถอน', 'เบท', 'แทงบอลออนไลน์', 'บาสเกตบอล', 'มวย', 'เทนนิส'
      ];

      // กรองข่าวที่ไม่ต้องการ
      const filteredArticles = data.articles.filter(article => {
        const title = article.title.toLowerCase();
        const description = article.description?.toLowerCase() || '';
        return !excludedWords.some(word => title.includes(word) || description.includes(word));
      });

      // จัดเรียงข่าวตามวันที่
      const sortedArticles = filteredArticles.sort((a, b) => {
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      });

      return NextResponse.json(sortedArticles);
    } else {
      return NextResponse.json({ error: 'No news articles found.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch news.', details: error }, { status: 500 });
  }
}
