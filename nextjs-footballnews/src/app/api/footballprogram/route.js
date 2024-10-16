import axios from 'axios';

export async function GET(req) {
  const url = new URL(req.url);
  const date = url.searchParams.get('date');
  
  try {
    const response = await axios.get('https://api.football-data.org/v4/matches', {
      headers: {
        'X-Auth-Token': process.env.API_KEY || '', // Replace with your API key
      },
      params: {
        date // เพิ่มพารามิเตอร์วันที่
      }
    });

    const matches = response.data.matches;

    return new Response(JSON.stringify({ matches }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ message: 'Error fetching data', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
