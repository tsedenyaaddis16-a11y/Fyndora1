import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DeadlineBadge } from '../components/DeadlineBadge';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Bookmark,
  ShieldAlert
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ScholarshipMatches = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState({
    age: user?.age || 17,
    country: user?.country || 'Ethiopia',
    nationality: user?.nationality || 'Ethiopia',
    grade: user?.grade || 'Grade 11',
    graduationYear: user?.graduationYear || 2027,
    preferredDestination: user?.preferredCountries?.[0] || 'USA',
    field: user?.preferredFields?.[0] || 'Computer Science',
    fundingPreference: user?.fundingPreference || 'Fully funded',
    boardingRequired: true,
    englishTaughtOnly: true,
  });

  const [matchedResults, setMatchedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const runMatching = async (currentProfile) => {
    setLoading(true);
    try {
      const results = await api.matchScholarships(currentProfile);
      setMatchedResults(results);
    } catch (err) {
      console.error('Failed to match scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runMatching(profile);
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveAndMatch = (e) => {
    e.preventDefault();
    if (user && updateProfile) {
      updateProfile({
        age: parseInt(profile.age, 10),
        nationality: profile.nationality,
        country: profile.country,
        grade: profile.grade,
        graduationYear: parseInt(profile.graduationYear, 10),
        fundingPreference: profile.fundingPreference,
      });
    }
    runMatching(profile);
    setIsFormOpen(false);
    addToast('Profile updated & matches recalculated!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Target className="w-3.5 h-3.5" />
          Personalized Eligibility Comparison Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Scholarships You May Be Eligible For
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          We compare your current age, nationality, academic grade, and funding needs against official scholarship requirements to highlight valid matches.
        </p>

        {/* Current Active Criteria Summary Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-white">Active Profile:</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Age: {profile.age}</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Nationality: {profile.nationality}</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Current: {profile.grade}</span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Destination: {profile.preferredDestination}</span>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-slate-100 transition-colors shadow"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isFormOpen ? 'Close Settings' : 'Edit Matching Profile'}</span>
          </button>
        </div>
      </div>

      {/* Profile Form (Collapsible) */}
      {isFormOpen && (
        <form
          onSubmit={handleSaveAndMatch}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-in slide-in-from-top-4"
        >
          <div className="border-b pb-4">
            <h3 className="text-lg font-bold text-slate-900">Your Student Profile Criteria</h3>
            <p className="text-xs text-slate-500">
              Provide accurate information so we can rule out scholarships with incompatible age or nationality restrictions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleProfileChange}
                min="13"
                max="30"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Nationality</label>
              <input
                type="text"
                name="nationality"
                value={profile.nationality}
                onChange={handleProfileChange}
                placeholder="e.g. Ethiopia, Kenya, Nigeria..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Grade Level</label>
              <select
                name="grade"
                value={profile.grade}
                onChange={handleProfileChange}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="High School Graduate">High School Graduate (Gap Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Year</label>
              <input
                type="number"
                name="graduationYear"
                value={profile.graduationYear}
                onChange={handleProfileChange}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Destination</label>
              <input
                type="text"
                name="preferredDestination"
                value={profile.preferredDestination}
                onChange={handleProfileChange}
                placeholder="e.g. USA, Canada, Germany, Japan"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Intended Field of Study</label>
              <input
                type="text"
                name="field"
                value={profile.field}
                onChange={handleProfileChange}
                placeholder="e.g. Computer Science, Medicine, Law"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                name="boardingRequired"
                checked={profile.boardingRequired}
                onChange={handleProfileChange}
                className="rounded text-indigo-600"
              />
              <span>I require residential boarding / campus accommodation</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                name="englishTaughtOnly"
                checked={profile.englishTaughtOnly}
                onChange={handleProfileChange}
                className="rounded text-indigo-600"
              />
              <span>English-taught curriculum only</span>
            </label>
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-200"
            >
              Update & Match Now
            </button>
          </div>
        </form>
      )}

      {/* Match Results List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <div>
            Found <strong className="text-slate-900">{matchedResults.length}</strong> scholarships compatible with your profile
          </div>
          <span className="text-xs text-amber-600 flex items-center gap-1 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            Always confirm specific guidelines on official websites
          </span>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
                <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
                <div className="h-4 w-2/3 bg-slate-100 rounded"></div>
                <div className="h-12 bg-emerald-50 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : matchedResults.length > 0 ? (
          <div className="space-y-6">
            {matchedResults.map(({ scholarship, score, reasons, unconfirmed }) => (
              <div
                key={scholarship.id || scholarship._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all space-y-5"
              >
                {/* Scholarship Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {score}% Alignment Score
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {scholarship.destination || scholarship.country}
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {scholarship.educationLevel}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      <Link
                        to={`/scholarships/${scholarship.id || scholarship._id}`}
                        className="hover:text-indigo-600 transition-colors"
                      >
                        {scholarship.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Provider: {scholarship.provider}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <DeadlineBadge deadline={scholarship.deadline} />
                  </div>
                </div>

                {/* Match Explanations: WHY it matches */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-2">
                  <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Matches your profile because:
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-900">
                    {reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>

                  {unconfirmed && (
                    <div className="mt-3 pt-2 border-t border-emerald-200 text-xs text-amber-800 flex items-center gap-1.5 font-medium">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Eligibility cannot be confirmed from your profile. Check the official requirements to verify.</span>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    <strong>Coverage: </strong>{scholarship.coverage ? scholarship.coverage.slice(0, 3).join(', ') : 'Tuition & Allowances'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/scholarships/${scholarship.id || scholarship._id}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                    >
                      <span>Full Criteria</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    {scholarship.applicationUrl && (
                      <a
                        href={scholarship.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-colors"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Direct Matches Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try adjusting your age or preferred destination in the profile settings, or explore our full scholarship catalog.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Adjust Profile Criteria
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
