import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // For demo simplicity, stored as plain string or simple hash
  role: { type: String, required: true }
});

export default mongoose.model('User', userSchema);
