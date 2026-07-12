import React from 'react';

const NAV_ITEMS = [
  { name: 'Dashboard', view: 'dashboard', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg>
  )},
  { name: 'Fleet', view: 'fleet', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 13l1.5-5A2 2 0 0 1 6.4 6.5h11.2A2 2 0 0 1 19.5 8l1.5 5"/><rect x="2" y="13" width="20" height="5" rx="1.5"/><circle cx="7" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/></svg>
  )},
  { name: 'Drivers', view: 'drivers', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>
  )},
  { name: 'Trips', view: 'trips', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 19l5-14 3 9 3-6 5 11"/></svg>
  )},
  { name: 'Maintenance', view: 'maintenance', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L15 12l-1-1z"/></svg>
  )},
  { name: 'Fuel/Exp.', view: 'fuel', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15M6 21h9M6 10h7M15 8l2.5 2.5V17a1.5 1.5 0 0 0 3 0v-5l-2-2"/></svg>
  )},
  { name: 'Analytics', view: 'analytics', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20V10M11 20V4M18 20v-7"/></svg>
  )},
  { name: 'Settings & RBAC', view: 'settings', icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  )},
];

function Sidebar({ role, activeView, handleNavClick, logout, checkAccess }) {
  return (
    <div className="sidebar">
      <div className="side-brand">
        <div className="brand-mark">T</div>
        <span>TransitOps</span>
      </div>
      <div className="side-route route-line"><div className="marker"></div></div>

      <div className="nav-group-label">Operate</div>
      {NAV_ITEMS.slice(0, 4).map(item => {
        const isAllowed = checkAccess(item.name);
        return (
          <div key={item.view}
               className={`navitem ${activeView === item.view ? 'active' : ''} ${!isAllowed ? 'locked' : ''}`}
               onClick={() => handleNavClick(item)}>
            {item.icon}
            {item.name}
          </div>
        );
      })}

      <div className="nav-group-label">Manage</div>
      {NAV_ITEMS.slice(4).map(item => {
        const isAllowed = checkAccess(item.name === 'Settings & RBAC' ? '__settings' : item.name);
        return (
          <div key={item.view}
               className={`navitem ${activeView === item.view ? 'active' : ''} ${!isAllowed ? 'locked' : ''}`}
               onClick={() => handleNavClick(item)}>
            {item.icon}
            {item.name}
          </div>
        );
      })}

      <div className="sidebar-foot">
        <div className="role-pill" id="sideRolePill">ROLE: {role}</div>
        <span className="logout-link" onClick={logout}>Sign out</span>
      </div>
    </div>
  );
}

export default Sidebar;
