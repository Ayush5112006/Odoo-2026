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
  return (
    <section className="view" id="page-fleet" style={{ display: 'block' }}>
      <div className="page-head">
        <div><span className="eyebrow">Master Registry</span><h1>Vehicle Registry</h1></div>
      </div>
      <div className="toolbar">
        <div className="filter-row" style={{ margin: 0 }}>
          <select value={vfType} onChange={(e) => setVfType(e.target.value)}>
            <option>Type: All</option>
            <option>Van</option>
            <option>Truck</option>
            <option>Mini Truck</option>
          </select>
          <select value={vfStatus} onChange={(e) => setVfStatus(e.target.value)}>
            <option>Status: All</option>
            <option>Available</option>
            <option>On Trip</option>
            <option>In Shop</option>
            <option>Retired</option>
          </select>
          <input type="text" placeholder="Search reg. no…" value={vfReg} onChange={(e) => setVfReg(e.target.value)} />
        </div>
        {canEdit && (
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddVehicle(!showAddVehicle)}>
            {showAddVehicle ? 'Close Form' : '+ Add Vehicle'}
          </button>
        )}
      </div>

      {canEdit && showAddVehicle && (
        <div className="card" style={{ marginBottom: '18px' }}>
          <h3>Register New Vehicle <span className="tag">reg. no. must be unique</span></h3>
          <div className="form-grid">
            <div className="field">
              <label>Registration No.</label>
              <input placeholder="GJ01AB1234" className="mono-input" value={nvReg} onChange={(e) => setNvReg(e.target.value)} />
            </div>
            <div className="field">
              <label>Name / Model</label>
              <input placeholder="VAN-09" value={nvName} onChange={(e) => setNvName(e.target.value)} />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={nvType} onChange={(e) => setNvType(e.target.value)}>
                <option>Van</option>
                <option>Truck</option>
                <option>Mini Truck</option>
              </select>
            </div>
            <div className="field">
              <label>Max Capacity (kg)</label>
              <input type="number" placeholder="500" value={nvCap} onChange={(e) => setNvCap(e.target.value)} />
            </div>
            <div className="field">
              <label>Odometer (km)</label>
              <input type="number" placeholder="0" value={nvOdo} onChange={(e) => setNvOdo(e.target.value)} />
            </div>
            <div className="field">
              <label>Acquisition Cost (₹)</label>
              <input type="number" placeholder="600000" value={nvCost} onChange={(e) => setNvCost(e.target.value)} />
            </div>
          </div>
          {vehValidation.show && (
            <div className={`validation-box show ${vehValidation.isOk ? 'ok' : ''}`}>
              <b>Validation Warning</b>
              {vehValidation.msg}
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={saveVehicle}>Save vehicle</button>
            <button className="btn btn-ghost" onClick={() => { setShowAddVehicle(false); setVehValidation({ show: false, isOk: false, msg: '' }); }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr><th>Reg. No.</th><th>Name/Model</th><th>Type</th><th>Capacity</th><th>Odometer</th><th>Acq. Cost</th><th>Status</th></tr>
          </thead>
          <tbody>
            {vehicles.filter(v => {
              if (vfType !== 'Type: All' && v.type !== vfType) return false;
              if (vfStatus !== 'Status: All' && v.status !== vfStatus) return false;
              if (vfReg) {
                const q = vfReg.toLowerCase();
                return v.reg.toLowerCase().includes(q) || v.name.toLowerCase().includes(q);
              }
              return true;
            }).map(v => (
              <tr key={v.reg}>
                <td className="mono">{v.reg}</td>
                <td>{v.name}</td>
                <td>{v.type}</td>
                <td className="mono">{v.cap} kg</td>
                <td className="mono">{v.odo.toLocaleString('en-IN')}</td>
                <td className="mono">{fmtMoney(v.cost)}</td>
                <td>{getPill(v.status)}</td>
              </tr>
            ))}
            {vehicles.filter(v => {
              if (vfType !== 'Type: All' && v.type !== vfType) return false;
              if (vfStatus !== 'Status: All' && v.status !== vfStatus) return false;
              if (vfReg) {
                const q = vfReg.toLowerCase();
                return v.reg.toLowerCase().includes(q) || v.name.toLowerCase().includes(q);
              }
              return true;
            }).length === 0 && (
              <tr><td colSpan="7"><div className="empty-help">No vehicles match these filters.</div></td></tr>
            )}
          </tbody>
        </table>
        <div className="rule-note">RULE · Registration number must be unique · Retired / In Shop vehicles are hidden from the trip dispatcher's vehicle pool.</div>
      </div>
    </section>
  );
}

export default FleetView;
