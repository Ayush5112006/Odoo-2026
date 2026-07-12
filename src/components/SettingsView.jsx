import React from 'react';

function SettingsView({
  settingsDepot,
  setSettingsDepot,
  settingsCurrency,
  setSettingsCurrency,
  settingsDistance,
  setSettingsDistance,
  triggerToast
}) {
  return (
    <section className="view" id="page-settings" style={{ display: 'block' }}>
      <div className="page-head">
        <div><span className="eyebrow">Configuration</span><h1>Settings &amp; RBAC</h1></div>
      </div>
      <div className="grid-2">
        <div className="card">
          <h3>General</h3>
          <div className="field">
            <label>Depot</label>
            <input value={settingsDepot} onChange={(e) => setSettingsDepot(e.target.value)} />
          </div>
          <div className="field">
            <label>Currency</label>
            <input value={settingsCurrency} onChange={(e) => setSettingsCurrency(e.target.value)} />
          </div>
          <div className="field">
            <label>Distance Unit</label>
            <input value={settingsDistance} onChange={(e) => setSettingsDistance(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => triggerToast('Settings saved')}>Save changes</button>
        </div>

        <div className="card">
          <h3>Role-Based Access (RBAC)</h3>
          <table className="rbac-table">
            <thead>
              <tr><th>Role</th><th>Fleet</th><th>Drivers</th><th>Trips</th><th>Fuel/Exp.</th><th>Analytics</th></tr>
            </thead>
            <tbody>
              <tr><td>Fleet Manager</td><td className="perm yes">✓</td><td className="perm yes">✓</td><td className="perm no">–</td><td className="perm no">–</td><td className="perm yes">✓</td></tr>
              <tr><td>Dispatcher</td><td className="perm view">view</td><td className="perm no">–</td><td className="perm yes">✓</td><td className="perm no">–</td><td className="perm no">–</td></tr>
              <tr><td>Safety Officer</td><td className="perm no">–</td><td className="perm yes">✓</td><td className="perm view">view</td><td className="perm no">–</td><td className="perm no">–</td></tr>
              <tr><td>Financial Analyst</td><td className="perm view">view</td><td className="perm no">–</td><td className="perm no">–</td><td className="perm yes">✓</td><td className="perm yes">✓</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default SettingsView;
