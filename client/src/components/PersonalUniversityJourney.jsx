import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { generateUniversityJourney } from '../services/journeyEngine';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  Clock,
  DollarSign,
  CheckCircle2,
  Circle,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Calendar,
  FolderPlus,
  MessageSquare,
  Send,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  ExternalLink,
  Plus,
  AlertCircle,
  FileCheck,
  Award,
  Check,
  Flame,
  Zap,
  RefreshCw,
  HeartHandshake,
  Target
} from 'lucide-react';

const COMMON_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature',
  'Economics', 'Computer Science / ICT', 'History', 'Geography', 'Civics / Government',
  'Business Studies', 'Psychology', 'Art & Design', 'Foreign Languages'
];

const SKILL_OPTIONS = [
  'Coding & Web Development',
  'Data Analysis & Spreadsheets',
  'Public Speaking & Debate',
  'Essay & Scientific Writing',
  'Graphic Design & Media',
  'Team Leadership & Organizing',
  'Scientific Experimentation',
  'Mathematics & Logic Puzzles'
];

export const PersonalUniversityJourney = ({ university, onSwitchTab, openQuestionnaireSignal }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const uniName = university?.name || 'Target University';
  const uniSlug = university?.slug || university?.id || 'university';

  // Persistent storage key per university and user
  const storageKey = `fyndora_journey_${uniSlug}_${user?.email || 'guest'}`;

  // Journey Questionnaire State (All 17 asked fields)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey + '_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved profile:', e);
    }
    return {
      grade: user?.grade || 'Grade 11',
      age: user?.age || 17,
      strongestSubjects: ['Mathematics', 'Physics'],
      favoriteSubjects: ['Economics', 'Mathematics'],
      academicInterests: 'Quantitative Economics, Applied Tech, and Community Data Systems',
      careerInterests: 'Software Engineering, Financial Economics, or Tech Entrepreneurship',
      hobbies: 'Coding tutorials, reading non-fiction, logic puzzles, chess, helping peers with math',
      existingExtracurriculars: 'School Math Club, volunteer peer tutor for Grade 9 students',
      leadershipExperiences: 'Co-founded informal after-school study group for math competitions',
      volunteering: 'Volunteer literacy library helper on weekends, tutoring younger students',
      competitions: 'Participated in regional High School Math Olympiad (top 15%)',
      researchProjects: 'Wrote a 5-page school essay analyzing local consumer price inflation',
      skills: ['Mathematics & Logic Puzzles', 'Data Analysis & Spreadsheets', 'Coding & Web Development'],
      whatAchieved: 'Top 5% class rank, helped 4 Grade 9 students improve algebra exam scores by 15 points',
      wantToExplore: 'Conduct a real community survey, understand economic systems, and build an open educational tool',
      weeklyHours: '4–6 hours/week (Balanced)',
      resources: 'Personal laptop available, home WiFi and school computer lab',
      costConstraint: 'Need 100% free opportunities ($0)',
      needFree: true,
    };
  });

  // Questionnaire Modal / Flow Mode
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [qStep, setQStep] = useState(1); // 1 = Academic & Passions, 2 = Activities & Achievements, 3 = Resources & Constraints

  useEffect(() => {
    if (openQuestionnaireSignal) {
      setQStep(1);
      setIsQuestionnaireOpen(true);
    }
  }, [openQuestionnaireSignal]);

  // Active Journey Data
  const [journeyData, setJourneyData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey + '_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading saved journey data:', e);
    }
    // Generate initial journey data from profile
    return generateUniversityJourney(university, profile, []);
  });

  // Active Selected Passion Project
  const [activeProjectId, setActiveProjectId] = useState(() => {
    return journeyData?.passionProjects?.[0]?.id || 'proj_1';
  });

  const activePassionProject = journeyData?.passionProjects?.find(p => p.id === activeProjectId) || journeyData?.passionProjects?.[0];

  // Action Plan Interactive Tasks
  const [tasks, setTasks] = useState(() => journeyData?.actionPlan || []);

  useEffect(() => {
    if (journeyData?.actionPlan) {
      setTasks(journeyData.actionPlan);
    }
  }, [journeyData]);

  // Progress Updates State
  const [progressUpdates, setProgressUpdates] = useState(() => journeyData?.progressUpdates || []);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [newProgress, setNewProgress] = useState({
    activityTitle: 'Student Financial Literacy Survey (Pilot Phase)',
    whatDone: '',
    learned: '',
    changedInterest: 'Increased my interest in practical economics and public presentation',
    date: new Date().toLocaleDateString(),
  });

  // AI Mentor Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'mentor',
      text: `Hello! I'm your University Journey Mentor for **${uniName}**.\n\nI've reviewed your background in **${profile.grade}**, your focus on **${journeyData?.interestsToExplore?.[0]?.title || 'your chosen direction'}**, and your commitment of **${profile.weeklyHours}**.\n\nHow can I help you navigate your next steps, adjust your project, or answer any questions about authentic high-school preparation?`,
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Sync to localStorage
  const saveStateToStorage = (updatedJourney, updatedProfile, updatedTasks, updatedUpdates) => {
    try {
      localStorage.setItem(storageKey + '_profile', JSON.stringify(updatedProfile || profile));
      localStorage.setItem(storageKey + '_data', JSON.stringify({
        ...updatedJourney,
        actionPlan: updatedTasks || tasks,
        progressUpdates: updatedUpdates || progressUpdates,
      }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  // Handle Form Submission for Questionnaire
  const handleGenerateJourney = (e) => {
    if (e) e.preventDefault();
    const newJourney = generateUniversityJourney(university, profile, progressUpdates);
    setJourneyData(newJourney);
    setTasks(newJourney.actionPlan);
    setIsQuestionnaireOpen(false);
    saveStateToStorage(newJourney, profile, newJourney.actionPlan, progressUpdates);
    addToast(`Your personalized Journey to ${uniName} has been generated!`, 'success');
  };

  // Toggle Action Task Status: Not Started -> In Progress -> Completed
  const handleToggleTaskStatus = (taskId) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'not_started' 
          ? 'in_progress' 
          : t.status === 'in_progress' 
          ? 'completed' 
          : 'not_started';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(updated);
    saveStateToStorage(journeyData, profile, updated, progressUpdates);
  };

  // Submit Progress Update
  const handleAddProgressUpdate = (e) => {
    e.preventDefault();
    if (!newProgress.whatDone.trim()) {
      addToast('Please describe what you actually did.', 'error');
      return;
    }

    const item = {
      id: 'update_' + Date.now(),
      ...newProgress,
      date: new Date().toLocaleDateString(),
    };

    const updatedList = [item, ...progressUpdates];
    setProgressUpdates(updatedList);

    // Re-generate suggestions incorporating new learnings
    const refreshedJourney = generateUniversityJourney(university, profile, updatedList);
    setJourneyData(refreshedJourney);
    setTasks(refreshedJourney.actionPlan);

    saveStateToStorage(refreshedJourney, profile, refreshedJourney.actionPlan, updatedList);

    setNewProgress({
      activityTitle: activePassionProject?.title || 'Passion Project Task',
      whatDone: '',
      learned: '',
      changedInterest: 'Reinforced my confidence and clarified my next steps',
      date: new Date().toLocaleDateString(),
    });
    setShowProgressForm(false);
    addToast('Progress recorded! Recommendations and roadmap have been updated.', 'success');

    // Add mentor chat acknowledgment
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'mentor',
        text: `Great work documenting your milestone on **"${item.activityTitle}"**! Reflecting on what you actually learned is what builds genuine intellectual maturity. I've updated your journey dashboard with fresh next steps.`,
        time: 'Just now'
      }
    ]);
  };

  // Send AI Mentor Chat
  const handleSendChat = async (messageText) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    setChatInput('');
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: textToSend.trim(), time: 'Just now' }
    ]);
    setChatLoading(true);

    try {
      const res = await api.sendMentorChat(textToSend.trim(), {
        universityName: uniName,
        currentGrade: profile.grade,
        weeklyHours: profile.weeklyHours,
        chosenDirection: journeyData?.interestsToExplore?.[0]?.title,
        passionProject: activePassionProject,
        needFree: profile.costConstraint?.includes('free'),
      });

      if (res?.reply) {
        setChatMessages(prev => [
          ...prev,
          { sender: 'mentor', text: res.reply, time: 'Just now' }
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'mentor',
          text: `Focus on what makes you curious and take one small tangible step this week in your project. Consistency with ${profile.weeklyHours} will yield meaningful results.`,
          time: 'Just now'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const taskProgressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-10">

      {/* ========================================================================= */}
      {/* 0. DISCLAIMER & PHILOSOPHY NOTICE (MANDATORY TRANSPARENCY) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50/80 border border-amber-200/90 text-amber-950 space-y-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-amber-900 tracking-tight">
              Official University Information vs. AI-Generated Personalized Suggestions
            </h4>
            <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
              Transparency & Authentic Mentorship Policy
            </span>
          </div>
        </div>

        <p className="text-xs text-amber-900 leading-relaxed">
          This feature <strong>does NOT claim that completing these activities guarantees admission to {uniName}</strong>, nor does it manufacture a formulaic application. The purpose is to help students explore authentic interests, develop meaningful self-directed experiences, and prepare thoughtfully for university — not to manufacture an application.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
          <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-slate-700"><strong>Official Information:</strong> Verifiable prerequisites, deadlines, and aid policies.</span>
          </div>
          <div className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-200/60">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-slate-700"><strong>Personal Journey:</strong> AI-powered exploration ideas tailored to your passions.</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DASHBOARD HERO HEADER: “Your Journey to [University Name]” */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-xl space-y-5 sm:space-y-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2.5 sm:space-y-3 max-w-2xl">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                Personal University Journey
              </span>
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-[11px] sm:text-xs font-semibold">
                Grade: {profile.grade}
              </span>
              <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] sm:text-xs font-semibold">
                Time: {profile.weeklyHours}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white break-words">
              Your Journey to {uniName}
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              A tailored roadmap focused on intellectual vitality, authentic community projects, and manageable weekly progress adapted to your resources.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 relative z-10 w-full sm:w-auto">
            <button
              onClick={() => {
                setQStep(1);
                setIsQuestionnaireOpen(true);
              }}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Update My Questionnaire</span>
            </button>
            <button
              onClick={() => setShowProgressForm(true)}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Log Progress Update</span>
            </button>
          </div>
        </div>

        {/* Action Plan Quick Progress Bar */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Target className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Monthly Action Tasks: <strong>{completedCount} of {tasks.length} Completed</strong></span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 sm:max-w-xs">
            <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPercent}%` }}
              ></div>
            </div>
            <span className="font-bold text-amber-300 shrink-0">{taskProgressPercent}% on track</span>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* ========================================================================= */}
      {/* 1. INTERESTS TO EXPLORE (2–4 AREAS) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Interests to Explore
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Curated multidisciplinary areas that connect your favorite subjects with real-world problems.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {journeyData?.interestsToExplore?.length || 0} Recommended Focus Areas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {journeyData?.interestsToExplore?.map((area, idx) => (
            <div
              key={area.id || idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {area.matchScore}% Resonance
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>

                <h4 className="text-base font-black text-slate-900 leading-snug">
                  {area.title}
                </h4>

                {/* “WHY THIS?” CALLOUT */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Why This?</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {area.whyThis}
                  </p>
                </div>

                {/* Core Competencies */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Key Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {area.competencies?.map((c, cIdx) => (
                      <span key={cIdx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. RECOMMENDED EXTRACURRICULARS (SPECIFIC, NOT GENERIC!) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Recommended Extracurriculars
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Realistic, high-impact activities. No generic suggestions like “join a club” — here is exactly what to do.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            100% Free Opportunities Only ($0)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {journeyData?.recommendedExtracurriculars?.map((ec, idx) => (
            <div
              key={ec.id || idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold">
                    {ec.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ec.timeCommitment}</span>
                  </div>
                </div>

                <h4 className="text-lg font-black text-slate-900">
                  {ec.title}
                </h4>

                {/* EXACTLY WHAT TO DO */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <strong className="text-slate-900 block font-bold">
                    Exactly What You Could Do:
                  </strong>
                  <p className="text-slate-700 leading-relaxed text-xs">
                    {ec.exactlyWhatToDo}
                  </p>
                </div>

                {/* “WHY THIS?” */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Why This Recommendation?</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    {ec.whyThis}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-emerald-700">{ec.cost}</span>
                <span className="text-[11px] text-slate-400">Target Outcome: {ec.expectedOutcome?.slice(0, 32)}...</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PASSION PROJECT IDEAS (3–5 REALISTIC IDEAS) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Passion Project Ideas
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Generated from: Student Interest + Skills + Available Resources + Real-World Problems.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
            Select one project to focus your roadmap
          </span>
        </div>

        {/* Featured Project Showcase */}
        {activePassionProject && (
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                Active Focus Project
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {activePassionProject.cost}
              </span>
            </div>

            <div className="space-y-2 relative z-10">
              <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {activePassionProject.title}
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                <strong className="text-amber-300">Why It Fits You: </strong>
                {activePassionProject.whyFits}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 text-xs">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">Difficulty Level</span>
                <span className="font-bold text-white">{activePassionProject.difficulty}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">Estimated Timeline</span>
                <span className="font-bold text-white">{activePassionProject.estimatedTime}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">Possible Final Outcome</span>
                <span className="font-bold text-white truncate block">{activePassionProject.possibleOutcome}</span>
              </div>
            </div>

            {/* First 3 Steps */}
            <div className="space-y-2.5 pt-2 relative z-10">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                First 3 Steps to Launch This Project:
              </h5>
              <div className="space-y-2">
                {activePassionProject.firstSteps?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Final Outcome Box */}
            <div className="p-3.5 bg-indigo-950/80 rounded-2xl border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2.5 relative z-10">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Possible Final Outcome: </strong>{activePassionProject.possibleOutcome}
              </span>
            </div>
          </div>
        )}

        {/* Other Generated Passion Projects Carousel / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {journeyData?.passionProjects?.map((proj) => {
            const isSelected = activeProjectId === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => {
                  setActiveProjectId(proj.id);
                  addToast(`Active focus set to: ${proj.title}`, 'info');
                }}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-indigo-50/50 border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                      {proj.difficulty}
                    </span>
                    <span className="text-emerald-700 font-semibold">{proj.cost}</span>
                  </div>

                  <h5 className="text-sm font-black text-slate-900 leading-snug">
                    {proj.title}
                  </h5>

                  <p className="text-xs text-slate-600 line-clamp-3">
                    {proj.whyFits}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{proj.estimatedTime}</span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {isSelected ? '✓ Active Focus' : 'Click to Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HIGH-SCHOOL ROADMAP (GRADE-ADAPTED TIMELINE) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">4</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                High-School Roadmap for {profile.grade}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automatically adapted timeline starting from your current grade level.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
            {profile.grade} → Grade 12 Progression
          </span>
        </div>

        {/* Timeline Progression Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {journeyData?.roadmap?.map((rm, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border space-y-4 relative ${
                rm.isCurrent
                  ? 'border-indigo-600 bg-indigo-50/40 shadow-lg shadow-indigo-100/50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    {rm.grade}
                  </span>
                  <h4 className="text-base font-black text-slate-900">
                    {rm.phase}
                  </h4>
                </div>

                {rm.isCurrent && (
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-xs">
                    Current Focus
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 italic">
                "{rm.tagline}"
              </p>

              <ul className="space-y-2 text-xs text-slate-700 pt-1">
                {rm.milestones?.map((m, mIdx) => (
                  <li key={mIdx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MONTHLY ACTION PLAN (INTERACTIVE STATUS TOGGLING) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">5</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Monthly Action Plan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Roadmap translated into bite-sized actionable tasks. Click any task to cycle: Not Started → In Progress → Completed.
            </p>
          </div>

          <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Completed: {completedCount} / {tasks.length}</span>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => {
            const isDone = task.status === 'completed';
            const inProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                onClick={() => handleToggleTaskStatus(task.id)}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-slate-700'
                    : inProgress
                    ? 'bg-indigo-50/40 border-indigo-200 text-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <button
                    type="button"
                    className="mt-0.5 shrink-0"
                    title="Click to toggle status"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : inProgress ? (
                      <Clock className="w-5 h-5 text-indigo-600 animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {task.month}
                      </span>
                      <h5 className={`text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {task.title}
                      </h5>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {task.description}
                    </p>

                    {/* “WHY THIS?” */}
                    {task.whyThis && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60 mt-1">
                        <HelpCircle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span><strong>Why This?</strong> {task.whyThis}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="self-start sm:self-center pl-8 sm:pl-0 shrink-0">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : inProgress
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isDone ? 'Completed' : inProgress ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. “WHY THIS?” DEDICATED HIGHLIGHT */}
      {/* ========================================================================= */}
      <section className="p-6 rounded-3xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">6</span>
          <h4 className="text-sm font-black text-indigo-950 uppercase tracking-wider">
            Why These Specific Recommendations?
          </h4>
        </div>
        <p className="text-slate-700 leading-relaxed">
          Every suggestion in your journey is explicitly calculated from your input profile:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-white rounded-2xl border border-indigo-100/80 space-y-1">
            <span className="font-bold text-slate-900 block">Subjects & Strengths</span>
            <span className="text-slate-500 text-[11px]">{profile.strongestSubjects?.join(', ') || 'Math, Physics'}</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-indigo-100/80 space-y-1">
            <span className="font-bold text-slate-900 block">Weekly Commitment</span>
            <span className="text-slate-500 text-[11px]">{profile.weeklyHours}</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-indigo-100/80 space-y-1">
            <span className="font-bold text-slate-900 block">Cost Requirement</span>
            <span className="text-emerald-700 font-semibold text-[11px]">{profile.costConstraint}</span>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-indigo-100/80 space-y-1">
            <span className="font-bold text-slate-900 block">Target University</span>
            <span className="text-indigo-700 font-semibold text-[11px]">{uniName}</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PROGRESS UPDATES & LEARNING LOG */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">7</span>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Progress Updates & Reflection
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              After completing an activity, record what you actually did and learned. Your answers update future recommendations!
            </p>
          </div>

          <button
            onClick={() => setShowProgressForm(!showProgressForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{showProgressForm ? 'Close Form' : 'Log New Activity Milestone'}</span>
          </button>
        </div>

        {/* Progress Form */}
        {showProgressForm && (
          <form onSubmit={handleAddProgressUpdate} className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
              Record What You Did & Learned
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Activity / Milestone Name
                </label>
                <input
                  type="text"
                  required
                  value={newProgress.activityTitle}
                  onChange={(e) => setNewProgress({ ...newProgress, activityTitle: e.target.value })}
                  placeholder="e.g. Conducted student budgeting survey"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Did This Change Your Interest in This Field?
                </label>
                <select
                  value={newProgress.changedInterest}
                  onChange={(e) => setNewProgress({ ...newProgress, changedInterest: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Increased my interest in practical economics">Increased my interest in this area</option>
                  <option value="I discovered I am more interested in economics than computer science">I discovered I'm more interested in economics than CS</option>
                  <option value="I realized I dislike this specific aspect">I realized I dislike this specific aspect</option>
                  <option value="Reinforced my confidence and clarified my next steps">Reinforced confidence & next steps</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What Did You Actually Do? (Concrete tasks & achievements)
              </label>
              <textarea
                rows={2}
                required
                value={newProgress.whatDone}
                onChange={(e) => setNewProgress({ ...newProgress, whatDone: e.target.value })}
                placeholder="e.g. Gathered 60 anonymous responses from Grade 10 students, tabulated results into Google Sheets..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What Did You Learn About the Subject or Yourself?
              </label>
              <textarea
                rows={2}
                value={newProgress.learned}
                onChange={(e) => setNewProgress({ ...newProgress, learned: e.target.value })}
                placeholder="e.g. I realized how much students struggle with understanding savings and that I love presenting data visually..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowProgressForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
              >
                Save & Update Recommendations
              </button>
            </div>
          </form>
        )}

        {/* Existing Updates List */}
        <div className="space-y-3">
          {progressUpdates?.length === 0 ? (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
              <p className="text-xs text-slate-500">
                No activity updates recorded yet. Once you complete your first step or session, log it here to refine future roadmap milestones!
              </p>
            </div>
          ) : (
            progressUpdates.map((up) => (
              <div key={up.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-black text-slate-900">{up.activityTitle}</h5>
                  <span className="text-[11px] text-slate-400">{up.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>What You Did: </strong>{up.whatDone}
                </p>
                {up.learned && (
                  <p className="text-xs text-slate-600 italic">
                    <strong>What You Learned: </strong>"{up.learned}"
                  </p>
                )}
                {up.changedInterest && (
                  <span className="inline-block px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                    Refined Focus: {up.changedInterest}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. AI MENTOR CHAT (“Ask My Journey Mentor”) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">8</span>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Ask My Journey Mentor
            </h3>
            <p className="text-xs text-slate-500">
              Interactive mentor assistance using your existing answers, grade, weekly hours, and project focus.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] sm:h-[580px] overflow-hidden">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 truncate">{uniName} Journey Mentor</h4>
                <p className="text-[10px] text-slate-500 truncate">Context: {profile.grade} • {profile.weeklyHours}</p>
              </div>
            </div>
            <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
              AI Powered
            </span>
          </div>

          {/* Quick Prompt Questions (All Specified in User Prompt!) */}
          <div className="p-2 sm:p-2.5 border-b border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar text-[11px] text-slate-700">
            {[
              'What should I focus on this month?',
              'I only have 3 hours per week. What should I do?',
              "I don't like my current project anymore. What else could I try?",
              'What should I do next?',
              "I discovered that I'm more interested in economics than computer science. Can you update my journey?",
            ].map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendChat(promptText)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-semibold whitespace-nowrap transition-colors border border-slate-200/60 shrink-0 text-left cursor-pointer"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
                <span>Journey mentor is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="p-2.5 sm:p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about your month, constraints, or next steps..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || chatLoading}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* QUESTIONNAIRE MODAL FLOW (ALL 17 ASKED QUESTIONS) */}
      {/* ========================================================================= */}
      {isQuestionnaireOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-7 md:p-8 shadow-2xl border border-slate-200 my-2 sm:my-8 space-y-4 sm:space-y-6 relative max-h-[94vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100 gap-3">
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                  AI-Powered Assessment • Step {qStep} of 3
                </span>
                <h3 className="text-base sm:text-xl font-black text-slate-900 break-words">
                  Build My University Journey to {uniName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQuestionnaireOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step Progress Indicators */}
            <div className="flex gap-2">
              <div className={`flex-1 h-1.5 rounded-full ${qStep >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full ${qStep >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              <div className={`flex-1 h-1.5 rounded-full ${qStep >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            </div>

            {/* STEP 1: ACADEMIC PROFILE & PASSIONS */}
            {qStep === 1 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  1. Academic Standing & Core Subjects
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Grade
                    </label>
                    <select
                      value={profile.grade}
                      onChange={(e) => setProfile({ ...profile, grade: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Grade 9">Grade 9 (Freshman)</option>
                      <option value="Grade 10">Grade 10 (Sophomore)</option>
                      <option value="Grade 11">Grade 11 (Junior)</option>
                      <option value="Grade 12">Grade 12 (Senior)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value, 10) || 16 })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                {/* Strongest Subjects */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Strongest Subjects (Click to select)
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {COMMON_SUBJECTS.map((sub) => {
                      const isSelected = profile.strongestSubjects?.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            const updated = isSelected
                              ? profile.strongestSubjects.filter(s => s !== sub)
                              : [...(profile.strongestSubjects || []), sub];
                            setProfile({ ...profile, strongestSubjects: updated });
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Favorite Subjects */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Favorite Subjects (Subjects you enjoy studying)
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {COMMON_SUBJECTS.map((sub) => {
                      const isSelected = profile.favoriteSubjects?.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            const updated = isSelected
                              ? profile.favoriteSubjects.filter(s => s !== sub)
                              : [...(profile.favoriteSubjects || []), sub];
                            setProfile({ ...profile, favoriteSubjects: updated });
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Academic Interests
                    </label>
                    <input
                      type="text"
                      value={profile.academicInterests}
                      onChange={(e) => setProfile({ ...profile, academicInterests: e.target.value })}
                      placeholder="e.g. Applied Math, Molecular Biology, Economics"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Possible Career Interests
                    </label>
                    <input
                      type="text"
                      value={profile.careerInterests}
                      onChange={(e) => setProfile({ ...profile, careerInterests: e.target.value })}
                      placeholder="e.g. Software Engineer, Economist, Physician"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: ACTIVITIES, EXPERIENCES & SKILLS */}
            {qStep === 2 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  2. Extracurriculars, Leadership & Skills
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hobbies and Passions
                  </label>
                  <input
                    type="text"
                    value={profile.hobbies}
                    onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                    placeholder="e.g. Coding tutorials, chess, reading non-fiction"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Existing Extracurricular Activities
                    </label>
                    <input
                      type="text"
                      value={profile.existingExtracurriculars}
                      onChange={(e) => setProfile({ ...profile, existingExtracurriculars: e.target.value })}
                      placeholder="e.g. School math club member, debate team"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Leadership Experiences
                    </label>
                    <input
                      type="text"
                      value={profile.leadershipExperiences}
                      onChange={(e) => setProfile({ ...profile, leadershipExperiences: e.target.value })}
                      placeholder="e.g. Study group organizer, class representative"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Volunteering & Community Service
                    </label>
                    <input
                      type="text"
                      value={profile.volunteering}
                      onChange={(e) => setProfile({ ...profile, volunteering: e.target.value })}
                      placeholder="e.g. Weekend library assistant, peer tutor"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Competitions & Olympiads
                    </label>
                    <input
                      type="text"
                      value={profile.competitions}
                      onChange={(e) => setProfile({ ...profile, competitions: e.target.value })}
                      placeholder="e.g. High school math olympiad, regional science fair"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Research / Projects (What you have investigated)
                  </label>
                  <input
                    type="text"
                    value={profile.researchProjects}
                    onChange={(e) => setProfile({ ...profile, researchProjects: e.target.value })}
                    placeholder="e.g. Essay on inflation, science project on plant growth"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                {/* Skills Chips */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Skills & Strengths (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {SKILL_OPTIONS.map((sk) => {
                      const isSelected = profile.skills?.includes(sk);
                      return (
                        <button
                          key={sk}
                          type="button"
                          onClick={() => {
                            const updated = isSelected
                              ? profile.skills.filter(s => s !== sk)
                              : [...(profile.skills || []), sk];
                            setProfile({ ...profile, skills: updated });
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {sk}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ACHIEVEMENTS, TIME & REAL RESOURCES */}
            {qStep === 3 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  3. Achievements, Time & Available Resources
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What Have You Already Achieved?
                  </label>
                  <textarea
                    rows={2}
                    value={profile.whatAchieved}
                    onChange={(e) => setProfile({ ...profile, whatAchieved: e.target.value })}
                    placeholder="e.g. Maintained top 5% GPA, helped 4 students pass math exam..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What Would You Like to Explore?
                  </label>
                  <textarea
                    rows={2}
                    value={profile.wantToExplore}
                    onChange={(e) => setProfile({ ...profile, wantToExplore: e.target.value })}
                    placeholder="e.g. Want to build a community project, study economics..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      How Much Time Do You Have Per Week?
                    </label>
                    <select
                      value={profile.weeklyHours}
                      onChange={(e) => setProfile({ ...profile, weeklyHours: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      <option value="1–3 hours/week (Heavy homework load)">1–3 hours/week (Heavy homework load)</option>
                      <option value="4–6 hours/week (Balanced)">4–6 hours/week (Balanced)</option>
                      <option value="7–10 hours/week (Dedicated)">7–10 hours/week (Dedicated)</option>
                      <option value="10+ hours/week (High availability)">10+ hours/week (High availability)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Do You Need Completely Free Opportunities?
                    </label>
                    <select
                      value={profile.costConstraint}
                      onChange={(e) => setProfile({ ...profile, costConstraint: e.target.value, needFree: e.target.value.includes('free') })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      <option value="Need 100% free opportunities ($0)">Yes, 100% free opportunities only ($0)</option>
                      <option value="Can afford nominal fees ($10 - $50)">Can afford nominal fees ($10–$50)</option>
                      <option value="Can consider paid summer programs">Can consider paid summer programs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What Resources Do You Have Access To?
                  </label>
                  <input
                    type="text"
                    value={profile.resources}
                    onChange={(e) => setProfile({ ...profile, resources: e.target.value })}
                    placeholder="e.g. Personal laptop, school computer lab, WiFi, local library"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-3 sm:pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              {qStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setQStep(qStep - 1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1.5 cursor-pointer order-2 sm:order-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div className="hidden sm:block"></div>
              )}

              {qStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setQStep(qStep + 1)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer order-1 sm:order-2"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateJourney}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer order-1 sm:order-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate My Personalized Journey</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
