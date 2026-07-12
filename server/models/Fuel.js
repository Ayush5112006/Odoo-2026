import mongoose from 'mongoose';

const fuelSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  date: { type: String, required: true },
  liters: { type: Number, required: true },
  cost: { type: Number, required: true }
});

export default mongoose.model('Fuel', fuelSchema);
