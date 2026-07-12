import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  reg: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  cap: { type: Number, required: true },
  odo: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  status: { type: String, default: 'Available' }
});

export default mongoose.model('Vehicle', vehicleSchema);
