import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

// Import Models
import Vehicle from './models/Vehicle.js';
import Driver from './models/Driver.js';
import Trip from './models/Trip.js';
import Maintenance from './models/Maintenance.js';
import Fuel from './models/Fuel.js';
import User from './models/User.js';
import Settings from './models/Settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully.');
    await seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Seed Initial Mock Data with ObjectId relationships
async function seedDatabase() {
  try {
    // Clear old data to force fresh seed of normalized schemas
    await User.deleteMany({});
    await Settings.deleteMany({});
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Trip.deleteMany({});
    await Maintenance.deleteMany({});
    await Fuel.deleteMany({});

    // 1. Seed Users
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany([
        { email: 'raven.k@transitops.in', password: 'password', role: 'Dispatcher' },
        { email: 'manager@transitops.in', password: 'password', role: 'Fleet Manager' },
        { email: 'safety@transitops.in', password: 'password', role: 'Safety Officer' },
        { email: 'finance@transitops.in', password: 'password', role: 'Financial Analyst' }
      ]);
      console.log('Users seeded.');
    }

    // 2. Seed Settings
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({
        depot: 'Gandhinagar Depot, GJ4',
        currency: 'INR (₹)',
        distanceUnit: 'Kilometers'
      });
      console.log('Default Settings seeded.');
    }

    // 3. Seed Vehicles
    let vehMap = {};
    const vehCount = await Vehicle.countDocuments();
    if (vehCount === 0) {
      const docs = await Vehicle.insertMany([
        { reg: 'GJ01AB0452', name: 'VAN-05', type: 'Van', cap: 500, odo: 74000, cost: 620000, status: 'Available' },
        { reg: 'GJ01AB0998', name: 'TRUCK-11', type: 'Truck', cap: 5000, odo: 182000, cost: 2450000, status: 'On Trip' },
        { reg: 'GJ01AB1120', name: 'MINI-03', type: 'Mini Truck', cap: 750, odo: 66000, cost: 410000, status: 'In Shop' },
        { reg: 'GJ01AB0008', name: 'VAN-08', type: 'Van', cap: 750, odo: 241900, cost: 590000, status: 'Retired' }
      ]);
      docs.forEach(v => { vehMap[v.name] = v._id; });
      console.log('Vehicles seeded.');
    } else {
      const docs = await Vehicle.find();
      docs.forEach(v => { vehMap[v.name] = v._id; });
    }

    // 4. Seed Drivers
    let drvMap = {};
    const drvCount = await Driver.countDocuments();
    if (drvCount === 0) {
      const docs = await Driver.insertMany([
        { name: 'Alex', lic: 'DL-88213', cat: 'LMV', exp: '12/2028', contact: '98765xxxxx', trips: 96, safety: 96, status: 'Available' },
        { name: 'John', lic: 'DL-44120', cat: 'HMV', exp: '03/2025', contact: '98220xxxxx', trips: 81, safety: 81, status: 'Suspended' },
        { name: 'Priya', lic: 'DL-77031', cat: 'LMV', exp: '08/2027', contact: '99110xxxxx', trips: 99, safety: 99, status: 'On Trip' },
        { name: 'Suresh', lic: 'DL-90045', cat: 'HMV', exp: '01/2027', contact: '97440xxxxx', trips: 88, safety: 88, status: 'Available' }
      ]);
      docs.forEach(d => { drvMap[d.name] = d._id; });
      console.log('Drivers seeded.');
    } else {
      const docs = await Driver.find();
      docs.forEach(d => { drvMap[d.name] = d._id; });
    }

    // 5. Seed Trips
    const tripCount = await Trip.countDocuments();
    if (tripCount === 0) {
      await Trip.insertMany([
        { id: 'TR001', source: 'Gandhinagar Depot', dest: 'Ahmedabad Hub', vehicle: vehMap['VAN-05'] || null, driver: drvMap['Alex'] || null, cargo: 450, dist: 38, status: 'Dispatched', eta: '45 min' },
        { id: 'TR002', source: 'Vatva Industrial Area', dest: 'Ahmedabad Hub', vehicle: vehMap['TRUCK-11'] || null, driver: drvMap['John'] || null, cargo: 3800, dist: 60, status: 'Completed', eta: '—' },
        { id: 'TR003', source: 'Ahmedabad Hub', dest: 'Kalol Depot', vehicle: vehMap['MINI-03'] || null, driver: drvMap['Priya'] || null, cargo: 600, dist: 26, status: 'Dispatched', eta: '1h 10m' },
        { id: 'TR004', source: 'Mansa', dest: 'Kalol Depot', vehicle: null, driver: null, cargo: 0, dist: 0, status: 'Cancelled', eta: 'Vehicle went to shop' }
      ]);
      console.log('Trips seeded.');
    }

    // 6. Seed Maintenance
    const maintCount = await Maintenance.countDocuments();
    if (maintCount === 0) {
      await Maintenance.insertMany([
        { vehicle: vehMap['VAN-05'], service: 'Oil Change', cost: 2500, date: '2026-07-07', status: 'In Shop' },
        { vehicle: vehMap['TRUCK-11'], service: 'Engine Repair', cost: 18000, date: '2026-07-01', status: 'Completed' },
        { vehicle: vehMap['MINI-03'], service: 'Tyre Replace', cost: 6200, date: '2026-07-06', status: 'In Shop' }
      ]);
      console.log('Maintenance seeded.');
    }

    // 7. Seed Fuel
    const fuelCount = await Fuel.countDocuments();
    if (fuelCount === 0) {
      await Fuel.insertMany([
        { vehicle: vehMap['VAN-05'], date: '2026-07-05', liters: 42, cost: 3150 },
        { vehicle: vehMap['TRUCK-11'], date: '2026-07-06', liters: 110, cost: 8400 },
        { vehicle: vehMap['MINI-03'], date: '2026-07-06', liters: 28, cost: 2050 }
      ]);
      console.log('Fuel seeded.');
    }
  } catch (error) {
    console.error('Seeding database failed:', error);
  }
}

// --- AUTH API ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: '✕ Invalid credentials. Check email and password.' });
    }
    res.json({ email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SETTINGS API ---
app.get('/api/settings', async (req, res) => {
  try {
    let config = await Settings.findOne();
    if (!config) {
      config = await Settings.create({ depot: 'Gandhinagar Depot, GJ4', currency: 'INR (₹)', distanceUnit: 'Kilometers' });
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    let config = await Settings.findOne();
    if (!config) {
      config = new Settings(req.body);
    } else {
      config.depot = req.body.depot;
      config.currency = req.body.currency;
      config.distanceUnit = req.body.distanceUnit;
    }
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- VEHICLES API ---
app.get('/api/vehicles', async (req, res) => {
  try {
    const list = await Vehicle.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vehicles', async (req, res) => {
  try {
    const item = new Vehicle(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/vehicles/:id/status', async (req, res) => {
  try {
    const item = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- DRIVERS API ---
app.get('/api/drivers', async (req, res) => {
  try {
    const list = await Driver.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drivers', async (req, res) => {
  try {
    const item = new Driver(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/drivers/:index/status', async (req, res) => {
  try {
    const list = await Driver.find();
    const targetIdx = Number(req.params.index);
    if (targetIdx < 0 || targetIdx >= list.length) {
      return res.status(404).json({ error: 'Driver index out of range' });
    }
    const drv = list[targetIdx];
    drv.status = req.body.status;
    await drv.save();
    res.json(drv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- TRIPS API ---
app.get('/api/trips', async (req, res) => {
  try {
    const list = await Trip.find()
      .populate('vehicle')
      .populate('driver')
      .sort({ _id: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips', async (req, res) => {
  try {
    const { id, source, dest, vehicle, driver, cargo, dist, status, eta } = req.body;
    const item = new Trip({ id, source, dest, vehicle, driver, cargo, dist, status, eta });
    await item.save();

    // If dispatched, update vehicle & driver status
    if (status === 'Dispatched') {
      if (vehicle) await Vehicle.findByIdAndUpdate(vehicle, { status: 'On Trip' });
      if (driver) await Driver.findByIdAndUpdate(driver, { status: 'On Trip' });
    }

    const populated = await Trip.findById(item._id).populate('vehicle').populate('driver');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/trips/:index/action', async (req, res) => {
  try {
    const list = await Trip.find().sort({ _id: -1 });
    const targetIdx = Number(req.params.index);
    if (targetIdx < 0 || targetIdx >= list.length) {
      return res.status(404).json({ error: 'Trip index out of range' });
    }
    const trip = list[targetIdx];
    const action = req.body.action;

    if (action === 'Complete') {
      trip.status = 'Completed';
      trip.eta = '—';
      if (trip.vehicle) await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
      if (trip.driver) await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });
    } else if (action === 'Cancel') {
      trip.status = 'Cancelled';
      trip.eta = 'Cancelled by dispatcher';
      if (trip.vehicle) await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
      if (trip.driver) await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });
    }

    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- MAINTENANCE API ---
app.get('/api/maintenance', async (req, res) => {
  try {
    const list = await Maintenance.find().populate('vehicle').sort({ _id: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/maintenance', async (req, res) => {
  try {
    const item = new Maintenance(req.body);
    await item.save();

    // Set vehicle status to In Shop
    await Vehicle.findByIdAndUpdate(req.body.vehicle, { status: 'In Shop' });

    const populated = await Maintenance.findById(item._id).populate('vehicle');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/maintenance/:index/close', async (req, res) => {
  try {
    const list = await Maintenance.find().sort({ _id: -1 });
    const targetIdx = Number(req.params.index);
    if (targetIdx < 0 || targetIdx >= list.length) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }
    const record = list[targetIdx];
    record.status = 'Completed';
    await record.save();

    // Restore vehicle status to Available (unless retired)
    const veh = await Vehicle.findById(record.vehicle);
    if (veh && veh.status !== 'Retired') {
      veh.status = 'Available';
      await veh.save();
    }

    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- FUEL API ---
app.get('/api/fuel', async (req, res) => {
  try {
    const list = await Fuel.find().populate('vehicle').sort({ _id: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/fuel', async (req, res) => {
  try {
    const item = new Fuel(req.body);
    await item.save();
    const populated = await Fuel.findById(item._id).populate('vehicle');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
