import { connectMongoDB } from '../../../../lib/mongodb';
import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: String,
  league: String,
  image: String,
  author: String,
  content: String
});

let News;

try {
  News = mongoose.model('News');
} catch {
  News = mongoose.model('News', NewsSchema);
}

export async function GET() {
  await connectMongoDB();

  try {
    const newsList = await News.find({});
    return new Response(JSON.stringify(newsList), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(JSON.stringify({ message: 'Error fetching news' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function POST(req) {
  await connectMongoDB();

  const { title, league, image, author, content } = await req.json();

  try {
    const newNews = new News({
      title,
      league,
      image,
      author,
      content
    });

    await newNews.save();

    return new Response(JSON.stringify({ message: 'ข่าวสารถูกบันทึกเรียบร้อยแล้ว' }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error saving news:', error);
    return new Response(JSON.stringify({ message: 'เกิดข้อผิดพลาดในการบันทึกข่าวสาร' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
