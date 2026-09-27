import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { StatusBadge } from '../components/StatusBadge';
import { CareerCard } from '../components/CareerCard';
import {
  LayoutDashboard,
  Bookmark,
  FileCheck2,
  Sparkles,
  Target,
  ArrowRight,
  Calendar,
  Clock,
  Briefcase,
  Award,
  User,
  GraduationCap
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  const [savedScholarships, setSavedScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendedCareers, setRecommendedCareers] = useState([]);
  const [matchedScholarships, setMatchedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [saved, apps, careers] = await Promise.all([
          api.getSaved(),
          api.getApplications(),
          api.getCareers({ limit: 3 })
        ]);
        setSavedScholarships(saved);
        setApplications(apps);
        setRecommendedCareers(careers.slice(0, 3));

        if (user) {
          const matches = await api.matchScholarships({
            age: user.age,
            nationality: user.nationality,
            grade: user.grade,
            preferredDestination: user.preferredCountries?.[0],
            fundingPreference: user.fundingPreference
          });
          setMatchedScholarships(matches.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const userName = user?.name || 'Student';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. WELCOME BANNER */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Student Command Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            Track your target scholarships, view upcoming deadlines, and discover new educational pathways tailored to your strengths.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0 relative z-10">
          <Link
            to="/matches"
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Target className="w-4 h-4 text-emerald-300" />
            <span>Find Scholarship Matches</span>
          </Link>
          <Link
            to="/career-quiz"
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Retake Quiz</span>
          </Link>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{savedScholarships.length}</div>
            <div className="text-xs font-medium text-slate-500">Saved Scholarships</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{applications.length}</div>
            <div className="text-xs font-medium text-slate-500">Active Applications</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{matchedScholarships.length}</div>
            <div className="text-xs font-medium text-slate-500">Eligible Matches</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {user?.grade || 'Grade 11'}
            </div>
            <div className="text-xs font-medium text-slate-500">Academic Standing</div>
          </div>
        </div>
      </div>

      {/* 2. MY CAREER INTERESTS SECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            My Career Interests
          </h2>
          <Link to="/career-quiz" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
            Update with Quiz &rarr;
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {user?.interests && user.interests.length > 0 ? (
            user.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {interest}
              </span>
            ))
          ) : (
            <div className="text-xs text-slate-500">
              No interests recorded yet. Take the Career Quiz to identify your top fields!
            </div>
          )}
        </div>
      </section>

      {/* 3. UPCOMING DEADLINES & APPLICATION TRACKER PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Deadlines */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" />
              Upcoming Deadlines
            </h2>
            <Link to="/saved" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {savedScholarships.length > 0 ? (
              savedScholarships.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.scholarship?.title || 'Scholarship'}
                    </h4>
                    <p className="text-xs text-slate-500">{item.scholarship?.destination || 'International'}</p>
                  </div>
                  <DeadlineBadge deadline={item.scholarship?.deadline} />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No deadlines saved. Explore scholarships and bookmark them to keep tabs on due dates.
              </div>
            )}
          </div>
        </section>

        {/* Application Tracker Summary */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
              Application Tracker Summary
            </h2>
            <Link to="/applications" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
              Manage Tracker &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {applications.length > 0 ? (
              applications.slice(0, 3).map((app) => {
                const total = app.checklist ? app.checklist.length : 0;
                const completed = app.checklist ? app.checklist.filter(c => c.completed).length : 0;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {app.scholarshipTitle}
                      </h4>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Documents: {completed}/{total} prepared</span>
                      <span className="font-semibold text-indigo-600">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                You haven't tracked any active applications yet.
              </div>
            )}
          </div>
        </section>

      </div>

      {/* 4. SCHOLARSHIPS FOR YOU (ELIGIBILITY MATCHES) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Scholarships For You</h2>
            <p className="text-sm text-slate-600">
              Matched according to your age ({user?.age || 17}) and nationality ({user?.nationality || 'Ethiopia'}).
            </p>
          </div>
          <Link to="/matches" className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            See all matches &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matchedScholarships.map(({ scholarship, score }) => (
            <div
              key={scholarship.id || scholarship._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {score}% Match
                  </span>
                  <DeadlineBadge deadline={scholarship.deadline} />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-1 line-clamp-2">
                  <Link to={`/scholarships/${scholarship.id || scholarship._id}`} className="hover:text-indigo-600">
                    {scholarship.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-500 mb-3">{scholarship.provider}</p>
                <p className="text-xs text-slate-600 line-clamp-2">{scholarship.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                <span className="text-xs font-semibold text-indigo-600">{scholarship.fundingType}</span>
                <Link
                  to={`/scholarships/${scholarship.id || scholarship._id}`}
                  className="text-xs font-bold text-slate-700 hover:text-indigo-600"
                >
                  View Criteria &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RECOMMENDED CAREERS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Recommended Careers</h2>
            <p className="text-sm text-slate-600">
              High-growth pathways that leverage your interests in technology, science, and leadership.
            </p>
          </div>
          <Link to="/careers" className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            Explore 16+ pathways &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCareers.map(career => (
            <CareerCard key={career.id || career._id} career={career} />
          ))}
        </div>
      </section>

    </div>
  );
};
