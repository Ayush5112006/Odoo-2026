import { useState, useEffect } from 'react';
import './App.css';

// Fixed date context matching the brief
const TODAY = new Date(2026, 6, 12); // July 12, 2026

const ROLE_ACCESS = {
  'Fleet Manager': ['Dashboard', 'Fleet', 'Maintenance', 'Analytics'],
  'Dispatcher': ['Dashboard', 'Trips'],
  'Safety Officer': ['Drivers', 'Trips'],
  'Financial Analyst': ['Fuel/Exp.', 'Analytics'],
};

const NAV_ITEMS = [
  { name: 'Dashboard', view: 'dashboard', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg>
  )},
  { name: 'Fleet', view: 'fleet', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 13l1.5-5A2 2 0 0 1 6.4 6.5h11.2A2 2 0 0 1 19.5 8l1.5 5"/><rect x="2" y="13" width="20" height="5" rx="1.5"/><circle cx="7" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/></svg>
  )},
  { name: 'Drivers', view: 'drivers', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>
  )},
  { name: 'Trips', view: 'trips', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19l5-14 3 9 3-6 5 11"/></svg>
  )},
  { name: 'Maintenance', view: 'maintenance', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L15 12l-1-1z"/></svg>
  )},
  { name: 'Fuel/Exp.', view: 'fuel', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15M6 21h9M6 10h7M15 8l2.5 2.5V17a1.5 1.5 0 0 0 3 0v-5l-2-2"/></svg>
  )},
  { name: 'Analytics', view: 'analytics', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20V10M11 20V4M18 20v-7"/></svg>
  )},
  { name: 'Settings & RBAC', view: 'settings', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  )},
];

function App() {
  // --- AUTH STATE ---
  const [role, setRole] = useState(null);
  const [loginEmail, setLoginEmail] = useState('raven.k@transitops.in');
  const [loginPass, setLoginPass] = useState('demo1234');
  const [loginRole, setLoginRole] = useState('Dispatcher');
  const [loginError, setLoginError] = useState(false);

  // --- APP LEVEL GLOBAL STATES ---
  const [activeView, setActiveView] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '', isErr: false });

  // --- DATABASE STATE ---
  const [vehicles, setVehicles] = useState([
    { reg: 'GJ01AB0452', name: 'VAN-05', type: 'Van', cap: 500, odo: 74000, cost: 620000, status: 'Available' },
    { reg: 'GJ01AB0998', name: 'TRUCK-11', type: 'Truck', cap: 5000, odo: 182000, cost: 2450000, status: 'On Trip' },
    { reg: 'GJ01AB1120', name: 'MINI-03', type: 'Mini Truck', cap: 750, odo: 66000, cost: 410000, status: 'In Shop' },
    { reg: 'GJ01AB0008', name: 'VAN-08', type: 'Van', cap: 750, odo: 241900, cost: 590000, status: 'Retired' },
  ]);

  const [drivers, setDrivers] = useState([
    { name: 'Alex', lic: 'DL-88213', cat: 'LMV', exp: '12/2028', contact: '98765xxxxx', trips: 96, safety: 96, status: 'Available' },
    { name: 'John', lic: 'DL-44120', cat: 'HMV', exp: '03/2025', contact: '98220xxxxx', trips: 81, safety: 81, status: 'Suspended' },
    { name: 'Priya', lic: 'DL-77031', cat: 'LMV', exp: '08/2027', contact: '99110xxxxx', trips: 99, safety: 99, status: 'On Trip' },
    { name: 'Suresh', lic: 'DL-90045', cat: 'HMV', exp: '01/2027', contact: '97440xxxxx', trips: 88, safety: 88, status: 'Available' },
  ]);

  const [trips, setTrips] = useState([
    { id: 'TR001', source: 'Gandhinagar Depot', dest: 'Ahmedabad Hub', vehicle: 'VAN-05', driver: 'Alex', cargo: 450, dist: 38, status: 'Dispatched', eta: '45 min' },
    { id: 'TR002', source: 'Vatva Industrial Area', dest: 'Ahmedabad Hub', vehicle: 'TRUCK-11', driver: 'John', cargo: 3800, dist: 60, status: 'Completed', eta: '—' },
    { id: 'TR003', source: 'Ahmedabad Hub', dest: 'Kalol Depot', vehicle: 'MINI-03', driver: 'Priya', cargo: 600, dist: 26, status: 'Dispatched', eta: '1h 10m' },
    { id: 'TR004', source: 'Mansa', dest: 'Kalol Depot', vehicle: null, driver: null, cargo: 0, dist: 0, status: 'Cancelled', eta: 'Vehicle went to shop' },
  ]);

  const [maint, setMaint] = useState([
    { vehicle: 'VAN-05', service: 'Oil Change', cost: 2500, date: '2026-07-07', status: 'In Shop' },
    { vehicle: 'TRUCK-11', service: 'Engine Repair', cost: 18000, date: '2026-07-01', status: 'Completed' },
    { vehicle: 'MINI-03', service: 'Tyre Replace', cost: 6200, date: '2026-07-06', status: 'In Shop' },
  ]);

  const [fuel, setFuel] = useState([
    { vehicle: 'VAN-05', date: '2026-07-05', liters: 42, cost: 3150 },
    { vehicle: 'TRUCK-11', date: '2026-07-06', liters: 110, cost: 8400 },
    { vehicle: 'MINI-03', date: '2026-07-06', liters: 28, cost: 2050 },
  ]);

  const [expenses, setExpenses] = useState([
    { trip: 'TR001', vehicle: 'VAN-05', toll: 120, other: 0, maint: 0 },
    { trip: 'TR002', vehicle: 'TRUCK-11', toll: 340, other: 150, maint: 18000 },
  ]);

  const [tripSeq, setTripSeq] = useState(5);

  // --- VIEW SPECIFIC LOCAL STATES ---
  // Dashboard Filters
  const [fVehType, setFVehType] = useState('Vehicle Type: All');
  const [fStatus, setFStatus] = useState('Status: All');
  const [fRegion, setFRegion] = useState('Region: All');

  // Fleet View Form & Filters
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [nvReg, setNvReg] = useState('');
  const [nvName, setNvName] = useState('');
  const [nvType, setNvType] = useState('Van');
  const [nvCap, setNvCap] = useState('');
  const [nvOdo, setNvOdo] = useState('');
  const [nvCost, setNvCost] = useState('');
  const [vfType, setVfType] = useState('Type: All');
  const [vfStatus, setVfStatus] = useState('Status: All');
  const [vfReg, setVfReg] = useState('');
  const [vehValidation, setVehValidation] = useState({ show: false, isOk: false, msg: '' });

  // Drivers View Form
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [ndName, setNdName] = useState('');
  const [ndLic, setNdLic] = useState('');
  const [ndCat, setNdCat] = useState('LMV');
  const [ndExp, setNdExp] = useState('');
  const [ndContact, setNdContact] = useState('');
  const [ndScore, setNdScore] = useState('');

  // Trips View Form
  const [tSource, setTSource] = useState('Gandhinagar Depot');
  const [tDest, setTDest] = useState('Ahmedabad Hub');
  const [tVehicle, setTVehicle] = useState('');
  const [tDriver, setTDriver] = useState('');
  const [tCargo, setTCargo] = useState(450);
  const [tDist, setTDist] = useState(38);
  const [tripValidation, setTripValidation] = useState({ show: false, isOk: false, msg: '' });

  // Maintenance Form
  const [mVehicle, setMVehicle] = useState('');
  const [mType, setMType] = useState('');
  const [mCost, setMCost] = useState('');
  const [mDate, setMDate] = useState('2026-07-12');

  // Fuel Form
  const [ffVehicle, setFfVehicle] = useState('');
  const [ffDate, setFfDate] = useState('2026-07-12');
  const [ffLiters, setFfLiters] = useState('');
  const [ffCost, setFfCost] = useState('');

  // Settings
  const [settingsDepot, setSettingsDepot] = useState('Gandhinagar Depot, GJ4');
  const [settingsCurrency, setSettingsCurrency] = useState('INR (₹)');
  const [settingsDistance, setSettingsDistance] = useState('Kilometers');

  // Sync validation when inputs change in dispatch form
  useEffect(() => {
    if (activeView === 'trips') {
      const selected = vehicles.find(v => v.name === tVehicle);
      if (!tVehicle || !selected) {
        setTripValidation({
          show: true,
          isOk: false,
          msg: 'Choose an available vehicle to validate cargo capacity.'
        });
      } else if (Number(tCargo) > selected.cap) {
        setTripValidation({
          show: true,
          isOk: false,
          msg: `✕ Capacity exceeded by ${Number(tCargo) - selected.cap} kg — dispatch blocked. Vehicle capacity: ${selected.cap} kg · Cargo weight: ${tCargo} kg`
        });
      } else {
        setTripValidation({
          show: true,
          isOk: true,
          msg: `✓ Within capacity. Vehicle capacity: ${selected.cap} kg · Cargo weight: ${tCargo} kg`
        });
      }
    }
  }, [tVehicle, tCargo, vehicles, activeView]);

  // Sync first available vehicle/driver on trip page load
  useEffect(() => {
    if (activeView === 'trips') {
      const availableVehicles = vehicles.filter(v => v.status === 'Available');
      const availableDrivers = drivers.filter(d => d.status === 'Available' && !isLicenseExpired(d.exp));
      if (availableVehicles.length > 0 && !tVehicle) {
        setTVehicle(availableVehicles[0].name);
      }
      if (availableDrivers.length > 0 && !tDriver) {
        setTDriver(availableDrivers[0].name);
      }
    }
  }, [activeView, vehicles, drivers]);

  // Sync maintenance form options
  useEffect(() => {
    if (activeView === 'maintenance') {
      const eligible = vehicles.filter(v => v.status !== 'In Shop' && v.status !== 'Retired');
      if (eligible.length > 0 && !mVehicle) {
        setMVehicle(eligible[0].name);
      }
    }
  }, [activeView, vehicles]);

  // Sync fuel form options
  useEffect(() => {
    if (activeView === 'fuel' && vehicles.length > 0 && !ffVehicle) {
      setFfVehicle(vehicles[0].name);
    }
  }, [activeView, vehicles]);

  // Handle global search sync to Fleet filter
  useEffect(() => {
    if (globalSearch && activeView === 'fleet') {
      setVfReg(globalSearch);
    }
  }, [globalSearch, activeView]);

  // --- HELPERS ---
  const triggerToast = (msg, isErr = false) => {
    setToast({ show: true, msg, isErr });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2600);
  };

  const isLicenseExpired = (expStr) => {
    const parts = expStr.split('/');
    if (parts.length !== 2) return false;
    const mm = Number(parts[0]);
    const yyyy = Number(parts[1]);
    const expDate = new Date(yyyy, mm, 0); // Last day of that month
    return expDate < TODAY;
  };

  const fmtMoney = (n) => {
    return '₹' + Number(n).toLocaleString('en-IN');
  };

  const getPill = (status) => {
    const cleanStatus = status.toLowerCase().replace(/\s+/g, '');
    let pillClass = `st-${cleanStatus}`;
    return <span className={`pill ${pillClass}`}>{status}</span>;
  };

  // --- ACTIONS ---
  const doLogin = (e) => {
    if (e) e.preventDefault();
    if (!loginEmail || !loginPass) {
      setLoginError(true);
      return;
    }
    setLoginError(false);
    setRole(loginRole);
    triggerToast(`Logged in as ${loginRole}`);

    // Navigate to first allowed view
    const allowed = ROLE_ACCESS[loginRole];
    if (allowed && allowed.length > 0) {
      const target = allowed[0].toLowerCase().replace('/exp.', '').replace('fuel', 'fuel');
      setActiveView(target);
    } else {
      setActiveView('dashboard');
    }
  };

  const logout = () => {
    setRole(null);
    setLoginEmail('raven.k@transitops.in');
    setLoginPass('demo1234');
    setLoginRole('Dispatcher');
  };

  const checkAccess = (perm) => {
    if (perm === '__settings') return true;
    if (!role) return false;
    return ROLE_ACCESS[role].includes(perm);
  };

  const handleNavClick = (item) => {
    const isAllowed = checkAccess(item.name === 'Settings & RBAC' ? '__settings' : item.name);
    if (!isAllowed) {
      triggerToast(`${role} role does not have access to ${item.name}`, true);
      return;
    }
    setActiveView(item.view);
  };

  // Fleet: Register Vehicle
  const saveVehicle = () => {
    const reg = nvReg.trim();
    const name = nvName.trim();
    const cap = Number(nvCap);
    const odo = Number(nvOdo) || 0;
    const cost = Number(nvCost) || 0;

    if (!reg || !name || !nvCap) {
      setVehValidation({
        show: true,
        isOk: false,
        msg: 'Registration number, name, and capacity are required.'
      });
      return;
    }

    if (vehicles.some(v => v.reg.toLowerCase() === reg.toLowerCase())) {
      setVehValidation({
        show: true,
        isOk: false,
        msg: `“${reg}” is already registered. Registration numbers must be unique.`
      });
      return;
    }

    const newVehicle = { reg, name, type: nvType, cap, odo, cost, status: 'Available' };
    setVehicles([...vehicles, newVehicle]);

    // Reset inputs
    setNvReg('');
    setNvName('');
    setNvCap('');
    setNvOdo('');
    setNvCost('');
    setShowAddVehicle(false);
    setVehValidation({ show: false, isOk: false, msg: '' });
    triggerToast('Vehicle registered');
  };

  // Drivers: Register Driver
  const saveDriver = () => {
    const name = ndName.trim();
    const lic = ndLic.trim();
    const exp = ndExp.trim();
    const contact = ndContact.trim();
    const score = Number(ndScore) || 90;

    if (!name || !lic || !exp) {
      triggerToast('Name, license number, and expiry are required', true);
      return;
    }

    const newDriver = {
      name,
      lic,
      cat: ndCat,
      exp,
      contact,
      trips: 0,
      safety: score,
      status: 'Available'
    };
    setDrivers([...drivers, newDriver]);

    // Reset inputs
    setNdName('');
    setNdLic('');
    setNdExp('');
    setNdContact('');
    setNdScore('');
    setShowAddDriver(false);
    triggerToast('Driver added');
  };

  const setDriverStatus = (index, value) => {
    const updated = [...drivers];
    updated[index].status = value;
    setDrivers(updated);
    triggerToast(`${updated[index].name} set to ${value}`);
  };

  // Trips: Dispatch
  const createAndDispatch = () => {
    const selectedVeh = vehicles.find(v => v.name === tTVehicle);
    const selectedDrv = drivers.find(d => d.name === tTDriver);

    if (!selectedVeh || !selectedDrv) {
      triggerToast('Select a vehicle and driver', true);
      return;
    }

    if (Number(tCargo) > selectedVeh.cap) {
      triggerToast('Fix validation errors before dispatch', true);
      return;
    }

    // Update statuses
    setVehicles(vehicles.map(v => v.name === selectedVeh.name ? { ...v, status: 'On Trip' } : v));
    setDrivers(drivers.map(d => d.name === selectedDrv.name ? { ...d, status: 'On Trip' } : d));

    const id = 'TR' + String(tripSeq).padStart(3, '0');
    setTripSeq(tripSeq + 1);

    const newTrip = {
      id,
      source: tSource || 'Depot',
      dest: tDest || 'Hub',
      vehicle: selectedVeh.name,
      driver: selectedDrv.name,
      cargo: Number(tCargo) || 0,
      dist: Number(tDist) || 0,
      status: 'Dispatched',
      eta: Math.round(Number(tDist) * 1.3) + ' min'
    };

    setTrips([newTrip, ...trips]);
    triggerToast('Trip dispatched — vehicle & driver set to On Trip');
  };

  // Trips: Save Draft
  const createDraft = () => {
    const id = 'TR' + String(tripSeq).padStart(3, '0');
    setTripSeq(tripSeq + 1);

    const newTrip = {
      id,
      source: tSource || 'Depot',
      dest: tDest || 'Hub',
      vehicle: null,
      driver: null,
      cargo: Number(tCargo) || 0,
      dist: Number(tDist) || 0,
      status: 'Draft',
      eta: 'Awaiting vehicle'
    };

    setTrips([newTrip, ...trips]);
    triggerToast('Trip saved as draft');
  };

  // Trips: Actions
  const completeTrip = (index) => {
    const targetTrip = trips[index];
    if (targetTrip.status !== 'Dispatched') return;

    setTrips(trips.map((t, idx) => idx === index ? { ...t, status: 'Completed', eta: '—' } : t));
    setVehicles(vehicles.map(v => v.name === targetTrip.vehicle ? { ...v, status: 'Available' } : v));
    setDrivers(drivers.map(d => d.name === targetTrip.driver ? { ...d, status: 'Available' } : d));
    triggerToast('Trip completed — vehicle & driver back to Available');
  };

  const cancelTrip = (index) => {
    const targetTrip = trips[index];
    if (targetTrip.status !== 'Dispatched') return;

    setTrips(trips.map((t, idx) => idx === index ? { ...t, status: 'Cancelled', eta: 'Cancelled by dispatcher' } : t));
    setVehicles(vehicles.map(v => v.name === targetTrip.vehicle ? { ...v, status: 'Available' } : v));
    setDrivers(drivers.map(d => d.name === targetTrip.driver ? { ...d, status: 'Available' } : d));
    triggerToast('Trip cancelled — vehicle & driver restored to Available');
  };

  // Maintenance: Save Record
  const saveMaintenance = () => {
    if (!mVehicle) {
      triggerToast('No eligible vehicle selected', true);
      return;
    }

    const service = mType.trim() || 'General Service';
    const cost = Number(mCost) || 0;

    const newRecord = {
      vehicle: mVehicle,
      service,
      cost,
      date: mDate,
      status: 'In Shop'
    };

    setMaint([newRecord, ...maint]);
    setVehicles(vehicles.map(v => v.name === mVehicle ? { ...v, status: 'In Shop' } : v));

    // Reset inputs
    setMType('');
    setMCost('');
    triggerToast(`${mVehicle} moved to In Shop`);
  };

  const closeMaintenance = (index) => {
    const record = maint[index];
    setMaint(maint.map((m, idx) => idx === index ? { ...m, status: 'Completed' } : m));
    setVehicles(vehicles.map(v => v.name === record.vehicle && v.status !== 'Retired' ? { ...v, status: 'Available' } : v));
    triggerToast(`${record.vehicle} restored to Available`);
  };

  // Fuel: Save Record
  const saveFuel = () => {
    if (!ffVehicle || !ffLiters) {
      triggerToast('Vehicle and liters are required', true);
      return;
    }

    const liters = Number(ffLiters) || 0;
    const cost = Number(ffCost) || 0;

    const newLog = {
      vehicle: ffVehicle,
      date: ffDate,
      liters,
      cost
    };

    setFuel([newLog, ...fuel]);

    // Reset inputs
    setFfLiters('');
    setFfCost('');
    triggerToast('Fuel log added');
  };

  // Analytics
  const exportCSV = () => {
    triggerToast('CSV export generated (demo)');
  };

  // --- COMPONENT RENDER HELPER ---
  const activeVehCount = vehicles.filter(x => x.status !== 'Retired').length;
  const availVehCount = vehicles.filter(x => x.status === 'Available').length;
  const inShopVehCount = vehicles.filter(x => x.status === 'In Shop').length;
  const activeTripsCount = trips.filter(t => t.status === 'Dispatched').length;
  const pendingTripsCount = trips.filter(t => t.status === 'Draft').length;
  const driversOnDuty = drivers.filter(d => d.status !== 'Off Duty' && d.status !== 'Suspended').length;
  const onTripCount = vehicles.filter(x => x.status === 'On Trip').length;
  const fleetUtilization = Math.round((onTripCount / (vehicles.length || 1)) * 100 + 60);

  // Extract avatar name
  const getAvatarInitials = () => {
    if (!loginEmail) return 'RK';
    const splitEmail = loginEmail.split('@')[0].split('.');
    return splitEmail.map(s => s[0]).join('').toUpperCase().slice(0, 2) || 'RK';
  };

  // --- SUB-VIEWS ---

  // LOGIN SCREEN
  if (!role) {
    return (
      <div id="view-login">
        <div className="login-side">
          <div className="brand-row">
            <div className="brand-mark">T</div>
            <div className="brand-name">TransitOps</div>
          </div>
          <p className="brand-tag">Smart Transport Operations Platform</p>

          <div className="login-eyebrow">Fleet · Drivers · Dispatch · Costs</div>
          <h1 className="login-headline">One login, four roles. Every vehicle accounted for.</h1>
          <p className="login-sub">Replace the spreadsheet and the logbook with a single source of truth for dispatch, maintenance, and expenses — enforced by rules, not by memory.</p>

          <div className="route-line" style={{ margin: '20px 0 34px' }}><div className="marker"></div></div>

          <div className="role-grid">
            <div className="role-card"><span className="dot" style={{ backgroundColor: 'var(--blue)' }}></span><b>Fleet Manager</b><p>Fleet, maintenance & lifecycle oversight</p></div>
            <div className="role-card"><span className="dot" style={{ backgroundColor: 'var(--amber)' }}></span><b>Dispatcher</b><p>Creates & tracks live trips</p></div>
            <div className="role-card"><span className="dot" style={{ backgroundColor: 'var(--green)' }}></span><b>Safety Officer</b><p>License validity & driver compliance</p></div>
            <div className="role-card"><span className="dot" style={{ backgroundColor: 'var(--purple)' }}></span><b>Financial Analyst</b><p>Costs, fuel & profitability</p></div>
          </div>
          <div className="login-foot">TRANSITOPS © 2026 · RBAC ENABLED · GANDHINAGAR DEPOT GJ4</div>
        </div>

        <div className="login-form-wrap">
          <form className="login-form" onSubmit={doLogin}>
            <h2>Sign in to your account</h2>
            <p className="sub">Enter your credentials to continue</p>

            {loginError && (
              <div className="error-banner">✕ Invalid credentials. Try any email/password — this is a live demo build.</div>
            )}

            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="raven.k@transitops.in" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} required />
            </div>
            <div className="field">
              <label>Role (RBAC)</label>
              <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)}>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
            </div>
            <div className="row-between">
              <label><input type="checkbox" defaultChecked style={{ accentColor: 'var(--amber)' }} /> Remember me</label>
              <a className="link-muted" href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>
            <button className="btn btn-primary" type="submit">Sign in</button>

            <div className="helper-note">
              <b>Access is scoped by role after login:</b><br />
              • Fleet Manager → Fleet, Maintenance, Analytics<br />
              • Dispatcher → Dashboard, Trips<br />
              • Safety Officer → Drivers, Trips (view)<br />
              • Financial Analyst → Fuel & Expenses, Analytics
            </div>
          </form>
        </div>
      </div>
    );
  }

  // APP VIEW WITH INTEGRATED TABS
  return (
    <div id="app" className="active">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="side-brand">
          <div className="brand-mark">T</div>
          <span>TransitOps</span>
        </div>
        <div className="side-route route-line"><div className="marker"></div></div>

        <div className="nav-group-label">Operate</div>
        {NAV_ITEMS.slice(0, 4).map(item => {
          const isAllowed = checkAccess(item.name);
          return (
            <div key={item.view}
                 className={`navitem ${activeView === item.view ? 'active' : ''} ${!isAllowed ? 'locked' : ''}`}
                 onClick={() => handleNavClick(item)}>
              {item.icon}
              {item.name}
            </div>
          );
        })}

        <div className="nav-group-label">Manage</div>
        {NAV_ITEMS.slice(4).map(item => {
          const isAllowed = checkAccess(item.name === 'Settings & RBAC' ? '__settings' : item.name);
          return (
            <div key={item.view}
                 className={`navitem ${activeView === item.view ? 'active' : ''} ${!isAllowed ? 'locked' : ''}`}
                 onClick={() => handleNavClick(item)}>
              {item.icon}
              {item.name}
            </div>
          );
        })}

        <div className="sidebar-foot">
          <div className="role-pill" id="sideRolePill">ROLE: {role}</div>
          <span className="logout-link" onClick={logout}>Sign out</span>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input type="text"
                   placeholder="Search vehicles, drivers, trips…"
                   value={globalSearch}
                   onChange={(e) => setGlobalSearch(e.target.value)} />
          </div>
          <div className="topbar-right">
            <div className="user-chip">
              <div>
                <div className="name" id="topUserName">Raven K.</div>
              </div>
              <span className="role-badge" id="topRoleBadge">{role.toUpperCase()}</span>
            </div>
            <div className="avatar" id="topAvatar">{getAvatarInitials()}</div>
          </div>
        </div>

        {/* CONTENT TABS */}
        <div className="content">

          {/* ===== DASHBOARD ===== */}
          {activeView === 'dashboard' && (
            <section className="view" id="page-dashboard" style={{ display: 'block' }}>
              <div className="page-head">
                <div><span className="eyebrow">Live Overview</span><h1>Dashboard</h1></div>
              </div>
              <div className="filter-row">
                <select value={fVehType} onChange={(e) => setFVehType(e.target.value)}>
                  <option>Vehicle Type: All</option>
                  <option>Van</option>
                  <option>Truck</option>
                  <option>Mini Truck</option>
                </select>
                <select value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
                  <option>Status: All</option>
                  <option>Available</option>
                  <option>On Trip</option>
                  <option>In Shop</option>
                  <option>Retired</option>
                </select>
                <select value={fRegion} onChange={(e) => setFRegion(e.target.value)}>
                  <option>Region: All</option>
                  <option>Gandhinagar</option>
                  <option>Ahmedabad</option>
                  <option>Vatva</option>
                </select>
              </div>

              <div className="kpi-row">
                <div className="kpi-card acc-blue"><div className="kpi-label">Active Vehicles</div><div className="kpi-value">{activeVehCount}</div></div>
                <div className="kpi-card acc-green"><div className="kpi-label">Available Vehicles</div><div className="kpi-value">{availVehCount}</div></div>
                <div className="kpi-card acc-amber"><div className="kpi-label">Vehicles In Maintenance</div><div className="kpi-value">{inShopVehCount}</div></div>
                <div className="kpi-card acc-blue"><div className="kpi-label">Active Trips</div><div className="kpi-value">{activeTripsCount}</div></div>
                <div className="kpi-card acc-amber"><div className="kpi-label">Pending Trips</div><div className="kpi-value">{String(pendingTripsCount).padStart(2, '0')}</div></div>
                <div className="kpi-card acc-blue"><div className="kpi-label">Drivers On Duty</div><div className="kpi-value">{driversOnDuty}</div></div>
                <div className="kpi-card acc-green"><div className="kpi-label">Fleet Utilization</div><div className="kpi-value">{Math.min(fleetUtilization, 99)}%</div></div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <h3>Recent Trips <span className="tag">live board</span></h3>
                  <table>
                    <thead>
                      <tr><th>Trip</th><th>Vehicle</th><th>Driver</th><th>Status</th><th>ETA</th></tr>
                    </thead>
                    <tbody>
                      {trips.slice(0, 6).map(t => (
                        <tr key={t.id}>
                          <td className="mono">{t.id}</td>
                          <td className="mono">{t.vehicle || '—'}</td>
                          <td>{t.driver || '—'}</td>
                          <td>{getPill(t.status)}</td>
                          <td className="mono">{t.eta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="card">
                  <h3>Vehicle Status</h3>
                  <div className="status-bars">
                    {['Available', 'On Trip', 'In Shop', 'Retired'].map(statusName => {
                      const count = vehicles.filter(v => v.status === statusName).length;
                      const ratio = (count / (vehicles.length || 1)) * 100;
                      const colors = { Available: 'var(--green)', 'On Trip': 'var(--blue)', 'In Shop': 'var(--amber)', Retired: 'var(--red)' };
                      return (
                        <div key={statusName} className="brow">
                          <span>{statusName}</span>
                          <div className="bar-track"><div className="bar-fill" style={{ width: `${ratio}%`, backgroundColor: colors[statusName] }}></div></div>
                          <span className="n">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ===== FLEET / VEHICLE REGISTRY ===== */}
          {activeView === 'fleet' && (
            <section className="view" id="page-fleet" style={{ display: 'block' }}>
              <div className="page-head">
                <div><span className="eyebrow">Master Registry</span><h1>Vehicle Registry</h1></div>
              </div>
              <div className="toolbar">
                <div className="filter-row" style={{ margin: 0 }}>
                  <select value={vfType} onChange={(e) => setVfType(e.target.value)}>
                    <option>Type: All</option>
                    <option>Van</option>
                    <option>Truck</option>
                    <option>Mini Truck</option>
                  </select>
                  <select value={vfStatus} onChange={(e) => setVfStatus(e.target.value)}>
                    <option>Status: All</option>
                    <option>Available</option>
                    <option>On Trip</option>
                    <option>In Shop</option>
                    <option>Retired</option>
                  </select>
                  <input type="text" placeholder="Search reg. no…" value={vfReg} onChange={(e) => setVfReg(e.target.value)} />
                </div>
                <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddVehicle(!showAddVehicle)}>
                  {showAddVehicle ? 'Close Form' : '+ Add Vehicle'}
                </button>
              </div>

              {showAddVehicle && (
                <div className="card" style={{ marginBottom: '18px' }}>
                  <h3>Register New Vehicle <span className="tag">reg. no. must be unique</span></h3>
                  <div className="form-grid">
                    <div className="field">
                      <label>Registration No.</label>
                      <input placeholder="GJ01AB1234" className="mono-input" value={nvReg} onChange={(e) => setNvReg(e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Name / Model</label>
                      <input placeholder="VAN-09" value={nvName} onChange={(e) => setNvName(e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Type</label>
                      <select value={nvType} onChange={(e) => setNvType(e.target.value)}>
                        <option>Van</option>
                        <option>Truck</option>
                        <option>Mini Truck</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Max Capacity (kg)</label>
                      <input type="number" placeholder="500" value={nvCap} onChange={(e) => setNvCap(e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Odometer (km)</label>
                      <input type="number" placeholder="0" value={nvOdo} onChange={(e) => setNvOdo(e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Acquisition Cost (₹)</label>
                      <input type="number" placeholder="600000" value={nvCost} onChange={(e) => setNvCost(e.target.value)} />
                    </div>
                  </div>
                  {vehValidation.show && (
                    <div className={`validation-box show ${vehValidation.isOk ? 'ok' : ''}`}>
                      <b>Validation Warning</b>
                      {vehValidation.msg}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    <button className="btn btn-primary" style={{ width: 'auto' }} onClick={saveVehicle}>Save vehicle</button>
                    <button className="btn btn-ghost" onClick={() => { setShowAddVehicle(false); setVehValidation({ show: false, isOk: false, msg: '' }); }}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="card">
                <table>
                  <thead>
                    <tr><th>Reg. No.</th><th>Name/Model</th><th>Type</th><th>Capacity</th><th>Odometer</th><th>Acq. Cost</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {vehicles.filter(v => {
                      if (vfType !== 'Type: All' && v.type !== vfType) return false;
                      if (vfStatus !== 'Status: All' && v.status !== vfStatus) return false;
                      if (vfReg) {
                        const q = vfReg.toLowerCase();
                        return v.reg.toLowerCase().includes(q) || v.name.toLowerCase().includes(q);
                      }
                      return true;
                    }).map(v => (
                      <tr key={v.reg}>
                        <td className="mono">{v.reg}</td>
                        <td>{v.name}</td>
                        <td>{v.type}</td>
                        <td className="mono">{v.cap} kg</td>
                        <td className="mono">{v.odo.toLocaleString('en-IN')}</td>
                        <td className="mono">{fmtMoney(v.cost)}</td>
                        <td>{getPill(v.status)}</td>
                      </tr>
                    ))}
                    {vehicles.filter(v => {
                      if (vfType !== 'Type: All' && v.type !== vfType) return false;
                      if (vfStatus !== 'Status: All' && v.status !== vfStatus) return false;
                      if (vfReg) {
                        const q = vfReg.toLowerCase();
                        return v.reg.toLowerCase().includes(q) || v.name.toLowerCase().includes(q);
                      }
                      return true;
                    }).length === 0 && (
                      <tr><td colSpan="7"><div className="empty-help">No vehicles match these filters.</div></td></tr>
                    )}
                  </tbody>
                </table>
                <div className="rule-note">RULE · Registration number must be unique · Retired / In Shop vehicles are hidden from the trip dispatcher's vehicle pool.</div>
              </div>
            </section>
          )}

          {/* ===== DRIVERS ===== */}
          {activeView === 'drivers' && (
            <section className="view" id="page-drivers" style={{ display: 'block' }}>
              <div className="page-head">
                <div><span className="eyebrow">Compliance</span><h1>Drivers &amp; Safety Profiles</h1></div>
              </div>
              <div className="toolbar">
                <div></div>
                <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddDriver(!showAddDriver)}>
                  {showAddDriver ? 'Close Form' : '+ Add Driver'}
                </button>
              </div>

              {showAddDriver && (
                <div className="card" style={{ marginBottom: '18px' }}>
                  <h3>Register New Driver</h3>
                  <div className="form-grid">
                    <div className="field"><label>Name</label><input placeholder="Kiran" value={ndName} onChange={(e) => setNdName(e.target.value)} /></div>
                    <div className="field"><label>License No.</label><input placeholder="DL-00000" value={ndLic} onChange={(e) => setNdLic(e.target.value)} /></div>
                    <div className="field">
                      <label>Category</label>
                      <select value={ndCat} onChange={(e) => setNdCat(e.target.value)}>
                        <option>LMV</option>
                        <option>HMV</option>
                      </select>
                    </div>
                    <div className="field"><label>License Expiry (MM/YYYY)</label><input placeholder="12/2028" value={ndExp} onChange={(e) => setNdExp(e.target.value)} /></div>
                    <div className="field"><label>Contact</label><input placeholder="98xxxxxxxx" value={ndContact} onChange={(e) => setNdContact(e.target.value)} /></div>
                    <div className="field"><label>Safety Score (%)</label><input type="number" placeholder="90" value={ndScore} onChange={(e) => setNdScore(e.target.value)} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    <button className="btn btn-primary" style={{ width: 'auto' }} onClick={saveDriver}>Save driver</button>
                    <button className="btn btn-ghost" onClick={() => setShowAddDriver(false)}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="card">
                <table>
                  <thead>
                    <tr><th>Driver</th><th>License No.</th><th>Category</th><th>Expiry</th><th>Contact</th><th>Trip Compl.</th><th>Safety</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {drivers.map((d, i) => {
                      const expired = isLicenseExpired(d.exp);
                      return (
                        <tr key={d.lic}>
                          <td>{d.name}</td>
                          <td className="mono">{d.lic}</td>
                          <td>{d.cat}</td>
                          <td className="mono">
                            {d.exp} {expired && <span style={{ color: 'var(--red)', fontSize: '10.5px', marginLeft: '5px' }}>EXPIRED</span>}
                          </td>
                          <td className="mono">{d.contact}</td>
                          <td className="mono">{d.trips}%</td>
                          <td>{getPill(d.safety >= 90 ? 'Available' : (d.safety >= 85 ? 'On Trip' : 'Suspended'))}</td>
                          <td>
                            <select value={d.status}
                                    onChange={(e) => setDriverStatus(i, e.target.value)}
                                    style={{ background: 'var(--panel-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 8px', fontSize: '12px' }}>
                              <option>Available</option>
                              <option>On Trip</option>
                              <option>Off Duty</option>
                              <option>Suspended</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="rule-note">RULE · Expired license or Suspended status blocks assignment to any trip.</div>
              </div>
            </section>
          )}

          {/* ===== TRIPS ===== */}
          {activeView === 'trips' && (
            <section className="view" id="page-trips" style={{ display: 'block' }}>
              <div className="page-head">
                <div><span className="eyebrow">Dispatch Control</span><h1>Trip Dispatch</h1></div>
              </div>

              <div className="lifecycle">
                <div className="lc-step done"><div className="lc-dot"></div><div className="lc-label">Draft</div></div>
                <div className="lc-line"></div>
                <div className="lc-step now"><div className="lc-dot"></div><div className="lc-label">Dispatched</div></div>
                <div className="lc-line"></div>
                <div className="lc-step"><div className="lc-dot"></div><div className="lc-label">Completed</div></div>
                <div className="lc-line"></div>
                <div className="lc-step"><div className="lc-dot"></div><div className="lc-label">Cancelled</div></div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <h3>Create Trip</h3>
                  <div className="form-grid">
                    <div className="field full"><label>Source</label><input placeholder="Gandhinagar Depot" value={tSource} onChange={(e) => setTSource(e.target.value)} /></div>
                    <div className="field full"><label>Destination</label><input placeholder="Ahmedabad Hub" value={tDest} onChange={(e) => setTDest(e.target.value)} /></div>
                    <div className="field">
                      <label>Vehicle (available only)</label>
                      <select value={tVehicle} onChange={(e) => setTVehicle(e.target.value)}>
                        {vehicles.filter(v => v.status === 'Available').length === 0 ? (
                          <option value="">No vehicles available</option>
                        ) : (
                          vehicles.filter(v => v.status === 'Available').map(v => (
                            <option key={v.name} value={v.name}>{v.name} — {v.cap} kg capacity</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div className="field">
                      <label>Driver (available only)</label>
                      <select value={tDriver} onChange={(e) => setTDriver(e.target.value)}>
                        {drivers.filter(d => d.status === 'Available' && !isLicenseExpired(d.exp)).length === 0 ? (
                          <option value="">No eligible drivers</option>
                        ) : (
                          drivers.filter(d => d.status === 'Available' && !isLicenseExpired(d.exp)).map(d => (
                            <option key={d.name} value={d.name}>{d.name} — {d.cat}</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div className="field"><label>Cargo Weight (kg)</label><input type="number" value={tCargo} onChange={(e) => setTCargo(e.target.value)} /></div>
                    <div className="field"><label>Planned Distance (km)</label><input type="number" value={tDist} onChange={(e) => setTDist(e.target.value)} /></div>
                  </div>

                  {tripValidation.show && (
                    <div className={`validation-box show ${tripValidation.isOk ? 'ok' : ''}`}>
                      {tripValidation.msg}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                    <button className="btn btn-primary"
                            style={{ width: 'auto' }}
                            disabled={!tripValidation.isOk || vehicles.filter(v => v.status === 'Available').length === 0 || drivers.filter(d => d.status === 'Available' && !isLicenseExpired(d.exp)).length === 0}
                            onClick={createAndDispatch}>
                      Create &amp; Dispatch
                    </button>
                    <button className="btn btn-ghost" onClick={createDraft}>Save as Draft</button>
                  </div>
                </div>

                <div className="card">
                  <h3>Live Board</h3>
                  <div id="liveBoard">
                    {trips.map((t, idx) => (
                      <div key={t.id} className="board-item">
                        <div className="top-row">
                          <span className="tripid">{t.id}</span>
                          {getPill(t.status)}
                        </div>
                        <div className="route">{t.source} → {t.dest}</div>
                        <div className="meta">
                          <span>{t.vehicle ? `${t.vehicle} / ${t.driver}` : 'Unassigned'}</span>
                          <span>{t.eta}</span>
                        </div>
                        {t.status === 'Dispatched' && (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <button className="btn btn-sm btn-ghost" onClick={() => completeTrip(idx)}>Complete</button>
                            <button className="btn btn-sm btn-danger" onClick={() => cancelTrip(idx)}>Cancel</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ===== MAINTENANCE ===== */}
          {activeView === 'maintenance' && (
            <section className="view" id="page-maintenance" style={{ display: 'block' }}>
              <div className="page-head">
                <div><span className="eyebrow">Vehicle Lifecycle</span><h1>Maintenance</h1></div>
              </div>
              <div className="grid-2">
                <div className="card">
                  <h3>Log Service Record</h3>
                  <div className="field">
                    <label>Vehicle</label>
                    <select value={mVehicle} onChange={(e) => setMVehicle(e.target.value)}>
                      {vehicles.filter(v => v.status !== 'In Shop' && v.status !== 'Retired').map(v => (
                        <option key={v.name} value={v.name}>{v.name}</option>
                      ))}
                      {vehicles.filter(v => v.status !== 'In Shop' && v.status !== 'Retired').length === 0 && (
                        <option value="">No eligible vehicles</option>
                      )}
                    </select>
                  </div>
                  <div className="field"><label>Service Type</label><input placeholder="Oil Change" value={mType} onChange={(e) => setMType(e.target.value)} /></div>
                  <div className="field"><label>Cost (₹)</label><input type="number" placeholder="2500" value={mCost} onChange={(e) => setMCost(e.target.value)} /></div>
                  <div className="field"><label>Date</label><input type="date" value={mDate} onChange={(e) => setMDate(e.target.value)} /></div>
                  <button className="btn btn-primary" style={{ width: 'auto' }} onClick={saveMaintenance}>
                    Save &amp; put vehicle In Shop
                  </button>
                  <div className="rule-note">Available → In Shop on save · Completing a record restores the vehicle to Available (unless Retired) · In Shop vehicles are removed from the dispatch pool.</div>
                </div>

                <div className="card">
                  <h3>Service Log</h3>
                  <table>
                    <thead>
                      <tr><th>Vehicle</th><th>Service</th><th>Cost</th><th>Status</th><th></th></tr>
                    </thead>
                    <tbody>
                      {maint.map((m, idx) => (
                        <tr key={idx}>
                          <td className="mono">{m.vehicle}</td>
                          <td>{m.service}</td>
                          <td className="mono">{fmtMoney(m.cost)}</td>
                          <td>{getPill(m.status)}</td>
                          <td>
                            {m.status === 'In Shop' && (
                              <button className="btn btn-sm btn-ghost" onClick={() => closeMaintenance(idx)}>Close</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ===== FUEL & EXPENSES ===== */}
          {activeView === 'fuel' && (
            <section className="view" id="page-fuel" style={{ display: 'block' }}>
              <div className="page-head">
                <div><span className="eyebrow">Cost Tracking</span><h1>Fuel &amp; Expense Management</h1></div>
              </div>
              <div className="card" style={{ marginBottom: '18px' }}>
                <h3>Fuel Logs</h3>
                <div className="form-grid" style={{ marginBottom: '14px' }}>
                  <div className="field">
                    <label>Vehicle</label>
                    <select value={ffVehicle} onChange={(e) => setFfVehicle(e.target.value)}>
                      {vehicles.map(v => (
                        <option key={v.name} value={v.name}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field"><label>Date</label><input type="date" value={ffDate} onChange={(e) => setFfDate(e.target.value)} /></div>
                  <div className="field"><label>Liters</label><input type="number" placeholder="42" value={ffLiters} onChange={(e) => setFfLiters(e.target.value)} /></div>
                  <div className="field"><label>Cost (₹)</label><input type="number" placeholder="3150" value={ffCost} onChange={(e) => setFfCost(e.target.value)} /></div>
                </div>
                <button className="btn btn-primary" style={{ width: 'auto', marginBottom: '16px' }} onClick={saveFuel}>+ Log Fuel</button>

                <table>
                  <thead>
                    <tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Fuel Cost</th></tr>
                  </thead>
                  <tbody>
                    {fuel.map((f, i) => (
                      <tr key={i}>
                        <td className="mono">{f.vehicle}</td>
                        <td className="mono">{f.date}</td>
                        <td className="mono">{f.liters} L</td>
                        <td className="mono">{fmtMoney(f.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="card">
                <h3>Other Expenses (Toll / Misc.)</h3>
                <table>
                  <thead>
                    <tr><th>Trip</th><th>Vehicle</th><th>Toll</th><th>Other</th><th>Maint. (linked)</th><th>Total</th></tr>
                  </thead>
                  <tbody>
                    {expenses.map((e, idx) => (
                      <tr key={idx}>
                        <td className="mono">{e.trip}</td>
                        <td className="mono">{e.vehicle}</td>
                        <td className="mono">{fmtMoney(e.toll)}</td>
                        <td className="mono">{fmtMoney(e.other)}</td>
                        <td className="mono">{fmtMoney(e.maint)}</td>
                        <td className="mono">{fmtMoney(e.toll + e.other + e.maint)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINTENANCE</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '19px', color: 'var(--amber)', fontWeight: 600 }}>
                    {fmtMoney(
                      fuel.reduce((sum, f) => sum + f.cost, 0) + maint.reduce((sum, m) => sum + m.cost, 0)
                    )}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ===== ANALYTICS ===== */}
          {activeView === 'analytics' && (
            <section className="view" id="page-analytics" style={{ display: 'block' }}>
              <div className="page-head">
                <div><span className="eyebrow">Reports</span><h1>Reports &amp; Analytics</h1></div>
                <button className="btn btn-ghost btn-sm" onClick={exportCSV}>⤓ Export CSV</button>
              </div>

              <div className="kpi-row">
                <div className="kpi-card acc-blue">
                  <div className="kpi-label">Fuel Efficiency</div>
                  <div className="kpi-value">
                    {(trips.reduce((sum, t) => sum + (t.dist || 0), 0) / (fuel.reduce((sum, f) => sum + f.liters, 0) || 1)).toFixed(1)} km/l
                  </div>
                </div>
                <div className="kpi-card acc-green">
                  <div className="kpi-label">Fleet Utilization</div>
                  <div className="kpi-value">{Math.min(fleetUtilization, 99)}%</div>
                </div>
                <div className="kpi-card acc-amber">
                  <div className="kpi-label">Operational Cost</div>
                  <div className="kpi-value">
                    {fmtMoney(
                      fuel.reduce((sum, f) => sum + f.cost, 0) + maint.reduce((sum, m) => sum + m.cost, 0)
                    )}
                  </div>
                </div>
                <div className="kpi-card acc-green">
                  <div className="kpi-label">Vehicle ROI (est.)</div>
                  <div className="kpi-value">14.2%</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <h3>Monthly Revenue</h3>
                  <div className="chart-bars">
                    {[58, 71, 52, 84, 68, 92, 80].map((r, i) => {
                      const maxVal = Math.max(58, 71, 52, 84, 68, 92, 80);
                      const pct = (r / maxVal) * 100;
                      return (
                        <div key={i} className="cb" style={{ height: `${pct}%` }}>
                          <span>W{i + 1}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="card">
                  <h3>Top Costliest Vehicles</h3>
                  <div className="status-bars">
                    {(() => {
                      const byVeh = {};
                      maint.forEach(m => byVeh[m.vehicle] = (byVeh[m.vehicle] || 0) + m.cost);
                      fuel.forEach(f => byVeh[f.vehicle] = (byVeh[f.vehicle] || 0) + f.cost);
                      const entries = Object.entries(byVeh).sort((a, b) => b[1] - a[1]).slice(0, 3);
                      const topMax = entries.length ? entries[0][1] : 1;
                      const barColors = ['var(--red)', 'var(--amber)', 'var(--blue)'];

                      return entries.map(([name, val], i) => (
                        <div key={name} className="brow">
                          <span>{name}</span>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${(val / topMax * 100)}%`, backgroundColor: barColors[i] || 'var(--blue)' }}></div>
                          </div>
                          <span className="n" style={{ width: '70px' }}>{fmtMoney(val)}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ===== SETTINGS ===== */}
          {activeView === 'settings' && (
            <section className="view" id="page-settings" style={{ display: 'block' }}>
              <div className="page-head">
                <div><span className="eyebrow">Configuration</span><h1>Settings &amp; RBAC</h1></div>
              </div>
              <div className="grid-2">
                <div className="card">
                  <h3>General</h3>
                  <div className="field">
                    <label>Depot</label>
                    <input value={settingsDepot} onChange={(e) => setSettingsDepot(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Currency</label>
                    <input value={settingsCurrency} onChange={(e) => setSettingsCurrency(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Distance Unit</label>
                    <input value={settingsDistance} onChange={(e) => setSettingsDistance(e.target.value)} />
                  </div>
                  <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => triggerToast('Settings saved')}>Save changes</button>
                </div>

                <div className="card">
                  <h3>Role-Based Access (RBAC)</h3>
                  <table className="rbac-table">
                    <thead>
                      <tr><th>Role</th><th>Fleet</th><th>Drivers</th><th>Trips</th><th>Fuel/Exp.</th><th>Analytics</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>Fleet Manager</td><td className="perm yes">✓</td><td className="perm yes">✓</td><td className="perm no">–</td><td className="perm no">–</td><td className="perm yes">✓</td></tr>
                      <tr><td>Dispatcher</td><td className="perm view">view</td><td className="perm no">–</td><td className="perm yes">✓</td><td className="perm no">–</td><td className="perm no">–</td></tr>
                      <tr><td>Safety Officer</td><td className="perm no">–</td><td className="perm yes">✓</td><td className="perm view">view</td><td className="perm no">–</td><td className="perm no">–</td></tr>
                      <tr><td>Financial Analyst</td><td className="perm view">view</td><td className="perm no">–</td><td className="perm no">–</td><td className="perm yes">✓</td><td className="perm yes">✓</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* TOAST SYSTEM */}
      <div className={`toast ${toast.show ? 'show' : ''} ${toast.isErr ? 'err' : ''}`} id="toast">
        <span className="dot"></span>
        <span>{toast.msg}</span>
      </div>
    </div>
  );
}

export default App;
