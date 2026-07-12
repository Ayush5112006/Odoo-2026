import React from 'react';

function AccessDenied({ role, onReturn }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 max-w-md shadow-sm space-y-4 flex flex-col items-center">
        {/* Error Shield Icon */}
        <div className="w-16 h-16 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-2">
          <span className="material-symbols-outlined text-[36px]">shield_lock</span>
        </div>

        <div className="text-error font-mono text-[48px] font-extrabold tracking-wider leading-none">
          403
        </div>

        <h2 className="font-headline-md text-headline-md text-primary font-bold">
          Access Denied
        </h2>

        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Your current session role <strong className="text-primary font-semibold">"{role || 'Guest'}"</strong> does not have permissions enabled to access this resource or view.
        </p>

        <button
          onClick={onReturn}
          className="bg-secondary-container text-on-secondary-container font-bold px-5 py-2.5 rounded-lg hover:shadow-md hover:brightness-105 transition-all text-body-md flex items-center gap-1.5 mt-2"
        >
          <span className="material-symbols-outlined text-[18px]">dashboard</span>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default AccessDenied;
