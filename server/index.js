import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import { requireAuth, requireRole } from './middleware/auth.js'

import Vehicle from './models/Vehicle.js'
import Driver from './models/Driver.js'
import Trip from './models/Trip.js'
import Maintenance from './models/Maintenance.js'
import Fuel from './models/Fuel.js'
import Settings from './models/Settings.js'
import User from './models/User.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const ROLE_ENUM = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst']
const ROLE_ACCESS = {
  'Fleet Manager': ['Dashboard', 'Fleet', 'Maintenance', 'Analytics'],
  Dispatcher: ['Dashboard', 'Trips'],
  'Safety Officer': ['Drivers', 'Trips'],
  'Financial Analyst': ['Fuel/Exp.', 'Analytics'],
}

const isLicenseExpired = (expStr) => {
  if (!expStr || typeof expStr !== 'string') return false
  const parts = expStr.split('/')
  if (parts.length !== 2) return false

  const mm = Number(parts[0])
  const yyyy = Number(parts[1])
  if (!Number.isInteger(mm) || !Number.isInteger(yyyy) || mm < 1 || mm > 12) return false

  const expiryDate = new Date(yyyy, mm, 0, 23, 59, 59, 999)
  return expiryDate < new Date()
}

const buildEta = (distanceKm) => `${Math.round(Number(distanceKm || 0) * 1.3)} min`

const seedBaseData = async () => {
  const defaultLogin = {
    name: 'Transit Admin',
    email: 'admin@transitops.in',
    password: 'admin12345',
    role: 'Fleet Manager',
  }

  const settingsCount = await Settings.countDocuments()
  if (!settingsCount) {
    await Settings.create({
      depot: 'Gandhinagar Depot, GJ4',
      currency: 'INR (₹)',
      distanceUnit: 'Kilometers',
    })
  }

  const usersCount = await User.countDocuments()
  if (!usersCount) {
    await User.create([
      { name: 'Alex', email: 'alex@transitops.in', password: 'password123', role: 'Dispatcher' },
      { name: 'Priya', email: 'priya@transitops.in', password: 'password123', role: 'Fleet Manager' },
      { name: 'Sonia', email: 'sonia@transitops.in', password: 'password123', role: 'Safety Officer' },
      { name: 'Ravi', email: 'ravi@transitops.in', password: 'password123', role: 'Financial Analyst' },
    ])
  }

  const existingDefault = await User.findOne({ email: defaultLogin.email })
  if (!existingDefault) {
    await User.create(defaultLogin)
  }

  const vehiclesCount = await Vehicle.countDocuments()
  if (!vehiclesCount) {
    await Vehicle.insertMany([
      { reg: 'GJ01AB0452', name: 'VAN-05', type: 'Van', cap: 500, odo: 74000, cost: 620000, status: 'Available' },
      { reg: 'GJ01AB0998', name: 'TRUCK-11', type: 'Truck', cap: 5000, odo: 182000, cost: 2450000, status: 'Available' },
      { reg: 'GJ01AB1120', name: 'MINI-03', type: 'Mini Truck', cap: 750, odo: 66000, cost: 410000, status: 'In Shop' },
      { reg: 'GJ01AB0008', name: 'VAN-08', type: 'Van', cap: 750, odo: 241900, cost: 590000, status: 'Retired' },
    ])
  }

  const driversCount = await Driver.countDocuments()
  if (!driversCount) {
    await Driver.insertMany([
      { name: 'Alex', lic: 'DL-88213', cat: 'LMV', exp: '12/2028', contact: '98765xxxxx', trips: 96, safety: 96, status: 'Available' },
      { name: 'John', lic: 'DL-44120', cat: 'HMV', exp: '03/2025', contact: '98220xxxxx', trips: 81, safety: 81, status: 'Suspended' },
      { name: 'Priya', lic: 'DL-77031', cat: 'LMV', exp: '08/2027', contact: '99110xxxxx', trips: 99, safety: 99, status: 'On Trip' },
      { name: 'Suresh', lic: 'DL-90045', cat: 'HMV', exp: '01/2027', contact: '97440xxxxx', trips: 88, safety: 88, status: 'Available' },
    ])
  }
}

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

app.use((req, res, next) => {
  if (req.path.startsWith('/api') && !req.path.startsWith('/api/auth')) {
    return requireAuth(req, res, next)
  }
  next()
})

app.get('/api/settings', async (_req, res) => {
  try {
    let config = await Settings.findOne()
    if (!config) {
      config = await Settings.create({ depot: 'Gandhinagar Depot, GJ4', currency: 'INR (₹)', distanceUnit: 'Kilometers' })
    }
    res.json(config)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.put('/api/settings', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    let config = await Settings.findOne()
    if (!config) {
      config = new Settings(req.body)
    } else {
      config.depot = req.body.depot || config.depot
      config.currency = req.body.currency || config.currency
      config.distanceUnit = req.body.distanceUnit || config.distanceUnit
    }

    await config.save()
    res.json(config)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/vehicles', async (_req, res) => {
  try {
    const list = await Vehicle.find().sort({ _id: -1 })
    res.json(list)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/vehicles', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    const payload = {
      reg: String(req.body.reg || '').trim().toUpperCase(),
      name: String(req.body.name || '').trim(),
      type: req.body.type,
      cap: Number(req.body.cap || 0),
      odo: Number(req.body.odo || 0),
      cost: Number(req.body.cost || 0),
      status: req.body.status || 'Available',
    }

    const item = new Vehicle(payload)
    await item.save()
    res.status(201).json(item)
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'Registration number already exists.' })
    }
    res.status(400).json({ error: error.message })
  }
})

app.put('/api/vehicles/:id/status', async (req, res) => {
  try {
    const allowedStatuses = ['Available', 'On Trip', 'In Shop', 'Retired']
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid vehicle status.' })
    }

    const item = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )

    if (!item) return res.status(404).json({ error: 'Vehicle not found.' })
    res.json(item)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/drivers', async (_req, res) => {
  try {
    const list = await Driver.find().sort({ _id: -1 })
    res.json(list)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/drivers', requireRole(['Safety Officer', 'Fleet Manager']), async (req, res) => {
  try {
    const payload = {
      name: String(req.body.name || '').trim(),
      lic: String(req.body.lic || '').trim().toUpperCase(),
      cat: req.body.cat,
      exp: String(req.body.exp || '').trim(),
      contact: String(req.body.contact || '').trim(),
      trips: Number(req.body.trips || 0),
      safety: Number(req.body.safety || 90),
      status: req.body.status || 'Available',
    }

    const item = new Driver(payload)
    await item.save()
    res.status(201).json(item)
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'License number already exists.' })
    }
    res.status(400).json({ error: error.message })
  }
})

app.put('/api/drivers/:id/status', async (req, res) => {
  try {
    const allowedStatuses = ['Available', 'On Trip', 'Off Duty', 'Suspended']
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid driver status.' })
    }

    const drv = await Driver.findById(req.params.id)
    if (!drv) return res.status(404).json({ error: 'Driver not found.' })

    if (req.body.status === 'On Trip') {
      const activeTrip = await Trip.findOne({
        status: 'Dispatched',
        $or: [{ driver: drv._id }],
      })
      if (activeTrip) {
        return res.status(400).json({ error: 'Driver is already assigned to an active trip.' })
      }
    }

    drv.status = req.body.status
    await drv.save()

    res.json(drv)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/trips', async (_req, res) => {
  try {
    const list = await Trip.find()
      .populate('vehicle')
      .populate('driver')
      .sort({ _id: -1 })
    res.json(list)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/trips', requireRole(['Dispatcher', 'Safety Officer', 'Fleet Manager']), async (req, res) => {
  try {
    const { id, source, dest, vehicle, driver, cargo, dist, status } = req.body

    const requestedStatus = status || 'Draft'
    if (!['Draft', 'Dispatched'].includes(requestedStatus)) {
      return res.status(400).json({ error: 'Only Draft or Dispatched creation is allowed.' })
    }

    let selectedVehicle = null
    let selectedDriver = null
    const cargoWeight = Number(cargo || 0)
    const distance = Number(dist || 0)

    if (requestedStatus === 'Dispatched') {
      if (!vehicle || !driver) {
        return res.status(400).json({ error: 'Vehicle and driver are required for dispatch.' })
      }

      selectedVehicle = await Vehicle.findById(vehicle)
      if (!selectedVehicle) {
        return res.status(400).json({ error: 'Selected vehicle does not exist.' })
      }

      if (['Retired', 'In Shop'].includes(selectedVehicle.status)) {
        return res.status(400).json({ error: 'Retired or In Shop vehicles cannot be dispatched.' })
      }

      if (selectedVehicle.status === 'On Trip') {
        return res.status(400).json({ error: 'Vehicle is already on an active trip.' })
      }

      if (cargoWeight > Number(selectedVehicle.cap || 0)) {
        return res.status(400).json({
          error: `Cargo exceeds max load capacity (${selectedVehicle.cap} kg).`,
        })
      }

      selectedDriver = await Driver.findById(driver)
      if (!selectedDriver) {
        return res.status(400).json({ error: 'Selected driver does not exist.' })
      }

      if (selectedDriver.status === 'Suspended') {
        return res.status(400).json({ error: 'Suspended drivers cannot be assigned to trips.' })
      }

      if (selectedDriver.status === 'On Trip') {
        return res.status(400).json({ error: 'Driver is already on an active trip.' })
      }

      if (isLicenseExpired(selectedDriver.exp)) {
        return res.status(400).json({ error: 'Driver license is expired.' })
      }

      const activeVehicleTrip = await Trip.findOne({ vehicle: selectedVehicle._id, status: 'Dispatched' })
      if (activeVehicleTrip) {
        return res.status(400).json({ error: 'Vehicle is already assigned to a dispatched trip.' })
      }

      const activeDriverTrip = await Trip.findOne({ driver: selectedDriver._id, status: 'Dispatched' })
      if (activeDriverTrip) {
        return res.status(400).json({ error: 'Driver is already assigned to a dispatched trip.' })
      }
    }

    const item = new Trip({
      id,
      source,
      dest,
      vehicle: selectedVehicle?._id || null,
      driver: selectedDriver?._id || null,
      cargo: cargoWeight,
      dist: distance,
      status: requestedStatus,
      eta: requestedStatus === 'Dispatched' ? buildEta(distance) : 'Awaiting vehicle',
    })

    await item.save()

    if (requestedStatus === 'Dispatched') {
      await Vehicle.findByIdAndUpdate(selectedVehicle._id, { status: 'On Trip' })
      await Driver.findByIdAndUpdate(selectedDriver._id, { status: 'On Trip' })
    }

    const populated = await Trip.findById(item._id).populate('vehicle').populate('driver')
    res.status(201).json(populated)
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'Trip ID already exists.' })
    }
    res.status(400).json({ error: error.message })
  }
})

app.put('/api/trips/:id/action', requireRole(['Dispatcher', 'Safety Officer', 'Fleet Manager']), async (req, res) => {
  try {
    const { action, finalOdo, fuelConsumed } = req.body
    const trip = await Trip.findById(req.params.id)

    if (!trip) return res.status(404).json({ error: 'Trip not found.' })

    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ error: 'Only dispatched trips can be completed or cancelled.' })
    }

    if (!['Complete', 'Cancel'].includes(action)) {
      return res.status(400).json({ error: 'Invalid trip action.' })
    }

    if (action === 'Complete') {
      trip.status = 'Completed'
      trip.eta = '—'

      if (finalOdo !== undefined && finalOdo !== null && trip.vehicle) {
        const vehicle = await Vehicle.findById(trip.vehicle)
        const parsedOdo = Number(finalOdo)
        if (vehicle && Number.isFinite(parsedOdo) && parsedOdo >= vehicle.odo) {
          vehicle.odo = parsedOdo
          await vehicle.save()
        }
      }

      if (fuelConsumed !== undefined && fuelConsumed !== null && Number(fuelConsumed) > 0 && trip.vehicle) {
        await Fuel.create({
          vehicle: trip.vehicle,
          date: new Date().toISOString().slice(0, 10),
          liters: Number(fuelConsumed),
          cost: 0,
        })
      }
    }

    if (action === 'Cancel') {
      trip.status = 'Cancelled'
      trip.eta = 'Cancelled by dispatcher'
    }

    await trip.save()

    if (trip.vehicle) {
      const vehicle = await Vehicle.findById(trip.vehicle)
      if (vehicle && vehicle.status !== 'Retired') {
        vehicle.status = 'Available'
        await vehicle.save()
      }
    }

    if (trip.driver) {
      const driver = await Driver.findById(trip.driver)
      if (driver) {
        driver.status = 'Available'
        await driver.save()
      }
    }

    const populated = await Trip.findById(trip._id).populate('vehicle').populate('driver')
    res.json(populated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/maintenance', async (_req, res) => {
  try {
    const list = await Maintenance.find().populate('vehicle').sort({ _id: -1 })
    res.json(list)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/maintenance', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicle)
    if (!vehicle) {
      return res.status(400).json({ error: 'Selected vehicle does not exist.' })
    }

    if (vehicle.status === 'Retired') {
      return res.status(400).json({ error: 'Retired vehicles cannot be moved to maintenance.' })
    }

    const activeRecord = await Maintenance.findOne({ vehicle: vehicle._id, status: 'In Shop' })
    if (activeRecord) {
      return res.status(400).json({ error: 'Vehicle already has an active maintenance record.' })
    }

    const item = new Maintenance({
      vehicle: vehicle._id,
      service: req.body.service,
      cost: Number(req.body.cost || 0),
      date: req.body.date,
      status: 'In Shop',
    })

    await item.save()

    vehicle.status = 'In Shop'
    await vehicle.save()

    const populated = await Maintenance.findById(item._id).populate('vehicle')
    res.status(201).json(populated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.put('/api/maintenance/:id/close', requireRole(['Fleet Manager']), async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id)
    if (!record) {
      return res.status(404).json({ error: 'Maintenance record not found.' })
    }

    record.status = 'Completed'
    await record.save()

    const vehicle = await Vehicle.findById(record.vehicle)
    if (vehicle && vehicle.status !== 'Retired') {
      vehicle.status = 'Available'
      await vehicle.save()
    }

    const populated = await Maintenance.findById(record._id).populate('vehicle')
    res.json(populated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/fuel', async (_req, res) => {
  try {
    const list = await Fuel.find().populate('vehicle').sort({ _id: -1 })
    res.json(list)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/fuel', requireRole(['Financial Analyst', 'Fleet Manager']), async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.body.vehicle)
    if (!vehicle) {
      return res.status(400).json({ error: 'Selected vehicle does not exist.' })
    }

    const item = new Fuel({
      vehicle: vehicle._id,
      date: req.body.date,
      liters: Number(req.body.liters || 0),
      cost: Number(req.body.cost || 0),
    })

    await item.save()
    const populated = await Fuel.findById(item._id).populate('vehicle')
    res.status(201).json(populated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/meta/roles', (_req, res) => {
  res.json({ roles: ROLE_ENUM })
})

app.get('/api/meta/rbac', (_req, res) => {
  res.json({
    roles: ROLE_ENUM,
    access: ROLE_ACCESS,
  })
})

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' })
})

connectDB()
  .then(seedBaseData)
  .then(() => {
    app.listen(port, () => {
      console.log(`TransitOps API running on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Startup failed:', error)
    process.exit(1)
  })
