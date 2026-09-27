import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { CareerCard } from '../components/CareerCard';
import { CAREER_CATEGORIES } from '../data/mockData';
import { Search, Filter, BookOpen, Sparkles, X, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Careers = () => {
  const { t, isAmharic } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  useEffect(() => {
    const fetchCareers = async () => {
      setLoading(true);
      try {
        const data = await api.getCareers({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined
        });
        setCareers(data);
      } catch (err) {
        console.error('Failed to load careers:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchCareers, 250);
    return () => clearTimeout(debounce);
  }, [selectedCategory, searchQuery]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            {isAmharic ? 'የስራ መስኮች ካታሎግ' : 'Career Exploration Catalog'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic ? 'የወደፊት የስራ መስክዎን ይምረጡ' : 'Discover What You Can Become'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {isAmharic ? 'የተለያዩ የስራ መገለጫዎችን፣ ዕለታዊ ኃላፊነቶችን እና የሚያስፈልጉ የትምህርት መስፈርቶችን በዝርዝር ያስሱ።' : 'Browse through realistic career profiles, understand daily responsibilities, and map the high school subjects and university degrees needed to get there.'}
          </p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAmharic ? 'የስራ መስክ በስም፣ በክህሎት ወይም በቁልፍ ቃላት ይፈልጉ...' : 'Search careers by title, skills (e.g. Python, empathy, design), or keywords...'}
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
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategoryClick('All')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            {isAmharic ? 'ሁሉም ዘርፎች' : 'All Fields'} ({careers.length})
          </button>
          {CAREER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
        <div>
          {isAmharic ? 'የተገኙ' : 'Showing'} <span className="font-bold text-slate-800">{careers.length}</span> {isAmharic ? 'የስራ መስኮች' : 'careers'}
          {selectedCategory !== 'All' && <span> {isAmharic ? 'በ' : 'in'} <strong className="text-indigo-600">{t(selectedCategory)}</strong></span>}
          {searchQuery && <span> {isAmharic ? 'ከፍለጋ ጋር የሚዛመዱ:' : 'matching'} "<strong className="text-slate-800">{searchQuery}</strong>"</span>}
        </div>
        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            onClick={handleClearFilters}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            {isAmharic ? 'ማጣሪያዎችን አጽዳ' : 'Clear filters'}
          </button>
        )}
      </div>

      {/* Careers Grid / Loading / Empty States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
              <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
              <div className="h-16 bg-slate-100 rounded-lg"></div>
              <div className="h-8 bg-slate-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : careers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career) => (
            <CareerCard key={career.id || career._id} career={career} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No careers found</h3>
          <p className="text-sm text-slate-500">
            No careers match your current search criteria. Try changing your search query or selecting a different category.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
