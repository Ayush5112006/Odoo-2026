import dotenv from 'dotenv'
import connectDB from './config/db.js'
import User from './models/User.js'

dotenv.config()

const users = [
  { name: 'Alex', email: 'alex@transitops.in', password: 'password123', role: 'Dispatcher' },
  { name: 'Priya', email: 'priya@transitops.in', password: 'password123', role: 'Fleet Manager' },
  { name: 'Sonia', email: 'sonia@transitops.in', password: 'password123', role: 'Safety Officer' },
  { name: 'Ravi', email: 'ravi@transitops.in', password: 'password123', role: 'Financial Analyst' },
]

const seed = async () => {
  console.log('Seeding DB with URI:', process.env.MONGO_URI || 'local default')
  await connectDB()
  await User.deleteMany({})
  await User.create(users)
  console.log('Seed complete')
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
