import React from 'react'

function AccessDenied({ role, onReturn }) {
  return (
    <div className="access-denied-shell">
      <div className="access-denied-card">
        <div className="error-code">403</div>
        <h2>Access Denied</h2>
        <p>
          Your role <strong>{role || 'Guest'}</strong> does not have permission to view this section.
          If you believe this is an error, contact your administrator.
        </p>
        <button className="btn btn-primary" onClick={onReturn}>
          Return to dashboard
        </button>
      </div>
    </div>
  )
}

export default AccessDenied
