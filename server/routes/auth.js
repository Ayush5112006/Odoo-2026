import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'transitops-secret'
const ROLE_ENUM = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst']

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    {
      expiresIn: '2h',
    }
  )
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    // Check if account is currently locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMs = user.lockUntil - Date.now()
      const minutes = Math.floor(remainingMs / 60000)
      const seconds = Math.ceil((remainingMs % 60000) / 1000)
      let timeStr = `${minutes} minute(s) and ${seconds} second(s)`
      if (minutes === 0) {
        timeStr = `${seconds} second(s)`
      }
      return res.status(403).json({
        success: false,
        message: `Account is temporarily locked. Try again in ${timeStr}.`,
        lockUntil: user.lockUntil,
        remainingAttempts: 0
      })
    } else if (user.lockUntil && user.lockUntil <= Date.now()) {
      // Lock has expired, reset attempts
      user.lockUntil = undefined
      user.loginAttempts = 0
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1

      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 mins
        user.loginAttempts = 0 // Reset attempt counter
        await user.save()
        return res.status(403).json({
          success: false,
          message: 'Account locked for 15 minutes due to 5 consecutive failed attempts.',
          lockUntil: user.lockUntil,
          remainingAttempts: 0
        })
      } else {
        const remaining = 5 - user.loginAttempts
        await user.save()
        return res.status(401).json({
          success: false,
          message: `Invalid credentials. ${remaining} attempt(s) remaining before lock.`,
          remainingAttempts: remaining
        })
      }
    }

    // Success - reset attempts
    user.loginAttempts = 0
    user.lockUntil = undefined
    await user.save()

    const token = createToken(user)

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ success: false, message: 'Server error during login.' })
  }
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' })
  }

  return res.json({
    success: true,
    message: 'If that email exists in our system, password reset instructions have been sent.',
  })
})

router.get('/roles', (_req, res) => {
  return res.json({ roles: ROLE_ENUM })
})

export default router
