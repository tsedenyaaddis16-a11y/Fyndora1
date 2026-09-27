import React from 'react';

const STATUS_STYLES = {
  Interested: 'bg-slate-100 text-slate-700 border-slate-300',
  Preparing: 'bg-blue-50 text-blue-700 border-blue-200',
  Applied: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Interview: 'bg-purple-50 text-purple-700 border-purple-200',
  Accepted: 'bg-emerald-50 text-emerald-800 border-emerald-300',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const StatusBadge = ({ status = 'Interested' }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Interested;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  );
};
