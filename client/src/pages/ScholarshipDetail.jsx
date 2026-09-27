import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { CommentSection } from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  Award,
  Globe,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  Share2,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  FileText,
  AlertCircle,
  Clock,
  Send
} from 'lucide-react';

export const ScholarshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t, tr } = useLanguage();

  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchScholarship = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getScholarshipById(id);
        setScholarship(data);

        // Check if saved
        if (user) {
          const savedList = await api.getSaved();
          const exists = savedList.some(s => s.scholarshipId === id || s.scholarshipId === data.id);
          setIsSaved(exists);
        }
      } catch (err) {
        setError('Scholarship record not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchScholarship();
    window.scrollTo(0, 0);
  }, [id, user]);

  const handleToggleSave = async () => {
    if (!user) {
      addToast('Please log in to save scholarships', 'info');
      navigate('/login');
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await api.removeSaved(scholarship.id || scholarship._id);
        setIsSaved(false);
        addToast('Removed from your saved scholarships', 'info');
      } else {
        await api.saveScholarship(scholarship.id || scholarship._id, 'Interested in applying', 'Preparing');
        setIsSaved(true);
        addToast('Saved to your dashboard and application tracker!', 'success');
      }
    } catch (err) {
      addToast('Error saving scholarship', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddToTracker = async () => {
    if (!user) {
      addToast('Please log in to track applications', 'info');
      navigate('/login');
      return;
    }
    try {
      await api.createApplication({
        scholarshipId: scholarship.id || scholarship._id,
        scholarshipTitle: scholarship.title,
        deadline: scholarship.deadline,
        status: 'Preparing',
        notes: `Added from scholarship page on ${new Date().toLocaleDateString()}`,
        checklist: [
          { text: 'Verify all eligibility rules', completed: true },
          { text: 'Academic Transcripts translated', completed: false },
          { text: 'Recommendation letters requested', completed: false },
          { text: 'Personal essay / motivation letter drafted', completed: false },
          { text: 'Language proficiency certification', completed: false },
          { text: 'Submit on official portal before deadline', completed: false }
        ]
      });
      addToast('Application created in Application Tracker!', 'success');
      navigate('/applications');
    } catch (err) {
      addToast('Failed to add to tracker', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Scholarship link copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-slate-200 rounded"></div>
        <div className="h-12 w-3/4 bg-slate-200 rounded-xl"></div>
        <div className="h-40 bg-slate-100 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl"></div>
          <div className="h-64 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Scholarship Not Found</h2>
        <p className="text-slate-600 text-sm">
          The requested scholarship could not be found or may have concluded.
        </p>
        <Link
          to="/scholarships"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scholarships
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/scholarships"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to all scholarships')}
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          {t('Share Scholarship')}
        </button>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white border border-white/20">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            {t('Host Country:')} {tr(scholarship.destination || scholarship.country)}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
            {tr(scholarship.educationLevel)}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {tr(scholarship.fundingType)}
          </span>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            {tr(scholarship.title)}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            {t('Offered by')} <span className="font-semibold text-white">{scholarship.provider}</span>
          </p>
        </div>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          {scholarship.description}
        </p>

        {/* Action Row */}
        <div className="pt-4 flex flex-wrap items-center gap-3">
          {scholarship.applicationUrl && (
            <a
              href={scholarship.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>{t('Apply Now (Official Portal)')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={handleToggleSave}
            disabled={saving}
            className={`px-5 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all border ${
              isSaved
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? t('Saved in My Opportunities') : t('Save Scholarship')}</span>
          </button>

          <button
            onClick={handleAddToTracker}
            className="px-5 py-3.5 rounded-2xl bg-white text-indigo-950 font-bold text-sm hover:bg-slate-100 transition-colors shadow"
          >
            {t('+ Add to Application Tracker')}
          </button>
        </div>
      </div>

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Coverage, Eligibility, Application Steps */}
        <div className="md:col-span-2 space-y-8">
          
          {/* 1. What It Covers */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              {t('What It Covers')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('Only verified benefits confirmed for this scholarship program:')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {scholarship.coverage && scholarship.coverage.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{tr(benefit)}</span>
                </div>
              ))}
            </div>
            {scholarship.boarding && (
              <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>{t('Full on-campus residential boarding & room provided.')}</span>
              </div>
            )}
          </section>

          {/* 2. Detailed Eligibility Requirements */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              {t('Eligibility Requirements')}
            </h2>

            <div className="space-y-4 text-sm divide-y divide-slate-100">
              {scholarship.minimumAge && (
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-semibold text-slate-700">{t('Age Requirement:')}</span>
                  <span className="text-slate-600">{scholarship.minimumAge} to {scholarship.maximumAge} years old</span>
                </div>
              )}

              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-slate-700">{t('Education / Grade Level:')}</span>
                <span className="text-slate-600">
                  {scholarship.eligibleGrades ? scholarship.eligibleGrades.join(', ') : tr(scholarship.educationLevel)}
                </span>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-slate-700">{t('Eligible Nationalities:')}</span>
                <span className="text-slate-600">
                  {scholarship.eligibleNationalities ? scholarship.eligibleNationalities.map(n => tr(n)).join(', ') : t('Open to All')}
                </span>
              </div>

              {scholarship.academicRequirements && (
                <div className="pt-3 space-y-1">
                  <span className="font-semibold text-slate-700 block">{t('Academic Standards:')}</span>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{scholarship.academicRequirements}</p>
                </div>
              )}

              {scholarship.languageRequirements && (
                <div className="pt-3 space-y-1">
                  <span className="font-semibold text-slate-700 block">{t('Language Proficiency:')}</span>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{scholarship.languageRequirements}</p>
                </div>
              )}
            </div>
          </section>

          {/* 3. Numbered Application Process (5 Steps) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              {t('Standard Application Process')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t('Check Eligibility')}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t('Confirm your age, nationality, high-school grades, and target fields align with guidelines.')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t('Prepare Documents')}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t('Request official high-school transcripts, two teacher recommendation letters, and draft essays.')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t('Complete Application')}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t('Register on the official scholarship website portal and carefully fill in your background.')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t('Submit Before Deadline')}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t('Review all attached documents and submit at least 48 hours prior to official portal closing.')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{t('Track Application')}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {t('Keep your application reference number handy and update your Fyndora application tracker.')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Student Discussion & Questions Section */}
          <CommentSection
            targetType="scholarship"
            targetId={scholarship.id || id}
            targetTitle={scholarship.title}
          />
        </div>

        {/* Right Sidebar: Key Facts & Deadlines */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">{t('Scholarship Overview')}</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-slate-500">{t('Deadline Status:')}</span>
                <DeadlineBadge deadline={scholarship.deadline} />
              </div>
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-slate-500">{t('Exact Deadline:')}</span>
                <span className="font-semibold text-slate-800">{scholarship.deadline ? scholarship.deadline : t('Rolling')}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-slate-500">{t('Host Country:')}</span>
                <span className="font-semibold text-slate-800">{tr(scholarship.destination || scholarship.country)}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-slate-500">{t('Education Level:')}</span>
                <span className="font-semibold text-slate-800">{tr(scholarship.educationLevel)}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-slate-500">{t('Funding Model:')}</span>
                <span className="font-semibold text-emerald-700">{tr(scholarship.fundingType)}</span>
              </div>
              {scholarship.lastVerified && (
                <div className="flex items-center justify-between text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {t('Last Verified:')}
                  </span>
                  <span>{scholarship.lastVerified}</span>
                </div>
              )}
            </div>

            {/* Official Website Button */}
            {scholarship.officialWebsite && (
              <div className="pt-2">
                <a
                  href={scholarship.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-2.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                >
                  {t('Visit Official Provider Website →')}
                </a>
              </div>
            )}
          </div>

          {/* Eligibility Match Callout */}
          <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 space-y-3">
            <h4 className="font-bold text-sm text-indigo-900">{t('Wondering if you qualify?')}</h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              {t('Use our Personal Eligibility Matcher to compare your exact nationality, current grade, and study goals against this and other awards.')}
            </p>
            <Link
              to="/matches"
              className="inline-block w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center transition-colors shadow"
            >
              {t('Test Personal Eligibility')}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
