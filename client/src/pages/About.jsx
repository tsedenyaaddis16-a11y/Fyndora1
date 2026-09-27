import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, ShieldCheck, Heart, Target, Users, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-indigo-600" />
          Our Mission & Philosophy
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Empowering High-School Students to Chart Their Own Educational Destiny
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Fyndora was created for students who have ambition and curiosity, but lack clear guidance on which careers exist, what degrees are needed, or where to find scholarships.
        </p>
      </div>

      {/* The 7-Stage Student Journey */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            The Fyndora Guiding Framework
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            We reject the generic job-board mindset. We guide students through an intentional sequence:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Discover Yourself</h3>
              <p className="text-xs text-slate-600 mt-0.5">Explore your genuine interests, favorite subjects, and working styles through our career quiz.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Explore Careers</h3>
              <p className="text-xs text-slate-600 mt-0.5">Learn what professionals actually do day-to-day, without inflated or false salary promises.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Understand Study Requirements</h3>
              <p className="text-xs text-slate-600 mt-0.5">Know which high-school subjects to take and which undergraduate degrees pave the way.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              4
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Find Educational Opportunities</h3>
              <p className="text-xs text-slate-600 mt-0.5">Explore summer academies, pre-university diplomas, olympiads, and research fellowships.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              5
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Find Scholarships</h3>
              <p className="text-xs text-slate-600 mt-0.5">Search verified awards that match your nationality, current grade, and financial need.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              6
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Track Opportunities</h3>
              <p className="text-xs text-slate-600 mt-0.5">Save deadlines with dynamic countdown badges so you never miss an application deadline.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 md:col-span-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              7
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Prepare Applications</h3>
              <p className="text-xs text-slate-600 mt-0.5">Organize transcripts, recommendation letters, personal essays, and follow step-by-step checklists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Verified & Honest Data</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We never invent scholarship requirements or links. Every opportunity references official portals and shows clear verification dates.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Unbiased Alignment</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We do not tell any student that one career is objectively "best" for them. We empower you to explore matches based on your individual strengths.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">100% Student-Centric</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Free forever for students. Designed for learners in Ethiopia, across Africa, and worldwide seeking to transcend financial barriers.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center space-y-4 pt-6">
        <h3 className="text-2xl font-black text-slate-900">Ready to begin your journey?</h3>
        <div className="flex justify-center gap-3">
          <Link
            to="/career-quiz"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow"
          >
            Take Career Quiz
          </Link>
          <Link
            to="/scholarships"
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border shadow-xs"
          >
            Browse Scholarships
          </Link>
        </div>
      </div>

    </div>
  );
};
