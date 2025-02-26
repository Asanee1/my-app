import axios from "axios";

// ฟังก์ชัน GET สำหรับดึงข้อมูลการซื้อขายนักเตะทั้งหมด
export async function GET(request) {
  try {
    // เรียกข้อมูลจาก API โดยไม่ระบุ season หรือ competition
    const response = await axios.get(
      `https://api.football-data.org/v4/transfers`, // ดึงข้อมูลการซื้อขายทั้งหมด
      {
        headers: {
          'X-Auth-Token': process.env.API_KEY || '' // ใช้ API Key ที่เก็บใน environment variables
        }
      }
    );

    console.log('Transfer Data:', response.data); // Log ข้อมูลที่ได้รับจาก API

    // ส่งข้อมูลกลับในรูปแบบ JSON
    return new Response(JSON.stringify(response.data), {
      status: 200,
    });
  } catch (error) {
    // ถ้ามีข้อผิดพลาดในการดึงข้อมูล ส่ง error message กลับ
    console.error('Error fetching transfer data:', error); // Log ข้อผิดพลาด
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
