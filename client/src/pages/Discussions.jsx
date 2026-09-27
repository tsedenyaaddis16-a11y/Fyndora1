import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CommentSection } from '../components/CommentSection';
import { useLanguage } from '../context/LanguageContext';
import { 
  MessagesSquare, 
  Search, 
  Sparkles, 
  Compass, 
  GraduationCap, 
  Award, 
  HelpCircle, 
  Flame, 
  Filter,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Discussions', icon: MessagesSquare },
  { id: 'career', label: 'Careers', icon: Compass },
  { id: 'scholarship', label: 'Scholarships', icon: GraduationCap },
  { id: 'opportunity', label: 'Opportunities', icon: Award },
  { id: 'general', label: 'General Q&A', icon: HelpCircle },
];

export const Discussions = () => {
  const { tr, isAmharic } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllComments = async () => {
    try {
      setLoading(true);
      const res = await api.getComments('all', 'all', 'newest');
      if (res?.allCommentsFlat) {
        setAllComments(res.allCommentsFlat);
      }
    } catch (e) {
      console.error('Error loading discussions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  // Filter comments for exploration preview
  const filteredComments = allComments.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.targetType === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.targetTitle && c.targetTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {tr('Fyndora Student Community')}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {tr('Connect, Inquire, and Learn Together')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {tr('Ask questions about career paths, get real tips on scholarship essays, and share advice with other ambitious high school students and verified academic advisors.')}
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Grid: General Forum on Left + Hot Topics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: General Community Discussion Board */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <MessagesSquare className="w-6 h-6 text-indigo-600" />
                {tr('Community Q&A Board')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {tr('Post questions or advice visible to the entire Fyndora student community.')}
              </p>
            </div>

            {/* Comment Section Embedded for Community */}
            <CommentSection
              targetType="general"
              targetId="community"
              targetTitle={tr('Community Forum')}
            />
          </div>
        </div>

        {/* Right Column: Search, Category Filters, and Quick Links to Discussed Items */}
        <div className="space-y-6">
          
          {/* Quick Filter */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-600" />
              {tr('Filter by Category')}
            </h3>
            
            <div className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{tr(cat.label)}</span>
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {cat.id === 'all'
                        ? allComments.length
                        : allComments.filter(c => c.targetType === cat.id).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Direct Links to Discussed Careers & Scholarships */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                {tr('Active Topics')}
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">{tr('Join Conversation')}</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <Link
                to="/careers/software-engineer"
                className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100 transition-colors group"
              >
                <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-indigo-600">
                  <span>💻 {tr('Software Engineering')}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {tr('Discussions on math requirements and CS vs SE')}
                </p>
              </Link>

              <Link
                to="/careers/ai-specialist"
                className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100 transition-colors group"
              >
                <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-indigo-600">
                  <span>🤖 {tr('AI & Machine Learning')}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {tr('High-school ML starters and Kaggle advice')}
                </p>
              </Link>

              <Link
                to="/scholarships/mastercard-foundation-scholars"
                className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100 transition-colors group"
              >
                <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-indigo-600">
                  <span>🎓 {tr('Mastercard Foundation')}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {tr('Full funding coverage, flights, and essays')}
                </p>
              </Link>

              <Link
                to="/scholarships/gates-cambridge"
                className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100 transition-colors group"
              >
                <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-indigo-600">
                  <span>🏛️ {tr('Gates Cambridge')}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {tr('Leadership essays and interview rounds')}
                </p>
              </Link>

              <Link
                to="/opportunities"
                className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100 transition-colors group"
              >
                <div className="flex items-center justify-between font-bold text-slate-800 group-hover:text-indigo-600">
                  <span>🏆 {tr('Global Competitions')}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {tr('IMO Math Olympiad and summer prep')}
                </p>
              </Link>
            </div>
          </div>

          {/* Student Community Guidelines */}
          <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-xs text-indigo-950">
            <h4 className="font-bold flex items-center gap-1.5 text-indigo-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {tr('Community Guidelines')}
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              • {tr('Share honest advice and constructive feedback.')}<br />
              • {tr('No spam, self-promotion, or abusive comments.')}<br />
              • {tr('Always double check official university websites for final deadlines.')}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
