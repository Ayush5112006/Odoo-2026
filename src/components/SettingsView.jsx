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

    let selectColorClass = 'bg-surface-container-low border-outline-variant text-on-surface-variant';
    if (currentVal === 'full') {
      selectColorClass = 'bg-tertiary-container/30 border-tertiary/30 text-on-tertiary-container font-bold';
    } else if (currentVal === 'view') {
      selectColorClass = 'bg-primary-container/30 border-primary/30 text-on-primary-container font-bold';
    }

    return (
      <td className="px-4 py-2 text-center">
        <select
          value={currentVal}
          onChange={(e) => onRbacChange(role, module, e.target.value)}
          className={`px-2.5 py-1 rounded-lg border text-[11.5px] uppercase tracking-wider focus:outline-none transition-all cursor-pointer ${selectColorClass}`}
          style={{ width: '82px', textAlign: 'center' }}
        >
          <option value="full">Full</option>
          <option value="view">View</option>
          <option value="none">None</option>
        </select>
      </td>
    );
  };

  return (
    <section className="space-y-6">
      {/* Page Head */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-on-surface-variant uppercase">Configuration</span>
          <h1 className="font-headline-md text-headline-md text-primary">Settings &amp; RBAC</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">tune</span>
              General Settings
            </h3>

            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Depot</label>
              <input
                value={settingsDepot}
                onChange={(e) => setSettingsDepot(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Currency</label>
              <input
                value={settingsCurrency}
                onChange={(e) => setSettingsCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Distance Unit</label>
              <input
                value={settingsDistance}
                onChange={(e) => setSettingsDistance(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              />
            </div>
          </div>

          <button
            onClick={saveSettings}
            className="w-full md:w-auto bg-secondary-container text-on-secondary-container font-bold px-4 py-2 rounded-lg hover:shadow-md hover:brightness-105 transition-all text-body-md self-start flex items-center justify-center gap-2 mt-4"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save changes
          </button>
        </div>

        {/* RBAC Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-container-padding shadow-sm space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">admin_panel_settings</span>
            Role-Based Access (RBAC)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                  <th className="px-4 py-3 rounded-l-lg">Role</th>
                  {modules.map((module) => (
                    <th key={module} className="px-4 py-3 text-center">{module}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {rbacRoles.map((role) => (
                  <tr key={role} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3.5 text-body-md font-semibold text-primary">{role}</td>
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
      </div>
    </section>
  );
}

export default SettingsView;
