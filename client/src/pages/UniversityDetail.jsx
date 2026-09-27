import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { CommentSection } from '../components/CommentSection';
import { PersonalUniversityJourney } from '../components/PersonalUniversityJourney';
import { 
  Building2, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  ArrowLeft, 
  Compass, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Globe2, 
  BookOpen, 
  Award,
  ArrowRight
} from 'lucide-react';

export const UniversityDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'journey' ? 'journey' : 'official'); // 'official' | 'journey' | 'ai_suggestions'
  const [openQuestionnaireSignal, setOpenQuestionnaireSignal] = useState(0);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const res = await api.getUniversity(id);
        if (res?.university) {
          setUniversity(res.university);
        } else {
          setError('University profile not found');
        }
      } catch (err) {
        console.error('Error fetching university:', err);
        setError('Failed to load university details');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
        <div className="h-64 bg-white rounded-3xl border border-slate-200"></div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">University Not Found</h2>
        <p className="text-sm text-slate-500">
          We could not find the university you are looking for. Please browse our university directory.
        </p>
        <Link
          to="/universities"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Universities</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          to="/universities"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Universities</span>
        </Link>
      </div>

      {/* Prominent Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 text-white relative overflow-hidden shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
                {university.country}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {university.city}
              </span>
              {university.needBlindInternational && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  Need-Blind for All
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight break-words">
              {university.name}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              {university.overview}
            </p>
          </div>

          {/* PROMINENT PRIMARY CALL TO ACTION BUTTON */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 text-center space-y-3.5 max-w-sm w-full">
            <div className="text-xs text-indigo-200 font-semibold uppercase tracking-wider">
              Personalized Mentorship
            </div>
            <h3 className="text-lg font-black text-white">
              Planning for {university.name}?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Answer quick questions about your subjects, time, and passions to receive an authentic exploration roadmap.
            </p>
            <button
              onClick={() => {
                setActiveTab('journey');
                setOpenQuestionnaireSignal(Date.now());
                setTimeout(() => {
                  document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
              <span>Build My University Journey</span>
              <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
            </button>
            <p className="text-[11px] text-slate-400">
              Adapts to your current grade (9–12) & available resources
            </p>
          </div>

        </div>

        {/* Glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Safety & Philosophy Disclaimer Box */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Important Mentorship & Admissions Transparency</span>
        </div>
        <p className="text-amber-800 leading-relaxed">
          Universities evaluate applicants holistically, and there is <strong>no secret formula or guaranteed extracurricular activity list</strong> that ensures admission. This tool uses publicly stated admissions principles and preparatory recommendations to help you discover authentic interests, conduct meaningful projects, and challenge yourself academically.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Tabs for Official Information vs AI Exploration Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Navigation Segment Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 pb-2.5 sm:pb-3 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap">
            <button
              onClick={() => setActiveTab('official')}
              className={`pb-2 text-xs sm:text-sm font-bold transition-all relative shrink-0 ${
                activeTab === 'official'
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Official Information</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Verified
                </span>
              </div>
              {activeTab === 'official' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('journey')}
              className={`pb-2 text-xs sm:text-sm font-bold transition-all relative shrink-0 ${
                activeTab === 'journey'
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Personal University Journey</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                  AI Powered
                </span>
              </div>
              {activeTab === 'journey' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ai_suggestions')}
              className={`pb-2 text-xs sm:text-sm font-bold transition-all relative shrink-0 ${
                activeTab === 'ai_suggestions'
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>AI Exploration Guidance</span>
              </div>
              {activeTab === 'ai_suggestions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></div>
              )}
            </button>
          </div>

          {/* TAB 1: OFFICIAL UNIVERSITY INFORMATION */}
          {activeTab === 'official' && (
            <div className="space-y-6">
              
              {/* Notice tag */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Compiled from official university admissions portals & university bulletins</span>
              </div>

              {/* Academic Prerequisites */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Academic Preparation & High-School Coursework
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {university.academicRequirements}
                </p>
              </section>

              {/* Application Components & Deadlines */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Application Deadlines & Required Materials
                </h3>
                
                {/* Deadlines Table */}
                {university.deadlines && university.deadlines.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {university.deadlines.map((dl, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">{dl.round}</span>
                        <div className="text-base font-black text-slate-900">{dl.deadline}</div>
                        <div className="text-xs text-slate-500">Decisions: {dl.notification}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 text-sm text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Required Documents: </strong>
                  {university.applicationRequirements}
                </div>
              </section>

              {/* Testing Policy */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Standardized Testing & English Language Policies
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {university.testingRequirements}
                </p>
              </section>

              {/* Financial Aid & Scholarships */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Financial Aid & Affordability
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {university.financialAid}
                </p>
              </section>

              {/* International Students */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-purple-600" />
                  Information for International Applicants
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {university.internationalInfo}
                </p>
              </section>

            </div>
          )}

          {/* TAB 2: PERSONAL UNIVERSITY JOURNEY */}
          {activeTab === 'journey' && (
            <div id="journey-section" className="space-y-6">
              <PersonalUniversityJourney
                university={university}
                openQuestionnaireSignal={openQuestionnaireSignal}
                onSwitchTab={(tab) => setActiveTab(tab)}
              />
            </div>
          )}

          {/* TAB 3: AI-GENERATED EXPLORATION SUGGESTIONS */}
          {activeTab === 'ai_suggestions' && (
            <div className="space-y-6">
              
              {/* Notice Tag */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>AI-Generated Guidance — Suggestions to develop authentic intellectual curiosity</span>
              </div>

              {/* Exploration Principles */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-lg font-black text-slate-900">
                  What Meaningful Preparation Looks Like in High School
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Top institutions look for evidence of <strong>intellectual vitality</strong>—the habit of pursuing ideas deeply because you genuinely care about them, rather than ticking boxes on an extracurricular resume.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      1. Deep Curiosity Over Quantity
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Two activities pursued with initiative and reflection reflect far more authenticity than 10 passive club memberships.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      2. Local Community Impact
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Identify real problems in your school, town, or neighborhood. Solving local issues with modest resources demonstrates true initiative.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      3. Unassigned Learning
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Read books, audit free online university lectures, or write research summaries on questions that fascinate you outside school homework.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      4. Ongoing Reflection
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Keep a private journal or project portfolio documenting what surprised you, what obstacles you overcame, and what you learned.
                    </p>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('journey');
                      setOpenQuestionnaireSignal(Date.now());
                      setTimeout(() => {
                        document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-amber-300" />
                    <span>Build My University Journey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Student Q&A and Discussions Section for this University */}
          <div className="pt-4">
            <CommentSection
              targetType="university"
              targetId={university.slug || university.id}
              targetTitle={university.name}
            />
          </div>

        </div>

        {/* Right Sidebar: Key Facts & Official Links */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">University Snapshot</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Admissions Rate:</span>
                <span className="font-bold text-slate-800">{university.acceptanceRate || 'Highly Selective'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Graduation Rate:</span>
                <span className="font-bold text-slate-800">{university.graduationRate || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Tuition / Costs:</span>
                <span className="font-semibold text-slate-800 text-right">{university.averageTuition}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">International Aid:</span>
                <span className="font-bold text-emerald-700">
                  {university.needBlindInternational ? 'Need-Blind (All)' : '100% Need Met'}
                </span>
              </div>
            </div>

            {/* Official Links */}
            <div className="pt-2 space-y-2">
              {university.admissionsUrl && (
                <a
                  href={university.admissionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <span>Official Admissions Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {university.officialWebsite && (
                <a
                  href={university.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <span>Main University Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Popular Majors */}
          {university.popularMajors && university.popularMajors.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Renowned Majors & Fields
              </h3>
              <p className="text-xs text-slate-500">
                Undergraduate majors with world-leading faculties:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {university.popularMajors.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Journey Callout Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white text-center space-y-3 shadow-lg shadow-indigo-100">
            <Sparkles className="w-8 h-8 text-amber-300 mx-auto" />
            <h4 className="font-bold text-base">Ready to chart your path?</h4>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Build your customized high-school timeline, identify a passion project, and match with verified opportunities.
            </p>
            <button
              onClick={() => {
                setActiveTab('journey');
                setOpenQuestionnaireSignal(Date.now());
                setTimeout(() => {
                  document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="inline-block w-full py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow cursor-pointer text-center"
            >
              Build My University Journey
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
