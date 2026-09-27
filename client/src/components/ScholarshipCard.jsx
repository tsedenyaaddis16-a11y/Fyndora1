import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeadlineBadge } from './DeadlineBadge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import {
  Globe,
  Award,
  Bookmark,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  Check,
  CheckCircle2,
  Calendar,
  Building
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ScholarshipCard = ({ scholarship, onSaveToggled, isSavedInitial = false }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t, isAmharic } = useLanguage();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      addToast('Please log in or register to save scholarships to your account', 'info');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await api.removeSaved(scholarship.id || scholarship._id);
        setIsSaved(false);
        addToast(`Removed "${scholarship.title}" from saved list`, 'info');
      } else {
        await api.saveScholarship(scholarship.id || scholarship._id, 'Saved from catalog', 'Interested');
        setIsSaved(true);
        addToast(`Saved "${scholarship.title}" to your dashboard!`, 'success');
      }
      if (onSaveToggled) onSaveToggled(scholarship.id || scholarship._id, !isSaved);
    } catch (err) {
      addToast('Failed to update saved status', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all flex flex-col justify-between relative">
      <div>
        {/* Top Header: Destination + Deadline + Save */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              {t(scholarship.destination || scholarship.country)}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {t(scholarship.educationLevel)}
            </span>
            {scholarship.isDemo && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                {isAmharic ? 'የሙከራ መረጃ' : 'Demo Data'}
              </span>
            )}
          </div>

          <button
            onClick={handleToggleSave}
            disabled={saving}
            title={isSaved ? (isAmharic ? 'ከተቀመጡት አስወግድ' : 'Remove from saved') : (isAmharic ? 'ስኮላርሺፑን አስቀምጥ' : 'Save scholarship')}
            className={`p-2 rounded-xl transition-all ${
              isSaved
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 leading-snug">
          <Link to={`/scholarships/${scholarship.id || scholarship._id}`}>
            {t(scholarship.title)}
          </Link>
        </h3>

        {/* Provider */}
        <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-3">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          {scholarship.provider}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Coverage Tags */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>{isAmharic ? 'የገንዘብ ድጋፍ እና ሽፋን:' : 'Funding & Benefits:'}</span>
            <span className={`px-2 py-0.5 rounded font-bold ${
              scholarship.fundingType === 'Fully funded'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {t(scholarship.fundingType)}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {scholarship.coverage && scholarship.coverage.slice(0, 4).map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
              >
                <Check className="w-3 h-3 text-emerald-600" />
                {t(item)}
              </span>
            ))}
            {scholarship.coverage && scholarship.coverage.length > 4 && (
              <span className="text-xs px-2 py-0.5 text-slate-400 font-medium">
                +{scholarship.coverage.length - 4} {isAmharic ? 'ተጨማሪ' : 'more'}
              </span>
            )}
          </div>
        </div>

        {/* Eligibility Snippet */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 space-y-1 mb-4">
          <p>
            <strong className="text-slate-700">{isAmharic ? 'ተጠቃሚዎች: ' : 'Eligible: '}</strong>
            {scholarship.eligibleNationalities ? scholarship.eligibleNationalities.slice(0, 3).map(n => t(n)).join(', ') : (isAmharic ? 'አለም አቀፍ' : 'International')}
            {scholarship.eligibleNationalities && scholarship.eligibleNationalities.length > 3 ? '...' : ''}
          </p>
          {scholarship.minimumAge && (
            <p>
              <strong className="text-slate-700">{isAmharic ? 'እድሜ: ' : 'Age: '}</strong>
              {scholarship.minimumAge}–{scholarship.maximumAge} {isAmharic ? 'ዓመት' : 'years'}
            </p>
          )}
        </div>
      </div>

      {/* Footer Area: Dynamic Deadline & Actions */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <DeadlineBadge deadline={scholarship.deadline} />
          {scholarship.lastVerified && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1" title="Last checked with official guidelines">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {isAmharic ? 'የተረጋገጠ ' : 'Verified '} {scholarship.lastVerified}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            to={`/scholarships/${scholarship.id || scholarship._id}`}
            className="flex-1 text-center py-2 px-3 text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
          >
            {isAmharic ? 'ሙሉ ዝርዝር እና መስፈርቶች' : 'Full Details & Criteria'}
          </Link>
          {scholarship.applicationUrl && (
            <a
              href={scholarship.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              title="Open official provider application website"
            >
              <span>{isAmharic ? 'አመልክት' : 'Apply'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
