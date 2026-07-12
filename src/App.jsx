import { useState, useEffect } from 'react';
import './App.css';

// Import helpers
import { isLicenseExpired, fmtMoney, getPill } from './utils/helpers';
import { getStoredAuth, storeAuth, clearAuth, isValidEmail } from './utils/auth';
import api from './services/api';

// Import view components
import LoginView from './components/LoginView';
import AccessDenied from './components/AccessDenied';
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

const ROLE_VIEW_MAP = {
  Dashboard: 'dashboard',
  Fleet: 'fleet',
  Drivers: 'drivers',
  Trips: 'trips',
  Maintenance: 'maintenance',
  'Fuel/Exp.': 'fuel',
  Analytics: 'analytics',
};

const parseToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (err) {
    return null;
  }
};

function App() {
  // --- AUTH STATE ---
  const [auth, setAuth] = useState(() => {
    const stored = getStoredAuth();
    const payload = stored?.token ? parseToken(stored.token) : null;
    if (!stored || !payload || payload.exp * 1000 < Date.now()) {
      clearAuth();
      return null;
    }
    return stored;
  });
  const [role, setRole] = useState(auth?.user?.role || null);
  const [userName, setUserName] = useState(auth?.user?.name || '');
  const [loginEmail, setLoginEmail] = useState(auth?.user?.email || '');
  const [loginPass, setLoginPass] = useState('');
  const [loginRole, setLoginRole] = useState(auth?.user?.role || 'Dispatcher');
  const [rememberMe, setRememberMe] = useState(Boolean(auth));
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState(auth?.user?.email || '');
  const [forgotMessage, setForgotMessage] = useState('');

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
      if (!auth?.token) return;

      const [vRes, dRes, tRes, mRes, fRes, sRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/drivers'),
        api.get('/trips'),
        api.get('/maintenance'),
        api.get('/fuel'),
        api.get('/settings')
      ]);

      setVehicles(vRes.data || []);
      setDrivers(dRes.data || []);
      setTrips(tRes.data || []);
      setMaint(mRes.data || []);
      setFuel(fRes.data || []);

      const sData = sRes.data || {};
      setSettingsDepot(sData.depot || 'Gandhinagar Depot, GJ4');
      setSettingsCurrency(sData.currency || 'INR (₹)');
      setSettingsDistance(sData.distanceUnit || 'Kilometers');
    } catch (err) {
      if (auth?.token) {
        console.error('Failed to communicate with MongoDB backend API:', err);
        triggerToast('Failed to fetch data from backend', true);
      }
    }
  };

  // Fetch all collections on mount & whenever we successfully log in
  useEffect(() => {
    fetchAllData();
  }, [role, auth?.token]);

  useEffect(() => {
    if (!trips.length) return;
    const maxSeq = trips.reduce((maxVal, t) => {
      const parsed = Number(String(t.id || '').replace(/^TR/, ''));
      return Number.isFinite(parsed) ? Math.max(maxVal, parsed) : maxVal;
    }, 0);
    setTripSeq(maxSeq + 1);
  }, [trips]);

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
      const selected = vehicles.find(v => v._id === tVehicle);
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
        setTVehicle(availableVehicles[0]._id);
      }
      if (availableDrivers.length > 0 && !tDriver) {
        setTDriver(availableDrivers[0]._id);
      }
    }
  }, [activeView, vehicles, drivers]);

  // Sync maintenance form options
  useEffect(() => {
    if (activeView === 'maintenance') {
      const eligible = vehicles.filter(v => v.status !== 'In Shop' && v.status !== 'Retired');
      if (eligible.length > 0 && !mVehicle) {
        setMVehicle(eligible[0]._id);
      }
    }
  }, [activeView, vehicles]);

  // Sync fuel form options
  useEffect(() => {
    if (activeView === 'fuel' && vehicles.length > 0 && !ffVehicle) {
      setFfVehicle(vehicles[0]._id);
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
  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    setForgotMessage('');

    if (!forgotEmail) {
      setForgotMessage('Email is required to reset password.');
      return;
    }

    if (!isValidEmail(forgotEmail)) {
      setForgotMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotMessage(response.data.message || 'If that email exists, reset instructions are sent.');
    } catch (error) {
      setForgotMessage('Unable to send reset instructions. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const doLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    setForgotMessage('');

    if (forgotMode) {
      return handleForgotPassword(e);
    }

    if (!loginEmail || !loginPass) {
      setLoginError('Email and password are required.');
      return;
    }

    if (!isValidEmail(loginEmail)) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    if (loginPass.length < 8) {
      setLoginError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: loginEmail,
        password: loginPass,
      });

      const data = response.data;
      if (!data.success) {
        setLoginError(data.message || 'Invalid credentials.');
        return;
      }

      const tokenPayload = parseToken(data.token);
      const authData = {
        token: data.token,
        user: data.user,
        expiresAt: tokenPayload?.exp ? tokenPayload.exp * 1000 : Date.now() + 2 * 60 * 60 * 1000,
      };

      storeAuth(authData, rememberMe);
      setAuth(authData);
      setRole(data.user.role);
      setUserName(data.user.name);
      setLoginRole(data.user.role);
      setForgotMode(false);
      setLoginError('');
      triggerToast(`Welcome back, ${data.user.name}!`);

      const allowed = ROLE_ACCESS[data.user.role];
      setActiveView(ROLE_VIEW_MAP[allowed?.[0]] || 'dashboard');
    } catch (error) {
      setLoginError(
        error?.response?.data?.message ||
        'Unable to login. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    setAuth(null);
    setRole(null);
    setUserName('');
    setLoginEmail('');
    setLoginPass('');
    setLoginRole('Dispatcher');
    setRememberMe(false);
    setActiveView('dashboard');
    triggerToast('Signed out successfully');
  };

  const checkAccess = (perm) => {
    if (!role) return false;
    if (perm === '__settings') {
      return role === 'Fleet Manager';
    }
    return ROLE_ACCESS[role]?.includes(perm);
  };

  const handleNavClick = (item) => {
    const permission = item.name === 'Settings & RBAC' ? '__settings' : item.name;

    if (!checkAccess(permission)) {
      setActiveView('access-denied');
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
      await api.post('/vehicles', { reg, name, type: nvType, cap, odo, cost, status: 'Available' });
      await fetchAllData();
      setNvReg('');
      setNvName('');
      setNvCap('');
      setNvOdo('');
      setNvCost('');
      setShowAddVehicle(false);
      setVehValidation({ show: false, isOk: false, msg: '' });
      triggerToast('Vehicle registered');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
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
      await api.post('/drivers', { name, lic, cat: ndCat, exp, contact, trips: 0, safety: score, status: 'Available' });
      await fetchAllData();
      setNdName('');
      setNdLic('');
      setNdExp('');
      setNdContact('');
      setNdScore('');
      setShowAddDriver(false);
      triggerToast('Driver added');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
    }
  };

  const setDriverStatus = async (driverId, value) => {
    try {
      await api.put(`/drivers/${driverId}/status`, { status: value });
      await fetchAllData();
      triggerToast('Driver status updated');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
    }
  };

  // Trips: Dispatch
  const createAndDispatch = async () => {
    const selectedVeh = vehicles.find(v => v._id === tVehicle);
    const selectedDrv = drivers.find(d => d._id === tDriver);

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
      await api.post('/trips', {
        id,
        source: tSource || 'Depot',
        dest: tDest || 'Hub',
        vehicle: selectedVeh._id,
        driver: selectedDrv._id,
        cargo: Number(tCargo) || 0,
        dist: Number(tDist) || 0,
        status: 'Dispatched',
        eta: Math.round(Number(tDist) * 1.3) + ' min'
      });

      await fetchAllData();
      triggerToast('Trip dispatched — vehicle & driver set to On Trip');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
    }
  };

  // Trips: Save Draft
  const createDraft = async () => {
    const id = 'TR' + String(tripSeq).padStart(3, '0');
    setTripSeq(tripSeq + 1);

    try {
      await api.post('/trips', {
        id,
        source: tSource || 'Depot',
        dest: tDest || 'Hub',
        vehicle: null,
        driver: null,
        cargo: Number(tCargo) || 0,
        dist: Number(tDist) || 0,
        status: 'Draft',
        eta: 'Awaiting vehicle'
      });

      await fetchAllData();
      triggerToast('Trip saved as draft');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
    }
  };

  // Trips: Actions
  const completeTrip = async (tripId) => {
    try {
      await api.put(`/trips/${tripId}/action`, { action: 'Complete' });
      await fetchAllData();
      triggerToast('Trip completed — vehicle & driver back to Available');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
    }
  };

  const cancelTrip = async (tripId) => {
    try {
      await api.put(`/trips/${tripId}/action`, { action: 'Cancel' });
      await fetchAllData();
      triggerToast('Trip cancelled — vehicle & driver restored to Available');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
    }
  };

  // Maintenance: Save Record
  const saveMaintenance = async () => {
    if (!mVehicle) {
      triggerToast('No eligible vehicle selected', true);
      return;
    }

    const vehObj = vehicles.find(v => v._id === mVehicle);
    if (!vehObj) return;

    const service = mType.trim() || 'General Service';
    const cost = Number(mCost) || 0;

    try {
      await api.post('/maintenance', { vehicle: vehObj._id, service, cost, date: mDate, status: 'In Shop' });
      await fetchAllData();
      setMType('');
      setMCost('');
      triggerToast(`${vehObj.name} moved to In Shop`);
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
    }
  };

  const closeMaintenance = async (recordId) => {
    try {
      await api.put(`/maintenance/${recordId}/close`);
      await fetchAllData();
      triggerToast('Maintenance closed — vehicle back to Available');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
    }
  };

  // Fuel: Save Record
  const saveFuel = async () => {
    if (!ffVehicle || !ffLiters) {
      triggerToast('Vehicle and liters are required', true);
      return;
    }

    const vehObj = vehicles.find(v => v._id === ffVehicle);
    if (!vehObj) return;

    const liters = Number(ffLiters) || 0;
    const cost = Number(ffCost) || 0;

    try {
      await api.post('/fuel', { vehicle: vehObj._id, date: ffDate, liters, cost });
      await fetchAllData();
      setFfLiters('');
      setFfCost('');
      triggerToast('Fuel log added');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Database connection failed', true);
    }
  };

  // Settings: Cloud Sync save
  const saveSettings = async () => {
    try {
      await api.put('/settings', { depot: settingsDepot, currency: settingsCurrency, distanceUnit: settingsDistance });
      triggerToast('Settings saved successfully');
    } catch (err) {
      triggerToast(err?.response?.data?.error || 'Failed to save settings', true);
    }
  };

  // Analytics
  const exportCSV = () => {
    const header = ['Trip ID', 'Vehicle', 'Driver', 'Status', 'Distance KM', 'Fuel Liters', 'Fuel Cost', 'Maintenance Cost'];

    const rows = trips.map((trip) => {
      const tripVehicleId = trip.vehicle?._id || trip.vehicle;
      const fuelForVehicle = fuel
        .filter((f) => {
          const fuelVehicleId = f.vehicle?._id || f.vehicle;
          return fuelVehicleId === tripVehicleId;
        })
        .reduce(
          (acc, cur) => ({ liters: acc.liters + Number(cur.liters || 0), cost: acc.cost + Number(cur.cost || 0) }),
          { liters: 0, cost: 0 }
        );

      const maintCost = maint
        .filter((m) => {
          const maintVehicleId = m.vehicle?._id || m.vehicle;
          return maintVehicleId === tripVehicleId;
        })
        .reduce((sum, m) => sum + Number(m.cost || 0), 0);

      return [
        trip.id,
        trip.vehicle?.name || '—',
        trip.driver?.name || '—',
        trip.status,
        Number(trip.dist || 0),
        fuelForVehicle.liters,
        fuelForVehicle.cost,
        maintCost
      ];
    });

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transitops-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    triggerToast('CSV exported successfully');
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
    const source = userName || loginEmail;
    if (!source) return 'TO';
    const segments = source.split(/[@.\s]+/).filter(Boolean);
    return segments.map(s => s[0]).join('').toUpperCase().slice(0, 2) || 'TO';
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
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loading}
        forgotMode={forgotMode}
        setForgotMode={setForgotMode}
        forgotEmail={forgotEmail}
        setForgotEmail={setForgotEmail}
        forgotMessage={forgotMessage}
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
          userName={userName}
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

          {activeView === 'access-denied' && (
            <AccessDenied role={role} onReturn={() => setActiveView('dashboard')} />
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
