import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const LOCK_TIME_MS = 15 * 60 * 1000 // 15-minute lockout
const MAX_ATTEMPTS = 5

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'],
  },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
})

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > new Date())
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

userSchema.methods.incLoginAttempts = async function () {
  // If previous lock has expired, reset counter
  if (this.lockUntil && this.lockUntil <= new Date()) {
    this.failedLoginAttempts = 1
    this.lockUntil = null
    return this.save()
  }

  this.failedLoginAttempts += 1

  // Lock the account if max attempts reached
  if (this.failedLoginAttempts >= MAX_ATTEMPTS) {
    this.lockUntil = new Date(Date.now() + LOCK_TIME_MS)
  }

  return this.save()
}

userSchema.methods.resetLoginAttempts = async function () {
  if (this.failedLoginAttempts === 0 && !this.lockUntil) return this
  this.failedLoginAttempts = 0
  this.lockUntil = null
  return this.save()
}

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
export { MAX_ATTEMPTS, LOCK_TIME_MS }

