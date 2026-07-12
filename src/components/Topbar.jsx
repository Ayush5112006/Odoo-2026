import React from 'react';

function Topbar({ globalSearch, setGlobalSearch, role, getAvatarInitials, userName }) {
  return (
    <header className="h-16 w-full sticky top-0 z-50 bg-surface border-b border-outline-variant px-margin-page flex items-center justify-between">
      {/* Left: Brand (visible on mobile) + Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile brand */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container font-extrabold text-sm">
            T
          </div>
          <span className="text-primary font-bold text-base">TransitOps</span>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-surface-container rounded-lg px-3 py-2 w-full max-w-md">
          <span className="material-symbols-outlined text-outline text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search fleet, drivers, trips…"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-on-surface text-body-md placeholder:text-outline w-full focus:ring-0"
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center transition-colors relative">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-outline-variant">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold">
            {getAvatarInitials()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-on-surface leading-tight">{userName || 'User'}</p>
            <p className="text-[11px] text-on-surface-variant leading-tight">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
