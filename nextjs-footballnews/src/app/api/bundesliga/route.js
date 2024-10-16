import axios from "axios";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season') || '2023';

    const response = await axios.get(
      `https://api.football-data.org/v4/competitions/BL1/matches?season=${season}`,
      {
        headers: {
          'X-Auth-Token': process.env.API_KEY || ''
        }
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
