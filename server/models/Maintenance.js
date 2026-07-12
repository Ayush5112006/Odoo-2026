import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  service: { type: String, required: true },
  cost: { type: Number, default: 0 },
  date: { type: String, required: true },
  status: { type: String, default: 'In Shop' }
});

export default mongoose.model('Maintenance', maintenanceSchema);
