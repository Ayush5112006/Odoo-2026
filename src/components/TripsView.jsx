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
  return (
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
  );
}

export default TripsView;
