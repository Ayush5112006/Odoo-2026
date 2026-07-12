import React from 'react';

function DashboardView({
  vehicles,
  trips,
  fVehType,
  setFVehType,
  fStatus,
  setFStatus,
  fRegion,
  setFRegion,
  regionOptions,
  activeVehCount,
  availVehCount,
  inShopVehCount,
  activeTripsCount,
  pendingTripsCount,
  driversOnDuty,
  fleetUtilization,
  getPill
}) {
  return (
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
          {regionOptions.map((region) => (
            <option key={region}>{region}</option>
          ))}
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
                  <td className="mono">{t.vehicle?.name || '—'}</td>
                  <td>{t.driver?.name || '—'}</td>
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
  );
}

export default DashboardView;
