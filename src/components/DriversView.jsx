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
  getPill
}) {
  return (
    <section className="view" id="page-drivers" style={{ display: 'block' }}>
      <div className="page-head">
        <div><span className="eyebrow">Compliance</span><h1>Drivers &amp; Safety Profiles</h1></div>
      </div>
      <div className="toolbar">
        <div></div>
        <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => setShowAddDriver(!showAddDriver)}>
          {showAddDriver ? 'Close Form' : '+ Add Driver'}
        </button>
      </div>

      {showAddDriver && (
        <div className="card" style={{ marginBottom: '18px' }}>
          <h3>Register New Driver</h3>
          <div className="form-grid">
            <div className="field"><label>Name</label><input placeholder="Kiran" value={ndName} onChange={(e) => setNdName(e.target.value)} /></div>
            <div className="field"><label>License No.</label><input placeholder="DL-00000" value={ndLic} onChange={(e) => setNdLic(e.target.value)} /></div>
            <div className="field">
              <label>Category</label>
              <select value={ndCat} onChange={(e) => setNdCat(e.target.value)}>
                <option>LMV</option>
                <option>HMV</option>
              </select>
            </div>
            <div className="field"><label>License Expiry (MM/YYYY)</label><input placeholder="12/2028" value={ndExp} onChange={(e) => setNdExp(e.target.value)} /></div>
            <div className="field"><label>Contact</label><input placeholder="98xxxxxxxx" value={ndContact} onChange={(e) => setNdContact(e.target.value)} /></div>
            <div className="field"><label>Safety Score (%)</label><input type="number" placeholder="90" value={ndScore} onChange={(e) => setNdScore(e.target.value)} /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={saveDriver}>Save driver</button>
            <button className="btn btn-ghost" onClick={() => setShowAddDriver(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr><th>Driver</th><th>License No.</th><th>Category</th><th>Expiry</th><th>Contact</th><th>Trip Compl.</th><th>Safety</th><th>Status</th></tr>
          </thead>
          <tbody>
            {drivers.map((d) => {
              const expired = isLicenseExpired(d.exp);
              return (
                <tr key={d.lic}>
                  <td>{d.name}</td>
                  <td className="mono">{d.lic}</td>
                  <td>{d.cat}</td>
                  <td className="mono">
                    {d.exp} {expired && <span style={{ color: 'var(--red)', fontSize: '10.5px', marginLeft: '5px' }}>EXPIRED</span>}
                  </td>
                  <td className="mono">{d.contact}</td>
                  <td className="mono">{d.trips}%</td>
                  <td>{getPill(d.safety >= 90 ? 'Available' : (d.safety >= 85 ? 'On Trip' : 'Suspended'))}</td>
                  <td>
                    <select value={d.status}
                            onChange={(e) => setDriverStatus(d._id, e.target.value)}
                            style={{ background: 'var(--panel-2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 8px', fontSize: '12px' }}>
                      <option>Available</option>
                      <option>On Trip</option>
                      <option>Off Duty</option>
                      <option>Suspended</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="rule-note">RULE · Expired license or Suspended status blocks assignment to any trip.</div>
      </div>
    </section>
  );
}

export default DriversView;
