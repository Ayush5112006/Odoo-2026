import React from 'react';

function FleetView({
  vehicles,
  showAddVehicle,
  setShowAddVehicle,
  nvReg,
  setNvReg,
  nvName,
  setNvName,
  nvType,
  setNvType,
  nvCap,
  setNvCap,
  nvOdo,
  setNvOdo,
  nvCost,
  setNvCost,
  vfType,
  setVfType,
  vfStatus,
  setVfStatus,
  vfReg,
  setVfReg,
  vehValidation,
  setVehValidation,
  saveVehicle,
  fmtMoney,
  getPill,
  canEdit
}) {
  const filteredVehicles = vehicles.filter(v => {
    if (vfType !== 'Type: All' && v.type !== vfType) return false;
    if (vfStatus !== 'Status: All' && v.status !== vfStatus) return false;
    if (vfReg) {
      const q = vfReg.toLowerCase();
      return v.reg.toLowerCase().includes(q) || v.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Page Head */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-on-surface-variant uppercase">Master Registry</span>
          <h1 className="font-headline-md text-headline-md text-primary">Vehicle Registry</h1>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <select
            value={vfType}
            onChange={(e) => setVfType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
          >
            <option>Type: All</option>
            <option>Van</option>
            <option>Truck</option>
            <option>Mini Truck</option>
          </select>
          <select
            value={vfStatus}
            onChange={(e) => setVfStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
          >
            <option>Status: All</option>
            <option>Available</option>
            <option>On Trip</option>
            <option>In Shop</option>
            <option>Retired</option>
          </select>
          <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 w-full max-w-xs">
            <span className="material-symbols-outlined text-outline text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search reg. no…"
              value={vfReg}
              onChange={(e) => setVfReg(e.target.value)}
              className="bg-transparent border-none outline-none text-on-surface text-body-md placeholder:text-outline w-full focus:ring-0 p-0"
            />
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddVehicle(!showAddVehicle)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-body-md font-bold hover:shadow-md hover:brightness-105 transition-all
              ${showAddVehicle 
                ? 'bg-surface text-primary border border-outline' 
                : 'bg-secondary-container text-on-secondary-container'}`}
          >
            <span className="material-symbols-outlined text-[18px]">{showAddVehicle ? 'close' : 'add'}</span>
            {showAddVehicle ? 'Close Form' : 'Add Vehicle'}
          </button>
        )}
      </div>

      {/* Register New Vehicle Form */}
      {canEdit && showAddVehicle && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">local_shipping</span>
            Register New Vehicle
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono text-[10px] uppercase font-bold tracking-wide">
              Unique Reg. No. Required
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Registration No.</label>
              <input
                placeholder="GJ01AB1234"
                value={nvReg}
                onChange={(e) => setNvReg(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md font-mono placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Name / Model</label>
              <input
                placeholder="VAN-09"
                value={nvName}
                onChange={(e) => setNvName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Type</label>
              <select
                value={nvType}
                onChange={(e) => setNvType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
              >
                <option>Van</option>
                <option>Truck</option>
                <option>Mini Truck</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Max Capacity (kg)</label>
              <input
                type="number"
                placeholder="500"
                value={nvCap}
                onChange={(e) => setNvCap(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Odometer (km)</label>
              <input
                type="number"
                placeholder="0"
                value={nvOdo}
                onChange={(e) => setNvOdo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Acquisition Cost (₹)</label>
              <input
                type="number"
                placeholder="600000"
                value={nvCost}
                onChange={(e) => setNvCost(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>

          {/* Validation Banner */}
          {vehValidation.show && (
            <div
              className={`p-4 rounded-xl text-sm leading-relaxed border flex items-start gap-3 ${
                vehValidation.isOk
                  ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary/20'
                  : 'bg-error-container text-on-error-container border-error/20'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] mt-0.5">
                {vehValidation.isOk ? 'check_circle' : 'warning'}
              </span>
              <div>
                <b className="block font-semibold mb-0.5">{vehValidation.isOk ? 'Ready to Save' : 'Validation Error'}</b>
                {vehValidation.msg}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={saveVehicle}
              className="bg-secondary-container text-on-secondary-container font-bold px-4 py-2 rounded-lg hover:shadow-md hover:brightness-105 transition-all text-body-md"
            >
              Save vehicle
            </button>
            <button
              onClick={() => {
                setShowAddVehicle(false);
                setVehValidation({ show: false, isOk: false, msg: '' });
              }}
              className="bg-surface text-primary border border-outline px-4 py-2 rounded-lg text-body-md hover:bg-surface-container-low transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Vehicles Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3 rounded-l-lg">Reg. No.</th>
                <th className="px-4 py-3">Name/Model</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Odometer</th>
                <th className="px-4 py-3">Acq. Cost</th>
                <th className="px-4 py-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredVehicles.map((v) => (
                <tr key={v.reg} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3.5 font-mono text-body-md text-primary font-semibold">{v.reg}</td>
                  <td className="px-4 py-3.5 text-body-md text-on-surface">{v.name}</td>
                  <td className="px-4 py-3.5 text-body-md text-on-surface-variant">{v.type}</td>
                  <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">{v.cap} kg</td>
                  <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">{v.odo.toLocaleString('en-IN')} km</td>
                  <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">{fmtMoney(v.cost)}</td>
                  <td className="px-4 py-3.5">{getPill(v.status)}</td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-on-surface-variant text-body-md">
                    No vehicles match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Rule note */}
        <div className="flex items-start gap-2.5 mt-4 p-3 bg-surface-container-low border border-outline-variant rounded-lg text-xs text-on-surface-variant leading-normal">
          <span className="material-symbols-outlined text-[16px] text-outline mt-0.5">info</span>
          <p>
            <b>Business Rules:</b> Registration number must be unique. Vehicles set as <i>Retired</i> or <i>In Shop</i> are automatically removed from the active trip dispatcher pool.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FleetView;
