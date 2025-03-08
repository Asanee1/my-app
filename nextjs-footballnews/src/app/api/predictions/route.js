// src/app/api/predictions/route.js
import { NextResponse } from "next/server";
import { calculateMatchProbability } from "../../../utils/matchProbability";
import connectMongoDB from "../../../../lib/mongodb";

export async function GET() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await connectMongoDB();
    console.log("Successfully connected to MongoDB.");

    const matches = [
      { id: 1, homeTeam: "Man City", awayTeam: "Liverpool", date: "2025-03-01" },
      { id: 2, homeTeam: "Arsenal", awayTeam: "Tottenham", date: "2025-03-02" },
    ];
    console.log("Matches :", matches)

    console.log("Attempting to calculate match probabilities...");
    const matchesWithProbabilities = await Promise.all(matches.map(async (match) => {
        console.log("Processing match:", match);
      const probabilities = await calculateMatchProbability(match.homeTeam, match.awayTeam);
        console.log("Probabilities for match:", probabilities)
      return {
        ...match,
        probabilities,
      };
    }));

    console.log("Successfully calculated all match probabilities.");

    return NextResponse.json({ matches: matchesWithProbabilities });
  } catch (error) {
    console.error("Error in /api/predictions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
