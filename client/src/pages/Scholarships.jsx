import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Award,
  Globe2,
  Calendar,
  ArrowUpDown,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const DESTINATIONS = [
  'All',
  'USA',
  'Canada',
  'UK',
  'Germany',
  'Japan',
  'South Korea',
  'South Africa',
  'Turkey',
  'Hungary',
  'Singapore',
  'France'
];

const EDUCATION_LEVELS = [
  'All',
  'High school',
  'Undergraduate'
];

const FUNDING_TYPES = [
  'All',
  'Fully funded',
  'Partially funded'
];

const NATIONALITIES = [
  'All',
  'Ethiopia',
  'Kenya',
  'Rwanda',
  'Ghana',
  'Nigeria',
  'International'
];

export const Scholarships = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, tr, isAmharic } = useLanguage();

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'All');
  const [educationLevel, setEducationLevel] = useState(searchParams.get('educationLevel') || 'All');
  const [fundingType, setFundingType] = useState(searchParams.get('fundingType') || 'All');
  const [nationality, setNationality] = useState(searchParams.get('nationality') || 'All');
  const [boardingOnly, setBoardingOnly] = useState(false);
  const [includeExpired, setIncludeExpired] = useState(false);
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline', 'recent', 'alphabetical'

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      try {
        const filters = {
          search: searchQuery || undefined,
          country: destination !== 'All' ? destination : undefined,
          educationLevel: educationLevel !== 'All' ? educationLevel : undefined,
          fundingType: fundingType !== 'All' ? fundingType : undefined,
          nationality: nationality !== 'All' ? nationality : undefined,
          boarding: boardingOnly ? true : undefined,
          includeExpired,
          sort: sortBy,
        };

        const data = await api.getScholarships(filters);
        setScholarships(data);
      } catch (err) {
        console.error('Failed to load scholarships:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchScholarships, 250);
    return () => clearTimeout(debounce);
  }, [searchQuery, destination, educationLevel, fundingType, nationality, boardingOnly, includeExpired, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setDestination('All');
    setEducationLevel('All');
    setFundingType('All');
    setNationality('All');
    setBoardingOnly(false);
    setIncludeExpired(false);
    setSortBy('deadline');
    setSearchParams({});
  };

  const activeFilterCount =
    (destination !== 'All' ? 1 : 0) +
    (educationLevel !== 'All' ? 1 : 0) +
    (fundingType !== 'All' ? 1 : 0) +
    (nationality !== 'All' ? 1 : 0) +
    (boardingOnly ? 1 : 0) +
    (includeExpired ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            {t('Verified Opportunities Directory')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('Find Scholarships & Educational Grants')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('Search hundreds of verified high-school exchanges and undergraduate university scholarships with full funding, living stipends, and flight allowances.')}
          </p>
        </div>
      </div>

      {/* Main Search Bar & Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Search scholarships by name, university, country, or subject...')}
            className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 text-sm shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="sm:hidden flex items-center justify-center gap-2 py-3 px-5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-semibold text-sm shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <span>{t('Filters')} ({activeFilterCount})</span>
        </button>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="deadline">{t('Sort: Deadline Soonest')}</option>
            <option value="recent">{t('Sort: Recently Verified')}</option>
            <option value="alphabetical">{t('Sort: Alphabetical (A-Z)')}</option>
          </select>
        </div>
      </div>

      {/* Grid Layout: Desktop Sidebar Filters + Scholarship List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-indigo-600" />
              {t('Filter Catalog')}
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                {t('Reset All')}
              </button>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('Study Destination')}
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {DESTINATIONS.map(d => (
                <option key={d} value={d}>{tr(d)}</option>
              ))}
            </select>
          </div>

          {/* Education Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('Education Level')}
            </label>
            <div className="space-y-1.5">
              {EDUCATION_LEVELS.map(lvl => (
                <label key={lvl} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="educationLevel"
                    value={lvl}
                    checked={educationLevel === lvl}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{tr(lvl)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Funding Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('Funding Coverage')}
            </label>
            <div className="space-y-1.5">
              {FUNDING_TYPES.map(ft => (
                <label key={ft} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="fundingType"
                    value={ft}
                    checked={fundingType === ft}
                    onChange={(e) => setFundingType(e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{tr(ft)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('Your Nationality')}
            </label>
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {NATIONALITIES.map(n => (
                <option key={n} value={n}>{tr(n)}</option>
              ))}
            </select>
          </div>

          {/* Checkbox Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={boardingOnly}
                onChange={(e) => setBoardingOnly(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>{t('Includes Boarding / Accommodation')}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeExpired}
                onChange={(e) => setIncludeExpired(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>{t('Show Past Deadlines')}</span>
            </label>
          </div>
        </aside>

        {/* SCHOLARSHIP LIST RESULTS */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Status Indicator */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
            <div>
              {isAmharic ? (
                <span><span className="font-bold text-slate-800">{scholarships.length}</span> {t('active opportunities')}</span>
              ) : (
                <span>Showing <span className="font-bold text-slate-800">{scholarships.length}</span> active opportunities</span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <span className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-semibold">
                {activeFilterCount} {isAmharic ? t('filters applied') : `filter${activeFilterCount > 1 ? 's' : ''} applied`}
              </span>
            )}
          </div>

          {/* Loading, Empty, or List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                  <div className="h-6 w-32 bg-slate-200 rounded-full"></div>
                  <div className="h-8 w-3/4 bg-slate-200 rounded-lg"></div>
                  <div className="h-16 bg-slate-100 rounded-lg"></div>
                  <div className="h-10 bg-slate-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : scholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholarships.map(sch => (
                <ScholarshipCard key={sch.id || sch._id} scholarship={sch} />
              ))}
            </div>
          ) : (
            /* REQUIRED EMPTY STATE MESSAGE */
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{t('No Scholarships Found')}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {t('No scholarships match your current filters. Try changing your search criteria.')}
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
              >
                {t('Reset All Filters')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL / DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white min-h-full p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-600" />
                  {t('Filter Scholarships')}
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">{t('Destination')}</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
                >
                  {DESTINATIONS.map(d => (
                    <option key={d} value={d}>{tr(d)}</option>
                  ))}
                </select>
              </div>

              {/* Education Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">{t('Education Level')}</label>
                {EDUCATION_LEVELS.map(lvl => (
                  <label key={lvl} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="radio"
                      name="m_educationLevel"
                      value={lvl}
                      checked={educationLevel === lvl}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="text-indigo-600"
                    />
                    <span>{tr(lvl)}</span>
                  </label>
                ))}
              </div>

              {/* Funding Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">{t('Funding Coverage')}</label>
                {FUNDING_TYPES.map(ft => (
                  <label key={ft} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <input
                      type="radio"
                      name="m_fundingType"
                      value={ft}
                      checked={fundingType === ft}
                      onChange={(e) => setFundingType(e.target.value)}
                      className="text-indigo-600"
                    />
                    <span>{tr(ft)}</span>
                  </label>
                ))}
              </div>

              {/* Checkboxes */}
              <div className="space-y-2 pt-2 border-t">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={boardingOnly}
                    onChange={(e) => setBoardingOnly(e.target.checked)}
                  />
                  <span>{t('Includes Boarding')}</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeExpired}
                    onChange={(e) => setIncludeExpired(e.target.checked)}
                  />
                  <span>{t('Show Past Deadlines')}</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
              >
                {t('Reset')}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow"
              >
                {t('Apply')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
