import React from 'react';

const NAV_ITEMS = [
  { name: 'Dashboard', view: 'dashboard', icon: 'dashboard' },
  { name: 'Fleet', view: 'fleet', icon: 'local_shipping' },
  { name: 'Drivers', view: 'drivers', icon: 'person' },
  { name: 'Trips', view: 'trips', icon: 'route' },
  { name: 'Maintenance', view: 'maintenance', icon: 'build' },
  { name: 'Fuel/Exp.', view: 'fuel', icon: 'local_gas_station' },
  { name: 'Analytics', view: 'analytics', icon: 'bar_chart' },
  { name: 'Settings & RBAC', view: 'settings', icon: 'settings' },
];

function Sidebar({ role, activeView, handleNavClick, logout, checkAccess }) {
  return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-surface-container-low border-r border-outline-variant px-4 py-6 flex flex-col z-40 overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-2">
        <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container font-extrabold text-base shadow-sm">
          T
        </div>
        <span className="text-primary font-bold text-lg tracking-tight">TransitOps</span>
      </div>

      {/* Route line */}
      <div className="route-line mx-2 my-3"><div className="marker"></div></div>

      {/* Operate Group */}
      <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-3 mt-4 mb-2">Operate</p>
      {NAV_ITEMS.slice(0, 4).map(item => {
        const isAllowed = checkAccess(item.name);
        const isActive = activeView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => handleNavClick(item)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5
              ${isActive
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}
              ${!isAllowed ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.name}
            {!isAllowed && <span className="material-symbols-outlined text-[14px] ml-auto">lock</span>}
          </button>
        );
      })}

      {/* Manage Group */}
      <p className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-3 mt-5 mb-2">Manage</p>
      {NAV_ITEMS.slice(4).map(item => {
        const isAllowed = checkAccess(item.name === 'Settings & RBAC' ? '__settings' : item.name);
        const isActive = activeView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => handleNavClick(item)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5
              ${isActive
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}
              ${!isAllowed ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            {item.name}
            {!isAllowed && <span className="material-symbols-outlined text-[14px] ml-auto">lock</span>}
          </button>
        );
      })}

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-outline-variant mx-2">
        <div className="bg-primary-fixed text-on-primary-fixed text-[10.5px] font-semibold uppercase tracking-[0.08em] rounded-full px-3 py-1.5 text-center mb-3">
          ROLE: {role}
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-sm text-error hover:text-on-error hover:bg-error rounded-lg px-3 py-2 transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
