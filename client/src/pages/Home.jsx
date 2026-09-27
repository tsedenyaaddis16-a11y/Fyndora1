import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { CareerCard } from '../components/CareerCard';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { CAREER_CATEGORIES } from '../data/mockData';
import {
  Compass,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Users,
  Search,
  Globe2,
  GraduationCap,
  FileCheck,
  Target,
  Briefcase
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CATEGORY_ICONS = {
  Technology: '💻',
  'Medicine & Health': '🩺',
  Engineering: '⚙️',
  Business: '📈',
  Science: '🔬',
  Law: '⚖️',
  'Arts & Media': '🎬',
  Education: '📚',
  'Social Sciences': '🌍',
  Design: '🎨',
};

export const Home = () => {
  const { t, isAmharic } = useLanguage();
  const [featuredScholarships, setFeaturedScholarships] = useState([]);
  const [featuredCareers, setFeaturedCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scholarships, careers] = await Promise.all([
          api.getScholarships({ limit: 4 }),
          api.getCareers({ limit: 4 })
        ]);
        setFeaturedScholarships(scholarships.slice(0, 4));
        setFeaturedCareers(careers.slice(0, 4));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs sm:text-sm font-semibold mb-6 animate-bounce">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isAmharic ? 'ለከፍተኛ ሁለተኛ ደረጃ ተማሪዎች በልዩ ሁኔታ የተዘጋጀ' : 'Built Specifically For High-School Students Worldwide'}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            {isAmharic ? (
              <span>{t('heroTitle')}</span>
            ) : (
              <>
                Discover Your Future. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                  Find Your Path.
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
            <Link
              to="/careers"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              <span>{t('btnExploreCareers')}</span>
            </Link>

            <Link
              to="/scholarships"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5 text-indigo-600" />
              <span>{t('btnFindScholarships')}</span>
            </Link>

            <Link
              to="/career-quiz"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-base shadow-lg shadow-purple-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{t('btnTakeQuiz')}</span>
            </Link>

            <Link
              to="/university-mentor"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg shadow-slate-300 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-amber-300" />
              <span>{t('btnUniversityMentor')}</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto pt-8 border-t border-slate-200/60">
            <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100">
              <div className="text-3xl font-black text-indigo-600 mb-1">16+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Career Pathways</div>
            </div>
            <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100">
              <div className="text-3xl font-black text-violet-600 mb-1">14+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Scholarships</div>
            </div>
            <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100">
              <div className="text-3xl font-black text-pink-600 mb-1">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Free Student Tools</div>
            </div>
            <div className="p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-100">
              <div className="text-3xl font-black text-emerald-600 mb-1">10</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Domains</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE YOUR FUTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              Self-Discovery First
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Explore Your Future Based on Your Real Interests & Strengths
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Choosing a future path shouldn't feel like a guessing game. Fyndora helps high school students bridge the gap between what you enjoy studying today and viable, impact-driven careers tomorrow.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="font-bold text-amber-400 mb-1">1. Identify Strengths</div>
                <p className="text-xs text-slate-300">Discover which school subjects and natural inclinations align with real industries.</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="font-bold text-cyan-400 mb-1">2. Map Prerequisites</div>
                <p className="text-xs text-slate-300">See exactly which university degrees, majors, and skills you will need.</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="font-bold text-emerald-400 mb-1">3. Secure Funding</div>
                <p className="text-xs text-slate-300">Uncover fully funded scholarships that cover tuition, flights, and living costs.</p>
              </div>
            </div>
            <div className="pt-4">
              <Link
                to="/matches"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold hover:bg-slate-100 transition-colors shadow-md"
              >
                <span>Check Personal Match Score</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE CAREERS (POPULAR CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Browse By Domain</div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Career Fields</h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Discover pathways across 10 vital disciplines with realistic education blueprints and skill requirements.
            </p>
          </div>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>Browse all careers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 10 Popular Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-12">
          {CAREER_CATEGORIES.map((category) => (
            <Link
              key={category}
              to={`/careers?category=${encodeURIComponent(category)}`}
              className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-50 transition-all text-center flex flex-col items-center justify-center gap-2"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {CATEGORY_ICONS[category] || '💡'}
              </span>
              <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {category}
              </span>
            </Link>
          ))}
        </div>

        {/* Featured Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCareers.map(career => (
            <CareerCard key={career.id || career._id} career={career} />
          ))}
        </div>
      </section>

      {/* 4. FIND SCHOLARSHIPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Financial Freedom</div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Featured Scholarships & Awards</h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Pre-vetted opportunities with verified deadlines, eligibility criteria, and comprehensive coverage.
            </p>
          </div>
          <Link
            to="/scholarships"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>Search all scholarships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Scholarship Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredScholarships.map(scholarship => (
            <ScholarshipCard key={scholarship.id || scholarship._id} scholarship={scholarship} />
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">The Fyndora Journey</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
            How It Works in 5 Clear Steps
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            A structured roadmap to take you from uncertain high-school student to prepared applicant.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:shadow-lg transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Discover Interests</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take the interactive career quiz to explore what you enjoy and analyze your study strengths.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:shadow-lg transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-black text-xl mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Explore Careers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learn daily tasks, required skills, and realistic workplaces without inflated hype.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:shadow-lg transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-black text-xl mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Study Pathways</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand recommended high school subjects and college majors that lead to your goal.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:shadow-lg transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl mb-4">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Find Scholarships</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Search fully funded awards and match your nationality, age, and grade with verified opportunities.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 hover:shadow-lg transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl mb-4">
              5
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Prepare Applications</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Save deadlines, manage document checklists, and track each stage until your submission.
            </p>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-12 text-white text-center flex flex-col items-center justify-center space-y-4 shadow-xl shadow-indigo-200">
          <h3 className="text-2xl sm:text-3xl font-black">Ready to unlock your academic future?</h3>
          <p className="text-indigo-100 max-w-xl text-sm sm:text-base">
            Join thousands of high-school students charting clear, debt-free paths to world-class education.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <Link
              to="/career-quiz"
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-slate-100 transition-colors shadow"
            >
              Start Free Career Quiz
            </Link>
            <Link
              to="/scholarships"
              className="px-6 py-3 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold border border-indigo-400 transition-colors"
            >
              Browse Scholarships
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
