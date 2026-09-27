import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { OpportunityCard } from '../components/OpportunityCard';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Search,
  Filter,
  X,
  Award,
  Globe,
  Compass,
  GraduationCap
} from 'lucide-react';

const OPPORTUNITY_TYPES = [
  'All',
  'Summer Program',
  'Fellowship',
  'Competition',
  'Internship',
  'Academic Program',
  'Leadership Program',
  'Conferences',
  'Scholarship'
];

export const Opportunities = () => {
  const { t, tr, isAmharic } = useLanguage();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const data = await api.getOpportunities({
          type: selectedType !== 'All' ? selectedType : undefined,
          search: searchQuery || undefined,
        });
        setOpportunities(data);
      } catch (err) {
        console.error('Failed to load opportunities:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchOpportunities, 250);
    return () => clearTimeout(debounce);
  }, [selectedType, searchQuery]);

  const handleClearFilters = () => {
    setSelectedType('All');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            {t('Enrichment & Extracurricular Hub')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('Competitions, Summer Camps & Fellowships')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('Boost your university profile with global olympiads, youth conferences, funded summer academies, and leadership fellowships.')}
          </p>
        </div>
      </div>

      {/* Search & Type Filter Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Search opportunities by title, provider, or topic...')}
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

        {/* Opportunity Type Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {OPPORTUNITY_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                selectedType === type
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300 hover:bg-slate-50'
              }`}
            >
              {tr(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
        <div>
          {isAmharic ? (
            <span><span className="font-bold text-slate-800">{opportunities.length}</span> {t('active opportunities')}</span>
          ) : (
            <span>Showing <span className="font-bold text-slate-800">{opportunities.length}</span> opportunities</span>
          )}
          {selectedType !== 'All' && <span> {isAmharic ? 'በ' : 'under'} <strong className="text-purple-600">{tr(selectedType)}</strong></span>}
        </div>
        {(selectedType !== 'All' || searchQuery) && (
          <button
            onClick={handleClearFilters}
            className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            {t('Reset filters')}
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
              <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
              <div className="h-16 bg-slate-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map(opp => (
            <OpportunityCard key={opp.id || opp._id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t('No Opportunities Found')}</h3>
          <p className="text-sm text-slate-500">
            {t('No events match your current filter selection. Try changing the opportunity type or clearing your search term.')}
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-purple-50 text-purple-600 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-colors"
          >
            {t('Reset Filters')}
          </button>
        </div>
      )}

    </div>
  );
};
