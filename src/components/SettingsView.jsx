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
  rbacRoles
}) {
  const modules = ['Fleet', 'Drivers', 'Trips', 'Fuel/Exp.', 'Analytics'];

  const renderPermission = (role, module) => {
    const allowed = rbacAccess?.[role] || [];
    if (allowed.includes(module)) {
      return (
        <td className="px-4 py-3.5 text-center">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-tertiary-container text-on-tertiary-container">
            <span className="material-symbols-outlined text-[16px] font-bold">check</span>
          </span>
        </td>
      );
    }
    if (
      ((module === 'Fleet' || module === 'Trips') && role === 'Dispatcher') ||
      (module === 'Trips' && role === 'Safety Officer') ||
      (module === 'Fleet' && role === 'Financial Analyst')
    ) {
      return (
        <td className="px-4 py-3.5 text-center">
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
            view
          </span>
        </td>
      );
    }
    return (
      <td className="px-4 py-3.5 text-center">
        <span className="text-outline-variant font-mono">—</span>
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
