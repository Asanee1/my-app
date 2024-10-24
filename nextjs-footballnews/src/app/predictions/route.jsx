import { NextResponse } from 'next/server';
import brain from 'brain.js';

// สร้างโมเดล Neural Network และฝึกด้วยข้อมูลจำลอง
const net = new brain.NeuralNetwork();

function trainModel() {
  const trainingData = [
    { input: { homeWins: 10, awayWins: 5, homeDraws: 3, awayDraws: 2 }, output: { homeWin: 1 } },
    { input: { homeWins: 4, awayWins: 9, homeDraws: 2, awayDraws: 3 }, output: { awayWin: 1 } },
    // เพิ่มข้อมูลเพิ่มเติม
  ];

  net.train(trainingData);
}

trainModel();

// ฟังก์ชันทำนายผลการแข่งขัน
function predictMatchWithML(stats) {
  const output = net.run({
    homeWins: stats.homeWins,
    awayWins: stats.awayWins,
    homeDraws: stats.homeDraws,
    awayDraws: stats.awayDraws,
  });

  return output.homeWin > output.awayWin ? 'Home Win' : 'Away Win';
}

// API route handler
export async function GET(request) {
  // จำลองการรับข้อมูลจาก request
  const matchStats = {
    homeWins: parseFloat(request.headers.get('homeWins')),
    awayWins: parseFloat(request.headers.get('awayWins')),
    homeDraws: parseFloat(request.headers.get('homeDraws')),
    awayDraws: parseFloat(request.headers.get('awayDraws')),
  };

  const prediction = predictMatchWithML(matchStats);

  return NextResponse.json({ prediction });
}
