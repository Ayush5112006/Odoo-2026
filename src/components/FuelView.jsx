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
    <section className="view" id="page-fuel" style={{ display: 'block' }}>
      <div className="page-head">
        <div><span className="eyebrow">Cost Tracking</span><h1>Fuel &amp; Expense Management</h1></div>
      </div>
      <div className="card" style={{ marginBottom: '18px' }}>
        <h3>Fuel Logs</h3>
        <div className="form-grid" style={{ marginBottom: '14px' }}>
          <div className="field">
            <label>Vehicle</label>
            <select value={ffVehicle} onChange={(e) => setFfVehicle(e.target.value)}>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="field"><label>Date</label><input type="date" value={ffDate} onChange={(e) => setFfDate(e.target.value)} /></div>
          <div className="field"><label>Liters</label><input type="number" placeholder="42" value={ffLiters} onChange={(e) => setFfLiters(e.target.value)} /></div>
          <div className="field"><label>Cost (₹)</label><input type="number" placeholder="3150" value={ffCost} onChange={(e) => setFfCost(e.target.value)} /></div>
        </div>
        <button className="btn btn-primary" style={{ width: 'auto', marginBottom: '16px' }} onClick={saveFuel}>+ Log Fuel</button>

        <table>
          <thead>
            <tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Fuel Cost</th></tr>
          </thead>
          <tbody>
            {fuel.map((f, i) => (
              <tr key={i}>
                <td className="mono">{f.vehicle?.name || '—'}</td>
                <td className="mono">{f.date}</td>
                <td className="mono">{f.liters} L</td>
                <td className="mono">{fmtMoney(f.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Operational Cost by Vehicle</h3>
        <table>
          <thead>
            <tr><th>Vehicle</th><th>Fuel</th><th>Maintenance</th><th>Total</th></tr>
          </thead>
          <tbody>
            {expenses.map((e, idx) => (
              <tr key={idx}>
                <td className="mono">{e.vehicle}</td>
                <td className="mono">{fmtMoney(e.fuel)}</td>
                <td className="mono">{fmtMoney(e.maintenance)}</td>
                <td className="mono">{fmtMoney(e.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>TOTAL OPERATIONAL COST (AUTO) = FUEL + MAINTENANCE</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '19px', color: 'var(--amber)', fontWeight: 600 }}>
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
