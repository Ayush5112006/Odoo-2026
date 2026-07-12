import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  dest: { type: String, required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
  cargo: { type: Number, default: 0 },
  dist: { type: Number, default: 0 },
  status: { type: String, default: 'Draft' },
  eta: { type: String, default: '—' }
});

export default mongoose.model('Trip', tripSchema);
