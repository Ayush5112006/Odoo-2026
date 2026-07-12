import React from 'react';

// Fixed date context matching the brief
export const TODAY = new Date(2026, 6, 12); // July 12, 2026

export const isLicenseExpired = (expStr) => {
  const parts = expStr.split('/');
  if (parts.length !== 2) return false;
  const mm = Number(parts[0]);
  const yyyy = Number(parts[1]);
  const expDate = new Date(yyyy, mm, 0); // Last day of that month
  return expDate < TODAY;
};

export const fmtMoney = (n) => {
  return '₹' + Number(n).toLocaleString('en-IN');
};

const STATUS_STYLES = {
  available:   'bg-secondary-container text-on-secondary-container',
  ontrip:      'bg-tertiary-container text-on-tertiary-container',
  dispatched:  'bg-tertiary-container text-on-tertiary-container',
  active:      'bg-tertiary-container text-on-tertiary-container',
  draft:       'bg-surface-container-high text-on-surface-variant',
  completed:   'bg-surface-container-high text-on-surface-variant',
  closed:      'bg-surface-container-high text-on-surface-variant',
  inshop:      'bg-error-container text-on-error-container',
  cancelled:   'bg-error-container text-on-error-container',
  suspended:   'bg-error-container text-on-error-container',
  retired:     'bg-error-container text-on-error-container',
  offduty:     'bg-surface-container-high text-on-surface-variant',
};

export const getPill = (status) => {
  const key = status.toLowerCase().replace(/\s+/g, '');
  const classes = STATUS_STYLES[key] || 'bg-surface-container-high text-on-surface-variant';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${classes}`}>
      {status}
    </span>
  );
};
