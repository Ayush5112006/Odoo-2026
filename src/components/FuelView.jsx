import React from 'react';

function FuelView({
  vehicles,
  fuel,
  expenses,
  maint,
  ffVehicle,
  setFfVehicle,
  ffDate,
  setFfDate,
  ffLiters,
  setFfLiters,
  ffCost,
  setFfCost,
  saveFuel,
  fmtMoney
}) {
  return (
    <section className="space-y-6">
      {/* Page Head */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-on-surface-variant uppercase">Cost Tracking</span>
          <h1 className="font-headline-md text-headline-md text-primary">Fuel &amp; Expense Management</h1>
        </div>
      </div>

      {/* Fuel Logs Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm space-y-4">
        <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-outline">local_gas_station</span>
          Fuel Logs
        </h3>

        {/* Add Log Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Vehicle</label>
            <select
              value={ffVehicle}
              onChange={(e) => setFfVehicle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
            >
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.name} ({v.reg})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Date</label>
            <input
              type="date"
              value={ffDate}
              onChange={(e) => setFfDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Liters</label>
            <input
              type="number"
              placeholder="42"
              value={ffLiters}
              onChange={(e) => setFfLiters(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Cost (₹)</label>
            <input
              type="number"
              placeholder="3150"
              value={ffCost}
              onChange={(e) => setFfCost(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
          </div>
        </div>

        <button
          onClick={saveFuel}
          className="bg-secondary-container text-on-secondary-container font-bold px-4 py-2 rounded-lg hover:shadow-md hover:brightness-105 transition-all text-body-md flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Log Fuel
        </button>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3 rounded-l-lg">Vehicle</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Liters</th>
                <th className="px-4 py-3 rounded-r-lg">Fuel Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {fuel.map((f, i) => (
                <tr key={i} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3.5 font-mono text-body-md text-primary font-semibold">{f.vehicle?.name || '—'}</td>
                  <td className="px-4 py-3.5 font-mono text-body-md text-on-surface-variant">{f.date}</td>
                  <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">{f.liters} L</td>
                  <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">{fmtMoney(f.cost)}</td>
                </tr>
              ))}
              {fuel.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-on-surface-variant text-body-md">
                    No fuel logs recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Cost summary Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm space-y-4">
        <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-outline">calculate</span>
          Operational Cost by Vehicle
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3 rounded-l-lg">Vehicle</th>
                <th className="px-4 py-3">Fuel Total</th>
                <th className="px-4 py-3">Maintenance Total</th>
                <th className="px-4 py-3 rounded-r-lg">Total Operational Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {expenses.map((e, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3.5 font-mono text-body-md text-primary font-semibold">{e.vehicle}</td>
                  <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">{fmtMoney(e.fuel)}</td>
                  <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">{fmtMoney(e.maintenance)}</td>
                  <td className="px-4 py-3.5 font-mono text-body-md text-on-surface font-semibold tabular-nums">{fmtMoney(e.total)}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-on-surface-variant text-body-md">
                    No operational costs aggregated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Grand Total Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-outline-variant/60 gap-3 bg-surface-container-low/50 p-4 rounded-xl">
          <span className="text-xs text-on-surface-variant font-mono uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Total Operational Cost (Auto) = Fuel + Maintenance
          </span>
          <span className="font-mono text-xl text-secondary font-bold tabular-nums">
            {fmtMoney(
              fuel.reduce((sum, f) => sum + f.cost, 0) + maint.reduce((sum, m) => sum + m.cost, 0)
            )}
          </span>
        </div>
      </div>
    </section>
  );
}

export default FuelView;
