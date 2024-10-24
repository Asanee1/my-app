import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  matchId: { type: String, required: true, unique: true },
  homeTeam: {
    name: { type: String, required: true },
    crestUrl: { type: String } // เพิ่มโลโก้
  },
  awayTeam: {
    name: { type: String, required: true },
    crestUrl: { type: String } // เพิ่มโลโก้
  },
  score: {
    fullTime: {
      home: Number,
      away: Number
    }
  },
  date: { type: Date, required: true }
});

const Match = mongoose.models.Match || mongoose.model('Match', matchSchema);

export default Match;
