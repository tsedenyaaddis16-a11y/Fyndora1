import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home, Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900">404 - Lost Your Path?</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved to another section of Fyndora.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/careers"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-indigo-600" />
            <span>Explore Careers</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
