import React from 'react';
import AuthModal from './AuthModal';

function LoginView({
  loginEmail,
  setLoginEmail,
  loginPass,
  setLoginPass,
  loginRole,
  setLoginRole,
  availableRoles,
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
  showAuthModal,
  setShowAuthModal,
  authModalType,
  remainingAttempts,
  lockUntil,
}) {
  const roleInfo = [
    { name: 'Fleet Manager', desc: 'Fleet, maintenance & lifecycle oversight', color: 'bg-primary-fixed text-on-primary-fixed', icon: 'local_shipping' },
    { name: 'Dispatcher', desc: 'Creates & tracks live trips', color: 'bg-secondary-fixed text-on-secondary-fixed', icon: 'route' },
    { name: 'Safety Officer', desc: 'License validity & driver compliance', color: 'bg-tertiary-fixed text-on-tertiary-fixed', icon: 'verified_user' },
    { name: 'Financial Analyst', desc: 'Costs, fuel & profitability', color: 'bg-surface-container-high text-on-surface-variant', icon: 'analytics' },
  ];

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Brand Panel */}
      <div className="bg-primary relative overflow-hidden flex flex-col justify-between p-10 lg:p-14">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/30 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          {/* Brand */}
          <div className="flex items-center gap-3.5 mb-1.5">
            <div className="w-11 h-11 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container font-extrabold text-xl shadow-lg">
              T
            </div>
            <span className="text-on-primary font-bold text-[26px] tracking-tight">TransitOps</span>
          </div>
          <p className="text-on-primary-container text-sm ml-[58px] mb-10">Smart Transport Operations Platform</p>

          {/* Headline */}
          <p className="text-secondary-container text-[11px] font-mono tracking-[0.14em] uppercase mb-3.5">Fleet · Drivers · Dispatch · Costs</p>
          <h1 className="text-on-primary text-[32px] lg:text-[34px] leading-tight font-semibold max-w-[420px] mb-3">
            One login, four roles. Every vehicle accounted for.
          </h1>
          <p className="text-on-primary-container text-[14.5px] max-w-[380px] leading-relaxed mb-8">
            Replace the spreadsheet and the logbook with a single source of truth for dispatch, maintenance, and expenses — enforced by rules, not by memory.
          </p>

          {/* Route line */}
          <div className="route-line my-5" style={{ margin: '20px 0 34px' }}>
            <div className="marker"></div>
          </div>
        </div>

        {/* Role cards */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mt-auto">
          {roleInfo.map((r) => (
            <div key={r.name} className="bg-white/[0.07] border border-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">{r.icon}</span>
                <span className="text-on-primary font-semibold text-sm">{r.name}</span>
              </div>
              <p className="text-on-primary-container text-xs leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        <p className="relative z-10 text-on-primary-container/50 text-[10.5px] tracking-[0.1em] uppercase mt-8">
          TRANSITOPS © 2026 · RBAC ENABLED · GANDHINAGAR DEPOT GJ4
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="bg-background flex items-center justify-center p-8 lg:p-14">
        <form className="w-full max-w-[420px] space-y-5" onSubmit={doLogin}>
          <h2 className="font-headline-md text-headline-md text-primary mb-1">
            {forgotMode ? 'Reset your password' : 'Sign in to your account'}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            {forgotMode
              ? 'Enter your email to receive a password reset link.'
              : 'Enter your credentials to continue.'}
          </p>

          {/* Error banner */}
          {loginError && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {loginError}
            </div>
          )}

          {/* Success banner */}
          {forgotMessage && (
            <div className="bg-tertiary-fixed text-on-tertiary-fixed px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {forgotMessage}
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Email</label>
            <input
              type="email"
              placeholder="alex@transitops.in"
              value={forgotMode ? forgotEmail : loginEmail}
              onChange={(e) => forgotMode ? setForgotEmail(e.target.value) : setLoginEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary-container"
            />
          </div>

          {!forgotMode && (
            <>
              {/* Password field */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary-container pr-16"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface text-xs font-semibold uppercase tracking-wide"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div className="space-y-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wide text-on-surface-variant">Role (optional)</label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary-container"
                >
                  {(availableRoles || []).map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Remember me + Forgot */}
          <div className="flex items-center justify-between">
            {!forgotMode ? (
              <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-outline-variant text-secondary-container focus:ring-secondary-container"
                />
                Remember me
              </label>
            ) : <div />}
            <button
              type="button"
              className="text-sm text-secondary font-medium hover:underline"
              onClick={() => {
                setForgotMode(!forgotMode);
              }}
            >
              {forgotMode ? 'Back to sign in' : 'Forgot password?'}
            </button>
          </div>

          {/* Submit */}
          <button
            className="w-full bg-secondary-container text-on-secondary-container rounded-lg px-4 py-3 font-body-md font-bold hover:shadow-md hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Working…' : forgotMode ? 'Send reset link' : 'Sign in'}
          </button>

          {/* Helper note */}
          {!forgotMode && (
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 text-xs text-on-surface-variant leading-relaxed mt-4">
              <b className="text-on-surface">Access is scoped by role after login:</b><br />
              • Fleet Manager → Fleet, Maintenance, Analytics<br />
              • Dispatcher → Dashboard, Trips<br />
              • Safety Officer → Drivers, Trips (view)<br />
              • Financial Analyst → Fuel & Expenses, Analytics
            </div>
          )}
        </form>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        type={authModalType}
        remainingAttempts={remainingAttempts}
        lockUntil={lockUntil}
      />
    </div>
  );
}

export default LoginView;
