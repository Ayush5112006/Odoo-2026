import React from 'react';

function SettingsView({
  settingsDepot,
  setSettingsDepot,
  settingsCurrency,
  setSettingsCurrency,
  settingsDistance,
  setSettingsDistance,
  saveSettings,
  rbacAccess,
  rbacRoles,
  onRbacChange
}) {
  const modules = ['Fleet', 'Drivers', 'Trips', 'Fuel/Exp.', 'Analytics'];

  const renderPermission = (role, module) => {
    const allowed = rbacAccess?.[role] || [];
    let currentVal = 'none';
    if (allowed.includes(module)) {
      currentVal = 'full';
    } else if (allowed.includes(`${module}:view`)) {
      currentVal = 'view';
    }

    return (
      <td>
        <select
          value={currentVal}
          onChange={(e) => onRbacChange(role, module, e.target.value)}
          className={`rbac-select rbac-select-${currentVal}`}
        >
          <option value="full">Full</option>
          <option value="view">View</option>
          <option value="none">None</option>
        </select>
      </td>
    );
  };

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
          <button className="btn btn-primary" style={{ width: 'auto' }} onClick={saveSettings}>Save changes</button>
        </div>

        <div className="card">
          <h3>Role-Based Access (RBAC)</h3>
          <table className="rbac-table">
            <thead>
              <tr>
                <th>Role</th>
                {modules.map((module) => (
                  <th key={module}>{module}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rbacRoles.map((role) => (
                <tr key={role}>
                  <td>{role}</td>
                  {modules.map((module) => (
                    <React.Fragment key={`${role}-${module}`}>
                      {renderPermission(role, module)}
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default SettingsView;
