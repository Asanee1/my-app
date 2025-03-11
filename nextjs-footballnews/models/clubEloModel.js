// models/clubEloModel.js
import mongoose from 'mongoose';

const clubEloSchema = new mongoose.Schema({
  Rank: { type: String, required: true },
  Club: { type: String, required: true },
  Country: { type: String, required: true },
  Level: { type: String, required: true },
  Elo: { type: String, required: true },
  From: { type: String, required: true },
  To: { type: String, required: true },
  dateFetched: { type: Date, default: Date.now, index: true }, // Add dateFetched
});

const ClubElo = mongoose.models.ClubElo || mongoose.model('ClubElo', clubEloSchema);

export default ClubElo;
