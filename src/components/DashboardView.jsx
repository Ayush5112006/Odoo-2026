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
    <section className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-on-surface-variant uppercase">Live Overview</span>
          <h1 className="font-headline-md text-headline-md text-primary">Dashboard</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={fVehType}
            onChange={(e) => setFVehType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
          >
            <option>Vehicle Type: All</option>
            <option>Van</option>
            <option>Truck</option>
            <option>Mini Truck</option>
          </select>
          <select
            value={fStatus}
            onChange={(e) => setFStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
          >
            <option>Status: All</option>
            <option>Available</option>
            <option>On Trip</option>
            <option>In Shop</option>
            <option>Retired</option>
          </select>
          <select
            value={fRegion}
            onChange={(e) => setFRegion(e.target.value)}
            className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
          >
            <option>Region: All</option>
            {regionOptions.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: 'Active Vehicles', val: activeVehCount, border: 'border-l-4 border-l-primary' },
          { label: 'Available', val: availVehCount, border: 'border-l-4 border-l-secondary' },
          { label: 'In Shop', val: inShopVehCount, border: 'border-l-4 border-l-error' },
          { label: 'Active Trips', val: activeTripsCount, border: 'border-l-4 border-l-tertiary-fixed-variant' },
          { label: 'Pending Trips', val: String(pendingTripsCount).padStart(2, '0'), border: 'border-l-4 border-l-secondary-fixed' },
          { label: 'Drivers Duty', val: driversOnDuty, border: 'border-l-4 border-l-primary-fixed-dim' },
          { label: 'Utilization', val: `${Math.min(fleetUtilization, 99)}%`, border: 'border-l-4 border-l-tertiary-fixed' },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col justify-between ${kpi.border}`}
          >
            <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider leading-tight">
              {kpi.label}
            </div>
            <div className="font-display-lg text-[28px] leading-none text-primary mt-2 font-bold tabular-nums">
              {kpi.val}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Recent Trips & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Recent Trips
              <span className="ml-2.5 px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-mono text-[10px] uppercase font-bold tracking-wide">
                live board
              </span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                  <th className="px-4 py-3 rounded-l-lg">Trip ID</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Driver</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-lg">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {trips.slice(0, 6).map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-primary">{t.id}</td>
                    <td className="px-4 py-3.5 font-mono text-body-md text-on-surface">{t.vehicle?.name || '—'}</td>
                    <td className="px-4 py-3.5 text-body-md text-on-surface">{t.driver?.name || '—'}</td>
                    <td className="px-4 py-3.5">{getPill(t.status)}</td>
                    <td className="px-4 py-3.5 font-mono text-body-md text-on-surface-variant">{t.eta}</td>
                  </tr>
                ))}
                {trips.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center text-on-surface-variant text-body-md">
                      No recent trips recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-5">Vehicle Status Breakdown</h3>
          <div className="space-y-4">
            {['Available', 'On Trip', 'In Shop', 'Retired'].map((statusName) => {
              const count = vehicles.filter((v) => v.status === statusName).length;
              const ratio = (count / (vehicles.length || 1)) * 100;
              const barColors = {
                Available: 'bg-secondary-container',
                'On Trip': 'bg-tertiary-container',
                'In Shop': 'bg-error-container border border-error/10',
                Retired: 'bg-surface-container-highest',
              };
              const textColors = {
                Available: 'text-on-secondary-container font-semibold',
                'On Trip': 'text-on-tertiary-container font-semibold',
                'In Shop': 'text-on-error-container font-semibold',
                Retired: 'text-on-surface-variant',
              };
              return (
                <div key={statusName} className="flex items-center gap-4">
                  <span className="w-24 text-body-md font-medium text-on-surface-variant">{statusName}</span>
                  <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColors[statusName] || 'bg-outline-variant'}`}
                      style={{ width: `${ratio}%` }}
                    ></div>
                  </div>
                  <span className={`w-8 text-right font-mono text-body-md ${textColors[statusName] || 'text-on-surface'}`}>
                    {count}
                  </span>
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
