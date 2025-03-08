import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  matchId: { type: String, required: true, unique: true, index: true }, // เพิ่ม index
  homeTeam: {
    name: { type: String, required: true },
    crestUrl: { type: String }
  },
  awayTeam: {
    name: { type: String, required: true },
    crestUrl: { type: String }
  },
  score: {
    fullTime: {
      home: Number,
      away: Number
    }
  },
  date: { type: Date, required: true, index: true } // เพิ่ม index
});

const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);

export default Match;
