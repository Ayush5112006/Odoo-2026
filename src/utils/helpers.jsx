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

export const getPill = (status) => {
  const cleanStatus = status.toLowerCase().replace(/\s+/g, '');
  const pillClass = `st-${cleanStatus}`;
  return <span className={`pill ${pillClass}`}>{status}</span>;
};
