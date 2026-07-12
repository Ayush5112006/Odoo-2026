import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  depot: { type: String, default: 'Gandhinagar Depot, GJ4' },
  currency: { type: String, default: 'INR (₹)' },
  distanceUnit: { type: String, default: 'Kilometers' },
  rbacAccess: { type: mongoose.Schema.Types.Mixed }
});

export default mongoose.model('Settings', settingsSchema);
