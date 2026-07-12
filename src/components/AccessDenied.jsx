import React from 'react'

function AccessDenied({ role }) {
  return (
    <div className="access-denied-shell">
      <div className="access-denied-card">
        {/* Animated shield icon */}
        <div className="ad-icon-wrap">
          <div className="ad-shield">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
          </div>
        </div>

        {/* Error code */}
        <div className="ad-code">403</div>

        {/* Title */}
        <h2 className="ad-title">Access Restricted</h2>

        {/* Divider accent */}
        <div className="ad-divider" />

        {/* Message */}
        <p className="ad-message">
          Your role <span className="ad-role-badge">{role || 'Guest'}</span> does not have
          permission to access this section.
        </p>

        <p className="ad-hint">
          Please navigate to a permitted section using the sidebar, or contact your system administrator if you believe this is an error.
        </p>
      </div>
    </div>
  )
}

export default AccessDenied
