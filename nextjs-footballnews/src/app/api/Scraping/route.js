// src/app/api/Scraping/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio'; // เปลี่ยนวิธีการ import

export async function GET() {
  try {
    const url = 'https://elofootball.com/country.php?countryiso=ENG&season=2024-2025';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data); // ใช้ cheerio.load ตามปกติ

    const eloData = [];
    $('table tr').each((index, element) => {
      const columns = $(element).find('td');
      if (columns.length > 0) {
        const team = $(columns[0]).text().trim();
        const eloRating = $(columns[1]).text().trim();
        eloData.push({ team, eloRating });
      }
    });

    return NextResponse.json({ success: true, data: eloData });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}