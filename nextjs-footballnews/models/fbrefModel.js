// models/fbrefModel.js
import mongoose from 'mongoose';

const fbrefSchema = new mongoose.Schema({
  league: { type: String, required: true },
  data: [
    {
      Squad: { type: String, required: true },
      xG: { type: Number, required: true },
      xGA: { type: Number, required: true },
    },
  ],
  dateFetched: { type: Date, default: Date.now, index: true }, // Add dateFetched
});

const Fbref = mongoose.models.Fbref || mongoose.model('Fbref', fbrefSchema);

export default Fbref;
