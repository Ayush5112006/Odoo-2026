import React from 'react';

function DriversView({
  drivers,
  showAddDriver,
  setShowAddDriver,
  ndName,
  setNdName,
  ndLic,
  setNdLic,
  ndCat,
  setNdCat,
  ndExp,
  setNdExp,
  ndContact,
  setNdContact,
  ndScore,
  setNdScore,
  saveDriver,
  setDriverStatus,
  isLicenseExpired,
  getPill,
  canEdit
}) {
  return (
    <section className="space-y-6">
      {/* Page Head */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-on-surface-variant uppercase">Compliance</span>
          <h1 className="font-headline-md text-headline-md text-primary">Drivers &amp; Safety Profiles</h1>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddDriver(!showAddDriver)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-body-md font-bold hover:shadow-md hover:brightness-105 transition-all
              ${showAddDriver 
                ? 'bg-surface text-primary border border-outline' 
                : 'bg-secondary-container text-on-secondary-container'}`}
          >
            <span className="material-symbols-outlined text-[18px]">{showAddDriver ? 'close' : 'person_add'}</span>
            {showAddDriver ? 'Close Form' : 'Add Driver'}
          </button>
        )}
      </div>

      {/* Register New Driver Form */}
      {canEdit && showAddDriver && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">badge</span>
            Register New Driver
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Name</label>
              <input
                placeholder="Kiran"
                value={ndName}
                onChange={(e) => setNdName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">License No.</label>
              <input
                placeholder="DL-00000"
                value={ndLic}
                onChange={(e) => setNdLic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md font-mono placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Category</label>
              <select
                value={ndCat}
                onChange={(e) => setNdCat(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
              >
                <option>LMV</option>
                <option>HMV</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">License Expiry (MM/YYYY)</label>
              <input
                placeholder="12/2028"
                value={ndExp}
                onChange={(e) => setNdExp(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md font-mono placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Contact</label>
              <input
                placeholder="98xxxxxxxx"
                value={ndContact}
                onChange={(e) => setNdContact(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md font-mono placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Safety Score (%)</label>
              <input
                type="number"
                placeholder="90"
                value={ndScore}
                onChange={(e) => setNdScore(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={saveDriver}
              className="bg-secondary-container text-on-secondary-container font-bold px-4 py-2 rounded-lg hover:shadow-md hover:brightness-105 transition-all text-body-md"
            >
              Save driver
            </button>
            <button
              onClick={() => setShowAddDriver(false)}
              className="bg-surface text-primary border border-outline px-4 py-2 rounded-lg text-body-md hover:bg-surface-container-low transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Drivers Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3 rounded-l-lg">Driver</th>
                <th className="px-4 py-3">License No.</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Trip Compl.</th>
                <th className="px-4 py-3">Safety Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {drivers.map((d) => {
                const expired = isLicenseExpired(d.exp);
                return (
                  <tr key={d.lic} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3.5 text-body-md text-primary font-semibold">{d.name}</td>
                    <td className="px-4 py-3.5 font-mono text-body-md text-on-surface">{d.lic}</td>
                    <td className="px-4 py-3.5 text-body-md text-on-surface-variant">{d.cat}</td>
                    <td className="px-4 py-3.5 font-mono text-body-md text-on-surface">
                      {d.exp}
                      {expired && (
                        <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded ml-2 font-sans tracking-wide uppercase inline-block">
                          EXPIRED
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-body-md text-on-surface-variant">{d.contact}</td>
                    <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">{d.trips}%</td>
                    <td className="px-4 py-3.5 font-mono text-body-md text-on-surface tabular-nums">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${d.safety >= 85 ? 'text-tertiary-fixed-variant' : d.safety >= 70 ? 'text-secondary' : 'text-error'}`}>
                          {d.safety}%
                        </span>
                        <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${d.safety >= 85 ? 'bg-tertiary-container' : d.safety >= 70 ? 'bg-secondary-container' : 'bg-error-container'}`}
                            style={{ width: `${d.safety}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">{getPill(d.status)}</td>
                    <td className="px-4 py-3.5">
                      <select
                        value={d.status}
                        onChange={(e) => setDriverStatus(d._id, e.target.value)}
                        disabled={!canEdit}
                        className="px-2 py-1 bg-surface-container border border-outline-variant rounded text-xs text-on-surface focus:outline-none focus:border-secondary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option>Available</option>
                        <option>On Trip</option>
                        <option>Off Duty</option>
                        <option>Suspended</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-on-surface-variant text-body-md">
                    No drivers registered.
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
            <b>Safety Enforcement Rule:</b> An <i>Expired License</i> or <i>Suspended</i> status strictly blocks assigning the driver to any trip.
          </p>
        </div>
      </div>
    </section>
  );
}

export default DriversView;
