import React from 'react';

function MaintenanceView({
  vehicles,
  maint,
  mVehicle,
  setMVehicle,
  mType,
  setMType,
  mCost,
  setMCost,
  mDate,
  setMDate,
  saveMaintenance,
  closeMaintenance,
  fmtMoney,
  getPill
}) {
  const eligibleVehicles = vehicles.filter(v => v.status !== 'In Shop' && v.status !== 'Retired');

  return (
    <section className="space-y-6">
      {/* Page Head */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-on-surface-variant uppercase">Vehicle Lifecycle</span>
          <h1 className="font-headline-md text-headline-md text-primary">Maintenance</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Service Record Form */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">build</span>
            Log Service Record
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Vehicle</label>
              <select
                value={mVehicle}
                onChange={(e) => setMVehicle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
              >
                {eligibleVehicles.map(v => (
                  <option key={v._id} value={v._id}>{v.name} ({v.reg})</option>
                ))}
                {eligibleVehicles.length === 0 && (
                  <option value="">No eligible vehicles</option>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Service Type</label>
              <input
                placeholder="Oil Change"
                value={mType}
                onChange={(e) => setMType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Cost (₹)</label>
              <input
                type="number"
                placeholder="2500"
                value={mCost}
                onChange={(e) => setMCost(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Date</label>
              <input
                type="date"
                value={mDate}
                onChange={(e) => setMDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>

          <button
            onClick={saveMaintenance}
            className="w-full md:w-auto bg-secondary-container text-on-secondary-container font-bold px-4 py-2 rounded-lg hover:shadow-md hover:brightness-105 transition-all text-body-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save &amp; Put Vehicle In Shop
          </button>

          {/* Rule note */}
          <div className="flex items-start gap-2.5 mt-4 p-3 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface-variant leading-normal">
            <span className="material-symbols-outlined text-[16px] text-outline mt-0.5">info</span>
            <p>
              <b>Lifecycle Rule:</b> Available → <i>In Shop</i> status on record save. Completing a record restores the vehicle to <i>Available</i> status (unless Retired). In-shop vehicles are automatically removed from the active dispatcher pool.
            </p>
          </div>
        </div>

        {/* Service Log Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">history</span>
              Service Log
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                    <th className="px-4 py-3 rounded-l-lg">Vehicle</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Cost</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {maint.map((m) => (
                    <tr key={m._id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3.5 font-mono text-body-md text-primary font-semibold">{m.vehicle?.name || '—'}</td>
                      <td className="px-4 py-3.5 text-body-md text-on-surface">{m.service}</td>
                      <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">{fmtMoney(m.cost)}</td>
                      <td className="px-4 py-3.5">{getPill(m.status)}</td>
                      <td className="px-4 py-3.5">
                        {m.status === 'In Shop' && (
                          <button
                            onClick={() => closeMaintenance(m._id)}
                            className="bg-secondary-container/10 text-on-secondary-container hover:bg-secondary-container/20 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors flex items-center gap-0.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">done_all</span>
                            Close
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {maint.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-on-surface-variant text-body-md">
                        No service records logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MaintenanceView;
