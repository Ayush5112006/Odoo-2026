import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import { requireAuth } from './middleware/auth.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/api/profile', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' })
})

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`TransitOps API running on http://localhost:${port}`)
  })
})
