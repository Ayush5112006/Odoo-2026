import React, { useState, useEffect } from 'react';

function AuthModal({ isOpen, onClose, type, remainingAttempts, lockUntil }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!isOpen || type !== 'locked' || !lockUntil) return;

    const calculateTime = () => {
      const lockTime = new Date(lockUntil).getTime();
      const now = Date.now();
      const diff = lockTime - now;

      if (diff <= 0) {
        setTimeLeft('0s');
        onClose(); // Automatically close when timer hits zero
        return;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.ceil((diff % 60000) / 1000);
      
      if (mins > 0) {
        setTimeLeft(`${mins}m ${secs}s`);
      } else {
        setTimeLeft(`${secs}s`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [isOpen, type, lockUntil, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {type === 'locked' ? (
          <>
            <div className="w-16 h-16 rounded-full bg-error-container/60 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[36px]">lock</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">Account Locked</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              For security reasons, your account has been temporarily locked for 15 minutes due to 5 consecutive failed sign-in attempts.
            </p>
            <div className="w-full bg-surface-container-low rounded-xl py-3 px-4 border border-outline-variant/40 flex flex-col items-center">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Time Remaining</span>
              <span className="text-2xl font-bold font-mono text-error mt-1">{timeLeft || '15m 00s'}</span>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-secondary-container text-on-secondary-container rounded-lg py-2.5 font-bold hover:shadow-md hover:brightness-105 transition-all text-sm mt-2"
            >
              Close
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-secondary-fixed-dim/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[36px]">warning</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">Invalid Credentials</h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              The email or password you entered is incorrect. Please check your credentials and try again.
            </p>
            {remainingAttempts !== null && remainingAttempts !== undefined && (
              <div className="px-4 py-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold mt-1">
                You have {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining before lock.
              </div>
            )}
            <button
              onClick={onClose}
              className="w-full bg-primary text-on-primary rounded-lg py-2.5 font-bold hover:shadow-md hover:brightness-110 transition-all text-sm mt-2"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
