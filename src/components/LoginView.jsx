import React from 'react';

function LoginView({
  loginEmail,
  setLoginEmail,
  loginPass,
  setLoginPass,
  loginRole,
  setLoginRole,
  loginError,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  loading,
  forgotMode,
  setForgotMode,
  forgotEmail,
  setForgotEmail,
  forgotMessage,
  doLogin,
}) {
  return (
    <div id="view-login">
      <div className="login-side">
        <div className="brand-row">
          <div className="brand-mark">T</div>
          <div className="brand-name">TransitOps</div>
        </div>
        <p className="brand-tag">Smart Transport Operations Platform</p>

        <div className="login-eyebrow">Fleet · Drivers · Dispatch · Costs</div>
        <h1 className="login-headline">One login, four roles. Every vehicle accounted for.</h1>
        <p className="login-sub">Replace the spreadsheet and the logbook with a single source of truth for dispatch, maintenance, and expenses — enforced by rules, not by memory.</p>

        <div className="route-line" style={{ margin: '20px 0 34px' }}><div className="marker"></div></div>

        <div className="role-grid">
          <div className="role-card"><span className="dot" style={{ backgroundColor: 'var(--blue)' }}></span><b>Fleet Manager</b><p>Fleet, maintenance & lifecycle oversight</p></div>
          <div className="role-card"><span className="dot" style={{ backgroundColor: 'var(--amber)' }}></span><b>Dispatcher</b><p>Creates & tracks live trips</p></div>
          <div className="role-card"><span className="dot" style={{ backgroundColor: 'var(--green)' }}></span><b>Safety Officer</b><p>License validity & driver compliance</p></div>
          <div className="role-card"><span className="dot" style={{ backgroundColor: 'var(--purple)' }}></span><b>Financial Analyst</b><p>Costs, fuel & profitability</p></div>
        </div>
        <div className="login-foot">TRANSITOPS © 2026 · RBAC ENABLED · GANDHINAGAR DEPOT GJ4</div>
      </div>

      <div className="login-form-wrap">
        <form className="login-form" onSubmit={doLogin}>
          <h2>{forgotMode ? 'Reset your password' : 'Sign in to your account'}</h2>
          <p className="sub">
            {forgotMode
              ? 'Enter your email to receive a password reset link.'
              : 'Enter your credentials to continue.'}
          </p>

          {loginError && (
            <div className="error-banner">✕ {loginError}</div>
          )}
          {forgotMessage && (
            <div className="success-banner">✓ {forgotMessage}</div>
          )}

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="alex@transitops.in"
              value={forgotMode ? forgotEmail : loginEmail}
              onChange={(e) => forgotMode ? setForgotEmail(e.target.value) : setLoginEmail(e.target.value)}
              required
            />
          </div>

          {!forgotMode && (
            <>
              <div className="field field-password">
                <label>Password</label>
                <div className="password-row">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="field">
                <label>Role (optional)</label>
                <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)}>
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
              </div>
            </>
          )}

          <div className="row-between">
            {!forgotMode ? (
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--amber)' }}
                />
                Remember me
              </label>
            ) : <div />}
            <button
              type="button"
              className="link-muted link-button"
              onClick={() => {
                setForgotMode(!forgotMode)
                setLoginError('')
                setForgotMessage('')
              }}
            >
              {forgotMode ? 'Back to sign in' : 'Forgot password?'}
            </button>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Working…' : forgotMode ? 'Send reset link' : 'Sign in'}
          </button>

          {!forgotMode && (
            <div className="helper-note">
              <b>Access is scoped by role after login:</b><br />
              • Fleet Manager → Fleet, Maintenance, Analytics<br />
              • Dispatcher → Dashboard, Trips<br />
              • Safety Officer → Drivers, Trips (view)<br />
              • Financial Analyst → Fuel & Expenses, Analytics
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginView;
