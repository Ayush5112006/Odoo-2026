import { useState, useEffect } from 'react';
import './App.css';

// Import helpers
import { isLicenseExpired, fmtMoney, getPill } from './utils/helpers';

// Import view components
import LoginView from './components/LoginView';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardView from './components/DashboardView';
import FleetView from './components/FleetView';
import DriversView from './components/DriversView';
import TripsView from './components/TripsView';
import MaintenanceView from './components/MaintenanceView';
import FuelView from './components/FuelView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';

const ROLE_ACCESS = {
  'Fleet Manager': ['Dashboard', 'Fleet', 'Maintenance', 'Analytics'],
  'Dispatcher': ['Dashboard', 'Trips'],
  'Safety Officer': ['Drivers', 'Trips'],
  'Financial Analyst': ['Fuel/Exp.', 'Analytics'],
};

const API_BASE = 'http://localhost:5000/api';

function App() {
  // --- AUTH STATE ---
  const [role, setRole] = useState(null);
  const [loginEmail, setLoginEmail] = useState('raven.k@transitops.in');
  const [loginPass, setLoginPass] = useState('password');
  const [loginRole, setLoginRole] = useState('Dispatcher');
  const [loginError, setLoginError] = useState(false);

  // --- APP LEVEL GLOBAL STATES ---
  const [activeView, setActiveView] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [toast, setToast] = useState({ show: false, msg: '', isErr: false });

  // --- DATABASE STATE ---
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maint, setMaint] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [expenses, setExpenses] = useState([]);

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

  // --- API DATA FETCHING ---
  const fetchAllData = async () => {
    try {
      const vRes = await fetch(`${API_BASE}/vehicles`);
      if (vRes.ok) setVehicles(await vRes.json());

      const dRes = await fetch(`${API_BASE}/drivers`);
      if (dRes.ok) setDrivers(await dRes.json());

      const tRes = await fetch(`${API_BASE}/trips`);
      if (tRes.ok) setTrips(await tRes.json());

      const mRes = await fetch(`${API_BASE}/maintenance`);
      if (mRes.ok) setMaint(await mRes.json());

      const fRes = await fetch(`${API_BASE}/fuel`);
      if (fRes.ok) setFuel(await fRes.json());

      const sRes = await fetch(`${API_BASE}/settings`);
      if (sRes.ok) {
        const sData = await sRes.json();
        setSettingsDepot(sData.depot);
        setSettingsCurrency(sData.currency);
        setSettingsDistance(sData.distanceUnit);
      }
    } catch (err) {
      console.error('Failed to communicate with MongoDB backend API:', err);
    }
  };

  // Fetch all collections on mount & whenever we successfully log in
  useEffect(() => {
    fetchAllData();
  }, [role]);

  // Compute expenses table dynamically based on trip status & maintenance costs
  useEffect(() => {
    if (trips.length > 0) {
      const updatedExpenses = trips
        .filter(t => t.status === 'Completed' || t.status === 'Dispatched')
        .map(t => {
          const vehId = t.vehicle?._id || t.vehicle;
          const vehName = t.vehicle?.name || '—';
          const vehMaint = maint
            .filter(m => {
              const maintVehId = m.vehicle?._id || m.vehicle;
              return maintVehId === vehId && m.status === 'Completed';
            })
            .reduce((sum, m) => sum + m.cost, 0);
          return {
            trip: t.id,
            vehicle: vehName,
            toll: t.dist > 50 ? 340 : 120,
            other: t.dist > 50 ? 150 : 0,
            maint: vehMaint
          };
        });
      setExpenses(updatedExpenses);
    }
  }, [trips, maint]);

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

  // --- ACTIONS ---
  const doLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginEmail || !loginPass) {
      setLoginError(true);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });
      if (res.ok) {
        const data = await res.json();
        setLoginError(false);
        setRole(data.role);
        triggerToast(`Logged in as ${data.role}`);

        // Navigate to first allowed view
        const allowed = ROLE_ACCESS[data.role];
        if (allowed && allowed.length > 0) {
          const target = allowed[0].toLowerCase().replace('/exp.', '').replace('fuel', 'fuel');
          setActiveView(target);
        } else {
          setActiveView('dashboard');
        }
      } else {
        setLoginError(true);
      }
    } catch (err) {
      triggerToast('Database authentication failed', true);
    }
  };

  const logout = () => {
    setRole(null);
    setLoginEmail('raven.k@transitops.in');
    setLoginPass('password');
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
  const saveVehicle = async () => {
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

    try {
      const res = await fetch(`${API_BASE}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reg, name, type: nvType, cap, odo, cost, status: 'Available' })
      });
      if (res.ok) {
        await fetchAllData();
        setNvReg('');
        setNvName('');
        setNvCap('');
        setNvOdo('');
        setNvCost('');
        setShowAddVehicle(false);
        setVehValidation({ show: false, isOk: false, msg: '' });
        triggerToast('Vehicle registered');
      } else {
        const errData = await res.json();
        triggerToast(errData.error || 'Failed to register vehicle', true);
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  // Drivers: Register Driver
  const saveDriver = async () => {
    const name = ndName.trim();
    const lic = ndLic.trim();
    const exp = ndExp.trim();
    const contact = ndContact.trim();
    const score = Number(ndScore) || 90;

    if (!name || !lic || !exp) {
      triggerToast('Name, license number, and expiry are required', true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lic, cat: ndCat, exp, contact, trips: 0, safety: score, status: 'Available' })
      });
      if (res.ok) {
        await fetchAllData();
        setNdName('');
        setNdLic('');
        setNdExp('');
        setNdContact('');
        setNdScore('');
        setShowAddDriver(false);
        triggerToast('Driver added');
      } else {
        const errData = await res.json();
        triggerToast(errData.error || 'Failed to add driver', true);
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  const setDriverStatus = async (index, value) => {
    try {
      const res = await fetch(`${API_BASE}/drivers/${index}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value })
      });
      if (res.ok) {
        await fetchAllData();
        triggerToast('Driver status updated');
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  // Trips: Dispatch
  const createAndDispatch = async () => {
    const selectedVeh = vehicles.find(v => v.name === tVehicle);
    const selectedDrv = drivers.find(d => d.name === tDriver);

    if (!selectedVeh || !selectedDrv) {
      triggerToast('Select a vehicle and driver', true);
      return;
    }

    if (Number(tCargo) > selectedVeh.cap) {
      triggerToast('Fix validation errors before dispatch', true);
      return;
    }

    const id = 'TR' + String(tripSeq).padStart(3, '0');
    setTripSeq(tripSeq + 1);

    try {
      const res = await fetch(`${API_BASE}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          source: tSource || 'Depot',
          dest: tDest || 'Hub',
          vehicle: selectedVeh._id, // Send normalized ObjectId
          driver: selectedDrv._id,   // Send normalized ObjectId
          cargo: Number(tCargo) || 0,
          dist: Number(tDist) || 0,
          status: 'Dispatched',
          eta: Math.round(Number(tDist) * 1.3) + ' min'
        })
      });
      if (res.ok) {
        await fetchAllData();
        triggerToast('Trip dispatched — vehicle & driver set to On Trip');
      } else {
        const errData = await res.json();
        triggerToast(errData.error || 'Dispatch failed', true);
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  // Trips: Save Draft
  const createDraft = async () => {
    const id = 'TR' + String(tripSeq).padStart(3, '0');
    setTripSeq(tripSeq + 1);

    try {
      const res = await fetch(`${API_BASE}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          source: tSource || 'Depot',
          dest: tDest || 'Hub',
          vehicle: null,
          driver: null,
          cargo: Number(tCargo) || 0,
          dist: Number(tDist) || 0,
          status: 'Draft',
          eta: 'Awaiting vehicle'
        })
      });
      if (res.ok) {
        await fetchAllData();
        triggerToast('Trip saved as draft');
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  // Trips: Actions
  const completeTrip = async (index) => {
    try {
      const res = await fetch(`${API_BASE}/trips/${index}/action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Complete' })
      });
      if (res.ok) {
        await fetchAllData();
        triggerToast('Trip completed — vehicle & driver back to Available');
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  const cancelTrip = async (index) => {
    try {
      const res = await fetch(`${API_BASE}/trips/${index}/action`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Cancel' })
      });
      if (res.ok) {
        await fetchAllData();
        triggerToast('Trip cancelled — vehicle & driver restored to Available');
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  // Maintenance: Save Record
  const saveMaintenance = async () => {
    if (!mVehicle) {
      triggerToast('No eligible vehicle selected', true);
      return;
    }

    const vehObj = vehicles.find(v => v.name === mVehicle);
    if (!vehObj) return;

    const service = mType.trim() || 'General Service';
    const cost = Number(mCost) || 0;

    try {
      const res = await fetch(`${API_BASE}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle: vehObj._id, service, cost, date: mDate, status: 'In Shop' }) // Send normalized ObjectId
      });
      if (res.ok) {
        await fetchAllData();
        setMType('');
        setMCost('');
        triggerToast(`${mVehicle} moved to In Shop`);
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  const closeMaintenance = async (index) => {
    try {
      const res = await fetch(`${API_BASE}/maintenance/${index}/close`, {
        method: 'PUT'
      });
      if (res.ok) {
        await fetchAllData();
        triggerToast('Maintenance closed — vehicle back to Available');
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  // Fuel: Save Record
  const saveFuel = async () => {
    if (!ffVehicle || !ffLiters) {
      triggerToast('Vehicle and liters are required', true);
      return;
    }

    const vehObj = vehicles.find(v => v.name === ffVehicle);
    if (!vehObj) return;

    const liters = Number(ffLiters) || 0;
    const cost = Number(ffCost) || 0;

    try {
      const res = await fetch(`${API_BASE}/fuel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle: vehObj._id, date: ffDate, liters, cost }) // Send normalized ObjectId
      });
      if (res.ok) {
        await fetchAllData();
        setFfLiters('');
        setFfCost('');
        triggerToast('Fuel log added');
      }
    } catch (err) {
      triggerToast('Database connection failed', true);
    }
  };

  // Settings: Cloud Sync save
  const saveSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depot: settingsDepot, currency: settingsCurrency, distanceUnit: settingsDistance })
      });
      if (res.ok) {
        triggerToast('Settings saved successfully');
      }
    } catch (err) {
      triggerToast('Failed to save settings', true);
    }
  };

  // Analytics
  const exportCSV = () => {
    triggerToast('CSV export generated (demo)');
  };

  // --- DYNAMIC CALCULATIONS ---
  const activeVehCount = vehicles.filter(x => x.status !== 'Retired').length;
  const availVehCount = vehicles.filter(x => x.status === 'Available').length;
  const inShopVehCount = vehicles.filter(x => x.status === 'In Shop').length;
  const activeTripsCount = trips.filter(t => t.status === 'Dispatched').length;
  const pendingTripsCount = trips.filter(t => t.status === 'Draft').length;
  const driversOnDuty = drivers.filter(d => d.status !== 'Off Duty' && d.status !== 'Suspended').length;
  const onTripCount = vehicles.filter(x => x.status === 'On Trip').length;
  const fleetUtilization = Math.round((onTripCount / (vehicles.length || 1)) * 100 + 60);

  // Extract avatar initials
  const getAvatarInitials = () => {
    if (!loginEmail) return 'RK';
    const splitEmail = loginEmail.split('@')[0].split('.');
    return splitEmail.map(s => s[0]).join('').toUpperCase().slice(0, 2) || 'RK';
  };

  // --- RENDER LOGIN VIEW ---
  if (!role) {
    return (
      <LoginView
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPass={loginPass}
        setLoginPass={setLoginPass}
        loginRole={loginRole}
        setLoginRole={setLoginRole}
        loginError={loginError}
        doLogin={doLogin}
      />
    );
  }

  // --- RENDER MAIN LAYOUT SHELL ---
  return (
    <div id="app" className="active">
      <Sidebar
        role={role}
        activeView={activeView}
        handleNavClick={handleNavClick}
        logout={logout}
        checkAccess={checkAccess}
      />

      <div className="main">
        <Topbar
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          role={role}
          getAvatarInitials={getAvatarInitials}
        />

        <div className="content">
          {activeView === 'dashboard' && (
            <DashboardView
              vehicles={vehicles}
              trips={trips}
              drivers={drivers}
              fVehType={fVehType}
              setFVehType={setFVehType}
              fStatus={fStatus}
              setFStatus={setFStatus}
              fRegion={fRegion}
              setFRegion={setFRegion}
              activeVehCount={activeVehCount}
              availVehCount={availVehCount}
              inShopVehCount={inShopVehCount}
              activeTripsCount={activeTripsCount}
              pendingTripsCount={pendingTripsCount}
              driversOnDuty={driversOnDuty}
              fleetUtilization={fleetUtilization}
              getPill={getPill}
            />
          )}

          {activeView === 'fleet' && (
            <FleetView
              vehicles={vehicles}
              showAddVehicle={showAddVehicle}
              setShowAddVehicle={setShowAddVehicle}
              nvReg={nvReg}
              setNvReg={setNvReg}
              nvName={nvName}
              setNvName={setNvName}
              nvType={nvType}
              setNvType={setNvType}
              nvCap={nvCap}
              setNvCap={setNvCap}
              nvOdo={nvOdo}
              setNvOdo={setNvOdo}
              nvCost={nvCost}
              setNvCost={setNvCost}
              vfType={vfType}
              setVfType={setVfType}
              vfStatus={vfStatus}
              setVfStatus={setVfStatus}
              vfReg={vfReg}
              setVfReg={setVfReg}
              vehValidation={vehValidation}
              setVehValidation={setVehValidation}
              saveVehicle={saveVehicle}
              fmtMoney={fmtMoney}
              getPill={getPill}
            />
          )}

          {activeView === 'drivers' && (
            <DriversView
              drivers={drivers}
              showAddDriver={showAddDriver}
              setShowAddDriver={setShowAddDriver}
              ndName={ndName}
              setNdName={setNdName}
              ndLic={ndLic}
              setNdLic={setNdLic}
              ndCat={ndCat}
              setNdCat={setNdCat}
              ndExp={ndExp}
              setNdExp={setNdExp}
              ndContact={ndContact}
              setNdContact={setNdContact}
              ndScore={ndScore}
              setNdScore={setNdScore}
              saveDriver={saveDriver}
              setDriverStatus={setDriverStatus}
              isLicenseExpired={isLicenseExpired}
              getPill={getPill}
            />
          )}

          {activeView === 'trips' && (
            <TripsView
              vehicles={vehicles}
              drivers={drivers}
              trips={trips}
              tSource={tSource}
              setTSource={setTSource}
              tDest={tDest}
              setTDest={setTDest}
              tVehicle={tVehicle}
              setTVehicle={setTVehicle}
              tDriver={tDriver}
              setTDriver={setTDriver}
              tCargo={tCargo}
              setTCargo={setTCargo}
              tDist={tDist}
              setTDist={setTDist}
              tripValidation={tripValidation}
              createAndDispatch={createAndDispatch}
              createDraft={createDraft}
              completeTrip={completeTrip}
              cancelTrip={cancelTrip}
              isLicenseExpired={isLicenseExpired}
              getPill={getPill}
            />
          )}

          {activeView === 'maintenance' && (
            <MaintenanceView
              vehicles={vehicles}
              maint={maint}
              mVehicle={mVehicle}
              setMVehicle={setMVehicle}
              mType={mType}
              setMType={setMType}
              mCost={mCost}
              setMCost={setMCost}
              mDate={mDate}
              setMDate={setMDate}
              saveMaintenance={saveMaintenance}
              closeMaintenance={closeMaintenance}
              fmtMoney={fmtMoney}
              getPill={getPill}
            />
          )}

          {activeView === 'fuel' && (
            <FuelView
              vehicles={vehicles}
              fuel={fuel}
              expenses={expenses}
              maint={maint}
              ffVehicle={ffVehicle}
              setFfVehicle={setFfVehicle}
              ffDate={ffDate}
              setFfDate={setFfDate}
              ffLiters={ffLiters}
              setFfLiters={setFfLiters}
              ffCost={ffCost}
              setFfCost={setFfCost}
              saveFuel={saveFuel}
              fmtMoney={fmtMoney}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView
              trips={trips}
              fuel={fuel}
              maint={maint}
              fleetUtilization={fleetUtilization}
              exportCSV={exportCSV}
              fmtMoney={fmtMoney}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              settingsDepot={settingsDepot}
              setSettingsDepot={setSettingsDepot}
              settingsCurrency={settingsCurrency}
              setSettingsCurrency={setSettingsCurrency}
              settingsDistance={settingsDistance}
              setSettingsDistance={setSettingsDistance}
              triggerToast={saveSettings} // Trigger saveSettings API
            />
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
