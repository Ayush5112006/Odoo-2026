import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lic: { type: String, required: true, unique: true },
  cat: { type: String, required: true },
  exp: { type: String, required: true },
  contact: { type: String, default: '' },
  trips: { type: Number, default: 0 },
  safety: { type: Number, default: 90 },
  status: { type: String, default: 'Available' }
});

export default mongoose.model('Driver', driverSchema);
