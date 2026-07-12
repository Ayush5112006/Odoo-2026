import express from 'express'
import jwt from 'jsonwebtoken'
import User, { MAX_ATTEMPTS, LOCK_TIME_MS } from '../models/User.js'

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

    // Check if account is locked
    if (user.isLocked) {
      const remainingMs = user.lockUntil - Date.now()
      const remainingMin = Math.ceil(remainingMs / 60000)
      return res.status(423).json({
        success: false,
        locked: true,
        message: `Account is locked due to ${MAX_ATTEMPTS} failed attempts. Try again in ${remainingMin} minute${remainingMin !== 1 ? 's' : ''}.`,
        lockUntil: user.lockUntil,
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      // Increment failed attempts
      await user.incLoginAttempts()

      const attemptsLeft = MAX_ATTEMPTS - user.failedLoginAttempts
      const nowLocked = user.failedLoginAttempts >= MAX_ATTEMPTS

      if (nowLocked) {
        const lockMin = Math.ceil(LOCK_TIME_MS / 60000)
        return res.status(423).json({
          success: false,
          locked: true,
          message: `Account locked after ${MAX_ATTEMPTS} failed attempts. Try again in ${lockMin} minutes.`,
          lockUntil: user.lockUntil,
        })
      }

      return res.status(401).json({
        success: false,
        message: `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining before account lockout.`,
        attemptsLeft,
      })
    }

    // Successful login — reset failed attempts
    await user.resetLoginAttempts()

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
