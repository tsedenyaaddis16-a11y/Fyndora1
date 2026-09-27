import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Briefcase,
  CheckCircle,
  Building,
  Sparkles,
  ExternalLink,
  Share2,
  Users,
  Compass,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { CommentSection } from '../components/CommentSection';

export const CareerDetail = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareer = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getCareerById(id);
        setCareer(data);
      } catch (err) {
        setError('Career profile not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Career pathway link copied to clipboard!', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-slate-200 rounded"></div>
        <div className="h-12 w-3/4 bg-slate-200 rounded-xl"></div>
        <div className="h-32 bg-slate-100 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl"></div>
          <div className="h-64 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Career Not Found</h2>
        <p className="text-slate-600 text-sm">
          We couldn't locate the requested career pathway. It may have been relocated or renamed.
        </p>
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Career Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/careers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all careers
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share Pathway
        </button>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            {career.category}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{career.title}</h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-2">
            {career.description}
          </p>

          {/* Call to Action: Is this career right for me? */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/career-quiz"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Is this career right for me? (Take Quiz)</span>
            </Link>
            <Link
              to={`/scholarships?search=${encodeURIComponent(career.title)}`}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Find Scholarships in this Field</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Responsibilities & Skills */}
        <div className="md:col-span-2 space-y-8">
          
          {/* 1. What people in this career do */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              What People in this Career Do
            </h2>
            <p className="text-sm text-slate-600">
              Typical day-to-day responsibilities and tasks professionals handle in this field:
            </p>
            <ul className="space-y-3 pt-2">
              {career.responsibilities && career.responsibilities.map((task, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. Educational Roadmap (High School & University) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              Academic Preparation & Degrees
            </h2>

            {/* High School Subjects */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 space-y-2">
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-700" />
                Recommended High-School Subjects
              </h3>
              <p className="text-xs text-amber-800">
                Subjects you should focus on during secondary school to build the right foundation:
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {career.highSchoolSubjects && career.highSchoolSubjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-semibold border border-amber-200 shadow-2xs"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* University Majors */}
            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 space-y-2">
              <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-700" />
                University Majors & Degrees
              </h3>
              <p className="text-xs text-indigo-800">
                Undergraduate degrees and university programs that directly lead into this career:
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {career.universitySubjects && career.universitySubjects.map((major, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-semibold border border-indigo-200 shadow-2xs"
                  >
                    {major}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Recommended Learning Resources */}
          {career.resources && career.resources.length > 0 && (
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Recommended Student Learning Resources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {career.resources.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
                  >
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                      {res.name}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Student Discussion & Questions Section */}
          <CommentSection
            targetType="career"
            targetId={career.id || id}
            targetTitle={career.title}
          />
        </div>

        {/* Right Sidebar: Skills, Workplaces, Related Careers */}
        <div className="space-y-6">
          
          {/* Important Skills */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">Essential Skills</h3>
            <p className="text-xs text-slate-500">
              Both technical mastery and interpersonal soft skills required:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {career.skills && career.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Possible Workplaces */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              Where You Might Work
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              {career.workplaces && career.workplaces.map((place, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  <span>{place}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Careers */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-slate-500" />
              Related Careers
            </h3>
            <p className="text-xs text-slate-500">
              If you like this, you might also be interested in:
            </p>
            <div className="space-y-2 pt-2">
              {career.relatedCareers && career.relatedCareers.map((rel, idx) => (
                <Link
                  key={idx}
                  to={`/careers?search=${encodeURIComponent(rel)}`}
                  className="block p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-xs font-semibold text-slate-700"
                >
                  {rel} &rarr;
                </Link>
              ))}
            </div>
          </div>

          {/* Career Quiz Callout */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white text-center space-y-3 shadow-lg shadow-indigo-100">
            <Sparkles className="w-8 h-8 text-amber-300 mx-auto" />
            <h4 className="font-bold text-base">Unsure about this path?</h4>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Answer 8 quick questions about your natural passions, study habits, and preferences.
            </p>
            <Link
              to="/career-quiz"
              className="inline-block w-full py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow"
            >
              Start Free Quiz
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
