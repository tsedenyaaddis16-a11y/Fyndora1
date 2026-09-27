import React from 'react';
import { Clock, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

export const DeadlineBadge = ({ deadline }) => {
  if (!deadline) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        Rolling Admission
      </span>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(deadline);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
        Deadline passed
      </span>
    );
  }

  if (diffDays <= 30) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Closing soon ({diffDays === 0 ? 'Today!' : `${diffDays} days left`})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
      Open ({diffDays} days left)
    </span>
  );
};
