import React from 'react';

function TripsView({
  vehicles,
  drivers,
  trips,
  tSource,
  setTSource,
  tDest,
  setTDest,
  tVehicle,
  setTVehicle,
  tDriver,
  setTDriver,
  tCargo,
  setTCargo,
  tDist,
  setTDist,
  tripValidation,
  createAndDispatch,
  createDraft,
  completeTrip,
  cancelTrip,
  isLicenseExpired,
  getPill
}) {
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const eligibleDrivers = drivers.filter(d => d.status === 'Available' && !isLicenseExpired(d.exp));

  return (
    <section className="space-y-6">
      {/* Page Head */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-on-surface-variant uppercase">Dispatch Control</span>
          <h1 className="font-headline-md text-headline-md text-primary">Trip Dispatch</h1>
        </div>
      </div>

      {/* Lifecycle Stepper */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 bg-surface-container rounded-xl p-4 border border-outline-variant/60 max-w-2xl mx-auto shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center font-mono text-xs font-semibold text-on-surface-variant">1</span>
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Draft</span>
        </div>
        <div className="h-0.5 w-8 bg-outline-variant/40 hidden md:block"></div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center font-mono text-xs font-bold text-on-secondary-container">2</span>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Dispatched</span>
        </div>
        <div className="h-0.5 w-8 bg-outline-variant/40 hidden md:block"></div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center font-mono text-xs font-semibold text-on-surface-variant">3</span>
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Completed</span>
        </div>
        <div className="h-0.5 w-8 bg-outline-variant/40 hidden md:block"></div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center font-mono text-xs font-semibold text-on-surface-variant">4</span>
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Cancelled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Trip Form Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">add_road</span>
              Create Trip
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Source</label>
                <input
                  placeholder="Gandhinagar Depot"
                  value={tSource}
                  onChange={(e) => setTSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Destination</label>
                <input
                  placeholder="Ahmedabad Hub"
                  value={tDest}
                  onChange={(e) => setTDest(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Vehicle (Available only)</label>
                <select
                  value={tVehicle}
                  onChange={(e) => setTVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  {availableVehicles.length === 0 ? (
                    <option value="">No vehicles available</option>
                  ) : (
                    availableVehicles.map(v => (
                      <option key={v._id} value={v._id}>{v.name} — {v.cap} kg cap</option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Driver (Available only)</label>
                <select
                  value={tDriver}
                  onChange={(e) => setTDriver(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer"
                >
                  {eligibleDrivers.length === 0 ? (
                    <option value="">No eligible drivers</option>
                  ) : (
                    eligibleDrivers.map(d => (
                      <option key={d._id} value={d._id}>{d.name} — {d.cat}</option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Cargo Weight (kg)</label>
                <input
                  type="number"
                  value={tCargo}
                  onChange={(e) => setTCargo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Planned Distance (km)</label>
                <input
                  type="number"
                  value={tDist}
                  onChange={(e) => setTDist(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
            </div>

            {/* Validation Banner */}
            {tripValidation.show && (
              <div
                className={`p-4 rounded-xl text-sm leading-relaxed border flex items-start gap-3 mt-4 ${
                  tripValidation.isOk
                    ? 'bg-secondary-fixed text-on-secondary-fixed border-secondary/20'
                    : 'bg-error-container text-on-error-container border-error/20'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] mt-0.5">
                  {tripValidation.isOk ? 'check_circle' : 'warning'}
                </span>
                <div>
                  <b className="block font-semibold mb-0.5">{tripValidation.isOk ? 'Dispatch Validation Ok' : 'Dispatch Validation Blocked'}</b>
                  {tripValidation.msg}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
            <button
              disabled={!tripValidation.isOk || availableVehicles.length === 0 || eligibleDrivers.length === 0}
              onClick={createAndDispatch}
              className="bg-secondary-container text-on-secondary-container font-bold px-4 py-2.5 rounded-lg hover:shadow-md hover:brightness-105 transition-all text-body-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              Create &amp; Dispatch
            </button>
            <button
              onClick={createDraft}
              className="bg-surface text-primary border border-outline px-4 py-2.5 rounded-lg text-body-md hover:bg-surface-container-low transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save as Draft
            </button>
          </div>
        </div>

        {/* Live Board Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">dns</span>
            Live Board
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {trips.map((t) => (
              <div
                key={t.id}
                className="bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/65 rounded-xl p-4 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-sm font-bold text-primary">{t.id}</span>
                    {getPill(t.status)}
                  </div>
                  <div className="flex items-center gap-2 text-body-md text-on-surface font-semibold">
                    <span>{t.source}</span>
                    <span className="material-symbols-outlined text-outline text-[16px]">arrow_forward</span>
                    <span>{t.dest}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                      {t.vehicle ? `${t.vehicle.name} / ${t.driver?.name || '—'}` : 'Unassigned'}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {t.eta}
                    </span>
                  </div>
                </div>

                {t.status === 'Dispatched' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/30 mt-1">
                    <button
                      onClick={() => completeTrip(t._id)}
                      className="bg-tertiary-container text-on-tertiary-container hover:shadow-sm text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      Complete
                    </button>
                    <button
                      onClick={() => cancelTrip(t._id)}
                      className="bg-error-container text-on-error-container hover:shadow-sm text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
            {trips.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant text-body-md">
                No active or historical trips on the live board.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TripsView;
