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
  getPill,
  canEdit
}) {
  return (
    <section className="view" id="page-maintenance" style={{ display: 'block' }}>
      <div className="page-head">
        <div><span className="eyebrow">Vehicle Lifecycle</span><h1>Maintenance</h1></div>
      </div>
      <div className="grid-2">
        {canEdit && (
          <div className="card">
            <h3>Log Service Record</h3>
            <div className="field">
              <label>Vehicle</label>
              <select value={mVehicle} onChange={(e) => setMVehicle(e.target.value)}>
                {vehicles.filter(v => v.status !== 'In Shop' && v.status !== 'Retired').map(v => (
                  <option key={v._id} value={v._id}>{v.name}</option>
                ))}
                {vehicles.filter(v => v.status !== 'In Shop' && v.status !== 'Retired').length === 0 && (
                  <option value="">No eligible vehicles</option>
                )}
              </select>
            </div>
            <div className="field"><label>Service Type</label><input placeholder="Oil Change" value={mType} onChange={(e) => setMType(e.target.value)} /></div>
            <div className="field"><label>Cost (₹)</label><input type="number" placeholder="2500" value={mCost} onChange={(e) => setMCost(e.target.value)} /></div>
            <div className="field"><label>Date</label><input type="date" value={mDate} onChange={(e) => setMDate(e.target.value)} /></div>
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={saveMaintenance}>
              Save &amp; put vehicle In Shop
            </button>
            <div className="rule-note">Available → In Shop on save · Completing a record restores the vehicle to Available (unless Retired) · In Shop vehicles are removed from the dispatch pool.</div>
          </div>
        )}

        <div className="card" style={!canEdit ? { gridColumn: 'span 2' } : {}}>
          <h3>Service Log</h3>
          <table>
            <thead>
              <tr><th>Vehicle</th><th>Service</th><th>Cost</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {maint.map((m) => (
                <tr key={m._id}>
                  <td className="mono">{m.vehicle?.name || '—'}</td>
                  <td>{m.service}</td>
                  <td className="mono">{fmtMoney(m.cost)}</td>
                  <td>{getPill(m.status)}</td>
                  <td>
                    {canEdit && m.status === 'In Shop' && (
                      <button className="btn btn-sm btn-ghost" onClick={() => closeMaintenance(m._id)}>Close</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default MaintenanceView;
