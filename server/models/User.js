import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'],
  },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
