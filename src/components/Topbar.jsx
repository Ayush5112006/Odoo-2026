import React from 'react';

function Topbar({ globalSearch, setGlobalSearch, role, getAvatarInitials, userName }) {
  return (
    <div className="topbar">
      <div className="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input type="text"
               placeholder="Search vehicles, drivers, trips…"
               value={globalSearch}
               onChange={(e) => setGlobalSearch(e.target.value)} />
      </div>
      <div className="topbar-right">
        <div className="user-chip">
          <div>
            <div className="name" id="topUserName">{userName || 'TransitOps User'}</div>
          </div>
          <span className="role-badge" id="topRoleBadge">{role.toUpperCase()}</span>
        </div>
        <div className="avatar" id="topAvatar">{getAvatarInitials()}</div>
      </div>
    </div>
  );
}

export default Topbar;
