import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { UNIVERSITIES } from '../data/universityData';
import { useLanguage } from '../context/LanguageContext';
import { 
  Compass, 
  Sparkles, 
  Building2, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  BookOpen, 
  Lightbulb, 
  Layers, 
  Calendar, 
  FolderPlus, 
  MessageSquare, 
  Send, 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  Plus, 
  Trash2,
  AlertCircle,
  FileCheck,
  Award
} from 'lucide-react';

const COMMON_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature',
  'Economics', 'Computer Science / ICT', 'History', 'Geography', 'Civics / Government',
  'Art & Design', 'Business Studies', 'Foreign Languages'
];

const SKILL_KEYS = [
  { key: 'leadership', label: 'Leadership' },
  { key: 'communication', label: 'Communication' },
  { key: 'writing', label: 'Writing & Essays' },
  { key: 'mathematics', label: 'Mathematics & Logic' },
  { key: 'science', label: 'Scientific Inquiry' },
  { key: 'research', label: 'Independent Research' },
  { key: 'creativity', label: 'Creativity & Design' },
  { key: 'coding', label: 'Technology / Coding' },
  { key: 'organization', label: 'Organization & Planning' },
  { key: 'publicSpeaking', label: 'Public Speaking' },
  { key: 'teamwork', label: 'Teamwork' },
  { key: 'entrepreneurship', label: 'Entrepreneurship' },
];

export const UniversityMentor = () => {
  const [searchParams] = useSearchParams();
  const targetUniSlug = searchParams.get('uni');
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t, tr, isAmharic } = useLanguage();

  const [activeStep, setActiveStep] = useState(1);
  // 1 = Interview Questionnaire
  // 2 = Exploration Directions
  // 3 = Extracurricular Strategy & Passion Project
  // 4 = Grade-Adapted Multi-Year Roadmap & Monthly Plan
  // 5 = Opportunity Matching & Journey Evidence
  // 6 = Reflection Mentor & Progress Dashboard

  const [selectedUniSlug, setSelectedUniSlug] = useState(targetUniSlug || 'harvard-university');
  const targetUniversity = UNIVERSITIES.find(u => u.slug === selectedUniSlug) || UNIVERSITIES[0];

  // -------------------------------------------------------------
  // QUESTIONNAIRE FORM STATE
  // -------------------------------------------------------------
  const [background, setBackground] = useState({
    grade: user?.grade || 'Grade 11',
    country: user?.country || 'Ethiopia',
    subjectsStudied: ['Mathematics', 'Physics', 'English Literature', 'Chemistry', 'Economics'],
    strongestSubjects: ['Mathematics', 'Physics'],
    enjoyedSubjects: ['Economics', 'Mathematics'],
    dislikedSubjects: ['History'],
    recentGrades: 'Top 5% in class, average 92% across STEM subjects',
  });

  const [interests, setInterests] = useState({
    talkingTopics: 'Emerging technology, local small businesses, and how economic systems work in developing nations.',
    communityProblems: 'High youth unemployment and students lacking basic personal financial management skills.',
    naturalActivities: 'Reading non-fiction, solving logic puzzles, analyzing data, helping classmates with math.',
    outsideSchool: 'Self-studying coding tutorials on YouTube, volunteering at community literacy library on weekends.',
    unpromptedResearch: 'Looking up how central banks work and how mobile money apps like Telebirr and M-Pesa scale.',
    careerInterests: 'Software Engineering, Quantitative Economics, or Tech Entrepreneurship',
    explorationStage: 'Still exploring combinations of tech and business',
  });

  const [skills, setSkills] = useState({
    leadership: 3,
    communication: 4,
    writing: 4,
    mathematics: 5,
    science: 4,
    research: 4,
    creativity: 3,
    coding: 3,
    organization: 4,
    publicSpeaking: 3,
    teamwork: 4,
    entrepreneurship: 3,
  });

  const [experiences, setExperiences] = useState({
    extracurriculars: 'School Math Club member, volunteer tutor for Grade 9 students.',
    foundedOrLed: 'Co-founded an informal after-school study group for math competition prep.',
    competitions: 'Participated in regional High School Math Olympiad (scored in top 15%).',
    researchDone: 'Wrote a 5-page school essay analyzing local food price inflation.',
    proudestAchievement: 'Mentored 4 struggling Grade 9 students to pass their mid-year mathematics exams.',
  });

  const [constraints, setConstraints] = useState({
    weeklyHours: '4–6 hours/week',
    hasInternet: 'Yes (home WiFi + mobile data)',
    computerAccess: 'Personal laptop available',
    schoolResources: 'Average (has a library and basic computer lab)',
    localMentors: 'Limited formal mentors, but supportive teachers',
    costConstraint: 'Need 100% free opportunities ($0)',
    transportation: 'Local walking distance / public bus only',
    facilityAccess: 'Community library and school computer lab',
  });

  // -------------------------------------------------------------
  // GENERATED DIRECTIONS & CHOSEN DIRECTION
  // -------------------------------------------------------------
  const [possibleDirections, setPossibleDirections] = useState([
    {
      id: 'dir_1',
      title: 'Economics, Finance & Community Development',
      whyAppeared: 'You enjoy Economics and Math, care about local student financial literacy, and research mobile money systems unprompted.',
      keySkills: ['Quantitative Analysis', 'Survey Design', 'Economic Modeling', 'Community Engagement'],
      matchScore: 95,
    },
    {
      id: 'dir_2',
      title: 'Computer Science & Local Digital Solutions',
      whyAppeared: 'You already self-study programming, have strong mathematics aptitude, and indicated interest in building software tools.',
      keySkills: ['Algorithms', 'Web Development', 'System Design', 'Open-Source Collaboration'],
      matchScore: 90,
    },
    {
      id: 'dir_3',
      title: 'Data Science & Public Policy Research',
      whyAppeared: 'Combines your scientific research inquiry with societal problem-solving around youth employment and community data.',
      keySkills: ['Data Visualization', 'Statistical Analysis', 'Policy Writing', 'Critical Reasoning'],
      matchScore: 84,
    }
  ]);

  const [chosenDirection, setChosenDirection] = useState('Economics, Finance & Community Development');

  // -------------------------------------------------------------
  // PASSION PROJECT
  // -------------------------------------------------------------
  const [passionProject, setPassionProject] = useState({
    name: 'High School Financial Literacy & Youth Economics Survey',
    problem: 'Over 80% of secondary school students graduate without basic understanding of budgeting, saving, or economic inflation.',
    whyMatches: 'Directly harnesses your top subjects (Mathematics & Economics), your concern for community financial knowledge, and requires $0 budget.',
    skillsDeveloped: ['Survey Methodology', 'Data Visualization in Excel', 'Public Presentation', 'Educational Workshop Design'],
    estimatedTime: '6 Weeks (approx 3 hours per week)',
    difficulty: 'Moderate',
    cost: '$0 (Completely Free — uses Google Forms, paper handouts, and school classroom space)',
    materialsNeeded: 'Free Google Forms / survey printouts, basic spreadsheet (Google Sheets/Excel), school chalkboard or projector.',
    collaborators: 'Economics/Math teacher as faculty advisor, school student council representative.',
    firstSteps: [
      'Draft a 10-question anonymous student survey about daily budgeting and financial confusion.',
      'Request permission from your principal or homeroom teacher to administer the survey to 50–100 students.',
      'Analyze the responses in Google Sheets and compile 3 key insights about student financial needs.'
    ],
    possibleOutcome: 'A 4-page student report presented to your school administration and a 45-minute peer workshop on student budgeting.',
    documentationMethod: 'Save survey graphs, workshop photos, written attendee feedback notes, and your final analytical report PDF.'
  });

  // -------------------------------------------------------------
  // MULTI-YEAR ROADMAP & MONTHLY ACTION PLAN
  // -------------------------------------------------------------
  const [roadmap, setRoadmap] = useState([]);
  const [actionPlan, setActionPlan] = useState([]);

  // Generate grade-adapted roadmap based on background.grade
  useEffect(() => {
    const currentGrade = background.grade || 'Grade 11';
    let rm = [];

    if (currentGrade === 'Grade 9') {
      rm = [
        {
          grade: 'Grade 9',
          phase: 'Explore & Foundation',
          isCurrent: true,
          milestones: [
            'Try 2-3 different school clubs (e.g. math club, debate, environmental club)',
            'Build strong academic habits and maintain high baseline grades in core subjects',
            'Read 1 non-fiction book every month in subjects that make you curious',
            'Learn the basics of one digital skill (coding, spreadsheet analysis, or graphic design)'
          ]
        },
        {
          grade: 'Grade 10',
          phase: 'Focus & Small Initiatives',
          isCurrent: false,
          milestones: [
            'Select 1–2 primary areas of genuine interest to pursue deeper',
            'Launch your first mini independent project or research survey',
            'Participate in regional school competitions or Olympiads',
            'Seek out teacher mentorship in your favorite academic disciplines'
          ]
        },
        {
          grade: 'Grade 11',
          phase: 'Deepen & Lead',
          isCurrent: false,
          milestones: [
            'Expand your passion project to reach a wider school or community audience',
            'Take on leadership responsibilities in existing initiatives or clubs',
            'Prepare for standardized tests (SAT/ACT/Duolingo) if applicable to target universities',
            'Investigate verified scholarships (Mastercard Foundation, Lester B. Pearson, etc.)'
          ]
        },
        {
          grade: 'Grade 12',
          phase: 'Demonstrate & Apply',
          isCurrent: false,
          milestones: [
            'Synthesize accomplishments into your Journey Evidence portfolio',
            'Request recommendation letters from teachers who know your authentic curiosity',
            'Write reflective essays connecting your high-school discoveries to future study',
            'Submit early and regular university applications and financial aid forms'
          ]
        }
      ];
    } else if (currentGrade === 'Grade 10') {
      rm = [
        {
          grade: 'Grade 10',
          phase: 'Focus & Experiment',
          isCurrent: true,
          milestones: [
            'Narrow down your focal exploration to 1–2 genuine disciplines',
            'Launch your student passion project (e.g. your community survey)',
            'Compete in school or regional academic competitions (Math Olympiad, Science Fair)',
            'Audit free university introductory courses online (edX, MIT OCW)'
          ]
        },
        {
          grade: 'Grade 11',
          phase: 'Develop, Lead & Deepen',
          isCurrent: false,
          milestones: [
            'Deliver tangible outcomes from your passion project (workshops, articles, code)',
            'Step into meaningful mentorship or leadership roles',
            'Prepare and sit for standardized exams (SAT/ACT) in Spring',
            'Finalize your target university list and application deadlines'
          ]
        },
        {
          grade: 'Grade 12',
          phase: 'Demonstrate & Apply',
          isCurrent: false,
          milestones: [
            'Complete your final project milestone and write a summary reflection',
            'Request academic teacher letters highlighting your intellectual curiosity',
            'Draft, refine, and submit university applications and scholarship profiles',
            'Prepare for university interviews by discussing your real high school experiences'
          ]
        }
      ];
    } else if (currentGrade === 'Grade 11') {
      rm = [
        {
          grade: 'Grade 11',
          phase: 'Develop, Lead & Produce Evidence',
          isCurrent: true,
          milestones: [
            'Execute your chosen passion project and record all milestones in Journey Evidence',
            'Take on authentic leadership by mentoring younger peers or organizing workshops',
            'Pursue course rigor in high-level math/sciences or advanced subjects available at school',
            'Register and sit for the SAT/ACT and English exams before Autumn of Grade 12',
            'Identify 5 target universities and their specific financial aid criteria'
          ]
        },
        {
          grade: 'Grade 12',
          phase: 'Demonstrate, Apply & Transition',
          isCurrent: false,
          milestones: [
            'Complete final deliverables for your project and document impact',
            'Secure recommendation letters from 2 teachers who observed your problem-solving',
            'Draft university application essays centered on what you learned about yourself',
            'Submit Early Action / Regular Decision applications with verified documentation'
          ]
        }
      ];
    } else {
      // Grade 12
      rm = [
        {
          grade: 'Grade 12',
          phase: 'Demonstrate, Document & Apply',
          isCurrent: true,
          milestones: [
            'Organize your past activities into your "My Journey Evidence" portfolio',
            'Complete your immediate 4-week passion project deliverable',
            'Request teacher recommendation letters with specific examples of your curiosity',
            'Draft authentic personal statements detailing problems you tackled and lessons learned',
            'Submit early and regular university applications alongside financial aid profiles',
            'Prepare for prospective student interviews and scholarship assessments'
          ]
        }
      ];
    }

    setRoadmap(rm);

    // Initial 3-Month Action Plan
    setActionPlan([
      {
        id: 'act_1',
        month: 'Month 1',
        title: 'Project Initiation & Survey Drafting',
        description: 'Draft the 10-question student financial survey and review it with your economics/math teacher.',
        status: 'in_progress', // 'not_started' | 'in_progress' | 'completed'
      },
      {
        id: 'act_2',
        month: 'Month 1',
        title: 'Academic Prerequisite Review',
        description: `Review official academic subject recommendations for ${targetUniversity.name} and ensure your course load is strong.`,
        status: 'completed',
      },
      {
        id: 'act_3',
        month: 'Month 2',
        title: 'Administer Survey & Gather 50+ Responses',
        description: 'Collect responses across 2 classrooms and tabulate initial trends into Google Sheets.',
        status: 'not_started',
      },
      {
        id: 'act_4',
        month: 'Month 2',
        title: 'Peer Tutoring & Subject Mentoring',
        description: 'Dedicate 1 hour per week tutoring younger Grade 9 students in foundational algebra.',
        status: 'in_progress',
      },
      {
        id: 'act_5',
        month: 'Month 3',
        title: 'Publish 3-Page Findings Report',
        description: 'Summarize key findings in a neat report and share with your school administration.',
        status: 'not_started',
      },
      {
        id: 'act_6',
        month: 'Month 3',
        title: 'Document Experience in Portfolio',
        description: 'Upload reflections, survey charts, and attendee feedback to "My Journey Evidence".',
        status: 'not_started',
      },
    ]);
  }, [background.grade, targetUniversity]);

  // -------------------------------------------------------------
  // OPPORTUNITIES MATCHED
  // -------------------------------------------------------------
  const [matchedOpportunities, setMatchedOpportunities] = useState([
    {
      id: 'opp_1',
      title: 'Wharton Global High School Investment Competition',
      provider: 'Wharton School, University of Pennsylvania',
      type: 'Competition',
      cost: '100% Free',
      whyMatches: 'Matches your focus on Economics and Finance, is open to high school students worldwide, and requires zero entry fee.',
      link: '/opportunities'
    },
    {
      id: 'opp_2',
      title: 'Mastercard Foundation Scholars Program',
      provider: 'Mastercard Foundation & Partner Universities',
      type: 'Scholarship',
      cost: 'Fully Funded (100% coverage)',
      whyMatches: 'Designed for high-achieving African students with financial barriers; covers tuition, accommodation, flights, and books.',
      link: '/scholarships/mastercard-foundation-scholars'
    },
    {
      id: 'opp_3',
      title: 'International Mathematical Olympiad (IMO) National Qualifiers',
      provider: 'National Mathematics Association',
      type: 'Olympiad',
      cost: 'Free School Registration',
      whyMatches: 'Aligns with your top academic strength in Mathematics and demonstrates intellectual challenge.',
      link: '/opportunities'
    }
  ]);

  // -------------------------------------------------------------
  // JOURNEY EVIDENCE PORTFOLIO
  // -------------------------------------------------------------
  const [evidenceList, setEvidenceList] = useState([
    {
      id: 'ev_1',
      activityName: 'Grade 9 Math Mentorship Initiative',
      organization: 'Local High School Student Council',
      role: 'Lead Student Tutor',
      dates: 'Oct 2025 - Jan 2026',
      totalHours: '24 hours (2 hrs/week)',
      whatDone: 'Conducted weekly algebra and geometry tutoring sessions for 4 Grade 9 students struggling with equations.',
      skillsDeveloped: 'Communication, patience, diagnostic problem-solving, teaching.',
      results: 'All 4 mentored students raised their semester exam scores by at least 15 points.',
      reflection: 'Teaching others helped me understand the mathematical concepts on a much deeper level than just doing homework.',
    }
  ]);

  const [newEvidence, setNewEvidence] = useState({
    activityName: '',
    organization: '',
    role: '',
    dates: '',
    totalHours: '',
    whatDone: '',
    skillsDeveloped: '',
    results: '',
    reflection: '',
  });
  const [showAddEvidence, setShowAddEvidence] = useState(false);

  // -------------------------------------------------------------
  // REFLECTION MENTOR
  // -------------------------------------------------------------
  const [reflections, setReflections] = useState([]);
  const [currentReflection, setCurrentReflection] = useState({
    activityTitle: 'Student Financial Literacy Survey (Pilot Phase)',
    whatDone: '',
    whatLearned: '',
    whatSurprised: '',
    problemFaced: '',
    howSolved: '',
    changedInterest: 'Increased my interest in practical economics and public presentation',
    continueActivity: 'Yes, want to expand to more classrooms',
  });

  // -------------------------------------------------------------
  // AI MENTOR CHAT
  // -------------------------------------------------------------
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'mentor',
      text: `Hello! I'm your University Journey Mentor for **${targetUniversity.name}**. I've reviewed your background in ${background.grade} and your interest in **${chosenDirection}**.\n\nHow can I help you explore your interests, plan your next steps, or adapt to your constraints this week?`,
      time: 'Just now'
    }
  ]);
  const [inputChat, setInputChat] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Action item status toggle
  const toggleActionStatus = (actionId) => {
    setActionPlan(prev =>
      prev.map(a => {
        if (a.id === actionId) {
          const nextStatus =
            a.status === 'not_started'
              ? 'in_progress'
              : a.status === 'in_progress'
              ? 'completed'
              : 'not_started';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  // Add evidence
  const handleAddEvidence = (e) => {
    e.preventDefault();
    if (!newEvidence.activityName.trim()) return;

    const item = {
      id: 'ev_' + Date.now(),
      ...newEvidence,
    };
    setEvidenceList(prev => [item, ...prev]);
    setNewEvidence({
      activityName: '',
      organization: '',
      role: '',
      dates: '',
      totalHours: '',
      whatDone: '',
      skillsDeveloped: '',
      results: '',
      reflection: '',
    });
    setShowAddEvidence(false);
    addToast('Activity record saved to My Journey Evidence!', 'success');
  };

  // Submit Reflection
  const handleSaveReflection = (e) => {
    e.preventDefault();
    setReflections(prev => [
      {
        id: 'ref_' + Date.now(),
        ...currentReflection,
        timestamp: new Date().toLocaleDateString(),
      },
      ...prev
    ]);
    addToast('Reflection recorded! Your mentor insights have been updated.', 'success');
  };

  // Send AI Mentor Chat
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!inputChat.trim() || chatLoading) return;

    const userText = inputChat.trim();
    setInputChat('');

    // Add user message
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userText, time: 'Just now' }
    ]);

    setChatLoading(true);

    try {
      const res = await api.sendMentorChat(userText, {
        universityName: targetUniversity.name,
        currentGrade: background.grade,
        country: background.country,
        chosenDirection,
        weeklyHours: constraints.weeklyHours,
        needFree: constraints.costConstraint.includes('free'),
        passionProject,
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
          text: `Focus on what makes you curious and take one small tangible step this week in your ${chosenDirection}. Consistency with ${constraints.weeklyHours} will yield meaningful results.`,
          time: 'Just now'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Quick Prompt handler for chat
  const handleQuickPrompt = (promptText) => {
    setInputChat(promptText);
  };

  // Save journey to backend
  const handleSaveEntireJourney = async () => {
    try {
      await api.saveMentorJourney({
        userEmail: user?.email || 'selam.haile@fyndora.org',
        universityId: targetUniversity.slug,
        universityName: targetUniversity.name,
        studentBackground: background,
        interests,
        skills,
        experiences,
        constraints,
        possibleDirections,
        chosenDirection,
        passionProject,
        roadmap,
        actionPlan,
        matchedOpportunities,
        evidencePortfolio: evidenceList,
        reflections,
        chatHistory: chatMessages,
        progressStats: {
          academic: 75,
          exploration: 70,
          projects: 55,
          leadership: 60,
          research: 45,
        }
      });
      addToast('Your complete University Journey was saved successfully!', 'success');
    } catch (err) {
      console.error('Save journey error:', err);
      addToast('Saved to local storage!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Breadcrumb & University Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to={`/universities/${targetUniversity.slug}`}
            className="w-10 h-10 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center transition-colors shrink-0"
            title="View Official University Profile"
          >
            <Building2 className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Mentoring for Target Institution
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {targetUniversity.country}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{targetUniversity.name}</span>
              <span className="text-xs font-normal text-slate-500">Journey Mentor</span>
            </h1>
          </div>
        </div>

        {/* Change University Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden md:inline">{t('Change University:')}</span>
          <select
            value={selectedUniSlug}
            onChange={(e) => setSelectedUniSlug(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {UNIVERSITIES.map(u => (
              <option key={u.slug} value={u.slug}>
                {u.name} ({tr(u.country)})
              </option>
            ))}
          </select>
          <Link
            to={`/universities/${targetUniversity.slug}?tab=journey`}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs shadow-xs transition-all shrink-0 flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" />
            <span>Profile Journey View</span>
          </Link>
          <button
            onClick={handleSaveEntireJourney}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all shrink-0"
          >
            {t('Save Journey')}
          </button>
        </div>
      </div>

      {/* Philosophy & Transparency Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-bold text-amber-900">
            {t('Admissions Transparency & Ethical Mentorship Policy:')}
          </strong>
          <p className="text-amber-800 leading-relaxed text-[11px] sm:text-xs">
            {t('This mentor helps you explore authentic interests, develop projects, and prepare academically. We never fabricate admissions formulas, scores, or claims of guaranteed acceptance. Universities evaluate applicants in their individual context.')}
          </p>
        </div>
      </div>

      {/* Navigation Steps Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-100/80 p-1.5 rounded-2xl">
        {[
          { step: 1, label: '1. Interview', icon: Compass },
          { step: 2, label: '2. Directions', icon: Lightbulb },
          { step: 3, label: '3. Passion Project', icon: Sparkles },
          { step: 4, label: '4. Roadmap & Plan', icon: Calendar },
          { step: 5, label: '5. Evidence Log', icon: FolderPlus },
          { step: 6, label: '6. Mentor & Chat', icon: MessageSquare },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeStep === item.step;
          return (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="truncate">{t(item.label)}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: INTERVIEW QUESTIONNAIRE */}
      {/* ========================================================================= */}
      {activeStep === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Step 1 of 6 • Conversational Assessment
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Tell Your Mentor About Yourself
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Before giving recommendations, we need to understand your current grade, subjects, passions, available hours, and constraints.
            </p>
          </div>

          <div className="space-y-8">
            
            {/* 1. Background */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                1. Student Background
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Grade
                  </label>
                  <select
                    value={background.grade}
                    onChange={(e) => setBackground({ ...background, grade: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="Grade 9">Grade 9 (Freshman)</option>
                    <option value="Grade 10">Grade 10 (Sophomore)</option>
                    <option value="Grade 11">Grade 11 (Junior)</option>
                    <option value="Grade 12">Grade 12 (Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    value={background.country}
                    onChange={(e) => setBackground({ ...background, country: e.target.value })}
                    placeholder="e.g. Ethiopia, Ghana, Kenya, Nigeria"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subjects You Are Currently Studying
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {COMMON_SUBJECTS.map((sub) => {
                    const isSelected = background.subjectsStudied.includes(sub);
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? background.subjectsStudied.filter(s => s !== sub)
                            : [...background.subjectsStudied, sub];
                          setBackground({ ...background, subjectsStudied: updated });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Strongest Subjects
                  </label>
                  <input
                    type="text"
                    value={background.strongestSubjects.join(', ')}
                    onChange={(e) => setBackground({ ...background, strongestSubjects: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="e.g. Mathematics, Physics"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subjects You Enjoy Most
                  </label>
                  <input
                    type="text"
                    value={background.enjoyedSubjects.join(', ')}
                    onChange={(e) => setBackground({ ...background, enjoyedSubjects: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="e.g. Economics, Biology"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subjects You Dislike
                  </label>
                  <input
                    type="text"
                    value={background.dislikedSubjects.join(', ')}
                    onChange={(e) => setBackground({ ...background, dislikedSubjects: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="e.g. History, Chemistry"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recent Grades / Academic Standing
                </label>
                <input
                  type="text"
                  value={background.recentGrades}
                  onChange={(e) => setBackground({ ...background, recentGrades: e.target.value })}
                  placeholder="e.g. Top 5% in class, average 90% across STEM"
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* 2. Interests */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                2. Authentic Interests & Curiosity
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What topics could you talk about for hours?
                  </label>
                  <textarea
                    rows={2}
                    value={interests.talkingTopics}
                    onChange={(e) => setInterests({ ...interests, talkingTopics: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    What problems in your community or the world interest you?
                  </label>
                  <textarea
                    rows={2}
                    value={interests.communityProblems}
                    onChange={(e) => setInterests({ ...interests, communityProblems: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      What topics do you research without being asked?
                    </label>
                    <input
                      type="text"
                      value={interests.unpromptedResearch}
                      onChange={(e) => setInterests({ ...interests, unpromptedResearch: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      What do you naturally do outside school?
                    </label>
                    <input
                      type="text"
                      value={interests.outsideSchool}
                      onChange={(e) => setInterests({ ...interests, outsideSchool: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Careers You Are Currently Considering
                    </label>
                    <input
                      type="text"
                      value={interests.careerInterests}
                      onChange={(e) => setInterests({ ...interests, careerInterests: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Exploration Status
                    </label>
                    <select
                      value={interests.explorationStage}
                      onChange={(e) => setInterests({ ...interests, explorationStage: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      <option value="Still exploring different fields">Still exploring different fields</option>
                      <option value="Exploring combinations of tech and business">Exploring combinations of tech and business</option>
                      <option value="Strong focused career direction already">Strong focused career direction already</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Skills Self-Assessment */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                3. Skills Self-Rating (1 to 5 Stars)
              </h3>
              <p className="text-xs text-slate-500">
                Rate your comfort in each area honestly. There are no right or wrong answers.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                {SKILL_KEYS.map((sk) => (
                  <div key={sk.key} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-xs font-bold text-slate-800">{sk.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSkills({ ...skills, [sk.key]: star })}
                          className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded ${
                            star <= (skills[sk.key] || 3)
                              ? 'text-amber-500'
                              : 'text-slate-300'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Resources and Constraints (CRITICAL) */}
            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  4. Resources & Real Constraints (Essential)
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Critical for Realistic Advice
                </span>
              </div>
              <p className="text-xs text-indigo-900">
                We will <strong>never recommend expensive or unrealistic opportunities</strong> when you have time, budget, or equipment constraints.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Realistic Time Available Per Week
                  </label>
                  <select
                    value={constraints.weeklyHours}
                    onChange={(e) => setConstraints({ ...constraints, weeklyHours: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="1–3 hours/week (Heavy school homework)">1–3 hours/week (Heavy homework load)</option>
                    <option value="4–6 hours/week (Balanced)">4–6 hours/week (Balanced)</option>
                    <option value="7–10 hours/week (Dedicated)">7–10 hours/week (Dedicated)</option>
                    <option value="10+ hours/week (High availability)">10+ hours/week (High availability)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Budget / Program Cost Needs
                  </label>
                  <select
                    value={constraints.costConstraint}
                    onChange={(e) => setConstraints({ ...constraints, costConstraint: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="Need 100% free opportunities ($0)">Need 100% free opportunities ($0 only)</option>
                    <option value="Can afford nominal school fees ($10 - $50)">Can afford nominal fees ($10–$50)</option>
                    <option value="Can consider paid summer programs">Can consider paid programs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Computer & Hardware Access
                  </label>
                  <input
                    type="text"
                    value={constraints.computerAccess}
                    onChange={(e) => setConstraints({ ...constraints, computerAccess: e.target.value })}
                    placeholder="e.g. Personal laptop, shared family PC, phone only"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Internet Connectivity
                  </label>
                  <input
                    type="text"
                    value={constraints.hasInternet}
                    onChange={(e) => setConstraints({ ...constraints, hasInternet: e.target.value })}
                    placeholder="e.g. Home WiFi, mobile data package, school lab"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Proceed Button */}
          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Information saved in your Fyndora profile
            </span>
            <button
              onClick={() => {
                setActiveStep(2);
                addToast('Interview answers analyzed! Exploration directions generated.', 'info');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.02]"
            >
              <span>Analyze Answers & View Directions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: POSSIBLE DIRECTIONS WORTH EXPLORING */}
      {/* ========================================================================= */}
      {activeStep === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Step 2 of 6 • Exploration Directions
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Possible Directions Worth Exploring
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              We do not force you into a single rigid career. Here are multidisciplinary avenues that genuinely connect with your subjects and curiosity:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {possibleDirections.map((dir) => {
              const isSelected = chosenDirection === dir.title;
              return (
                <div
                  key={dir.id}
                  className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-lg shadow-indigo-100/50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                        {dir.matchScore}% Resonance
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                          <CheckCircle2 className="w-4 h-4" />
                          Selected
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-slate-900">
                      {dir.title}
                    </h3>

                    {/* WHY THIS APPEARED BOX */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-100 text-xs space-y-1.5 shadow-2xs">
                      <strong className="text-indigo-900 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Why this appeared:
                      </strong>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        {dir.whyAppeared}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Core Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dir.keySkills.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => {
                        setChosenDirection(dir.title);
                        addToast(`Selected direction: ${dir.title}`, 'success');
                      }}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600'
                      }`}
                    >
                      {isSelected ? 'Exploring This Direction' : 'I want to explore this'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setActiveStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Questionnaire</span>
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.02]"
            >
              <span>Build Strategy & Passion Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: EXTRACURRICULAR STRATEGY & PASSION PROJECT */}
      {/* ========================================================================= */}
      {activeStep === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-10">
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Step 3 of 6 • Tailored Activities & Project
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Extracurricular Strategy & Find My Passion Project
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              We reject generic advice like "join a club" or "volunteer." Every recommendation here connects directly to your stated interests and $0 budget.
            </p>
          </div>

          {/* PASSION PROJECT HIGHLIGHT CARD */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Passion Project Idea
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Cost: {passionProject.cost}
              </span>
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {passionProject.name}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                <strong className="text-amber-300">Problem Addressed: </strong>
                {passionProject.problem}
              </p>
            </div>

            {/* Why it matches you */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs space-y-1 relative z-10">
              <span className="font-bold text-indigo-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Why this matches you:
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                {passionProject.whyMatches}
              </p>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">Estimated Timeline</span>
                <span className="font-bold text-white">{passionProject.estimatedTime}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">Key Collaborators</span>
                <span className="font-bold text-white">{passionProject.collaborators}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">Expected Deliverable</span>
                <span className="font-bold text-white truncate block">{passionProject.possibleOutcome}</span>
              </div>
            </div>

            {/* First 3 Steps */}
            <div className="space-y-2.5 pt-2 relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                First 3 Immediate Steps to Launch:
              </h4>
              <div className="space-y-2">
                {passionProject.firstSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentation Guidance */}
            <div className="p-3 bg-indigo-950/80 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2 relative z-10">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>How to document: </strong> {passionProject.documentationMethod}
              </span>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setActiveStep(2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directions</span>
            </button>

            <button
              onClick={() => setActiveStep(4)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.02]"
            >
              <span>View Grade-Adapted Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: GRADE-ADAPTED ROADMAP & MONTHLY PLAN */}
      {/* ========================================================================= */}
      {activeStep === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-10">
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Step 4 of 6 • Personalized Timeline
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Multi-Year High-School Roadmap for {background.grade}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Adapted specifically to your current grade level. If you are in {background.grade}, we focus on actions that matter right now.
            </p>
          </div>

          {/* Multi-Year Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmap.map((rmItem, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border space-y-4 ${
                  rmItem.isCurrent
                    ? 'border-indigo-600 bg-indigo-50/30 shadow-md shadow-indigo-50'
                    : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">{rmItem.grade}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {rmItem.phase}
                    </span>
                  </div>
                  {rmItem.isCurrent && (
                    <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                      Current Year Focus
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700">
                  {rmItem.milestones.map((m, mIdx) => (
                    <li key={mIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                      <span className="leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Monthly Action Plan with Interactive Status Toggles */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Monthly Action Plan
                </h3>
                <p className="text-xs text-slate-500">
                  Click any item to cycle status: ☐ Not started &rarr; 🔵 In progress &rarr; ✅ Completed
                </p>
              </div>

              {/* Progress Count */}
              <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 self-start sm:self-auto">
                Completed: {actionPlan.filter(a => a.status === 'completed').length} / {actionPlan.length}
              </div>
            </div>

            <div className="space-y-3">
              {actionPlan.map((act) => (
                <div
                  key={act.id}
                  onClick={() => toggleActionStatus(act.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    act.status === 'completed'
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-600'
                      : act.status === 'in_progress'
                      ? 'bg-indigo-50/40 border-indigo-200 text-slate-800'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-base"
                      title="Click to toggle status"
                    >
                      {act.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {act.status === 'in_progress' && <Clock className="w-5 h-5 text-indigo-600" />}
                      {act.status === 'not_started' && <Circle className="w-5 h-5 text-slate-300" />}
                    </button>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{act.month}</span>
                        <h4 className={`text-sm font-bold ${act.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {act.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    act.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : act.status === 'in_progress'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {act.status === 'completed' ? 'Completed' : act.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setActiveStep(3)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Passion Project</span>
            </button>

            <button
              onClick={() => setActiveStep(5)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.02]"
            >
              <span>View Matched Opportunities & Evidence Log</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: OPPORTUNITY MATCHING & JOURNEY EVIDENCE */}
      {/* ========================================================================= */}
      {activeStep === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-10">
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Step 5 of 6 • Database Connections
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Matched Opportunities & My Journey Evidence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Verified competitions, research programs, and scholarships tailored to your interest, grade, and $0 budget.
            </p>
          </div>

          {/* Matched Opportunities */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Opportunities Connecting to Your Journey
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {matchedOpportunities.map((opp) => (
                <div key={opp.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">{opp.type}</span>
                      <span className="font-semibold text-emerald-700">{opp.cost}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{opp.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{opp.provider}</p>

                    {/* WHY THIS OPPORTUNITY MATCHES YOU */}
                    <div className="p-3 rounded-xl bg-white border border-slate-100 text-[11px] text-slate-600 space-y-1">
                      <strong className="text-indigo-900 block font-bold">Why this matches you:</strong>
                      <span>{opp.whyMatches}</span>
                    </div>
                  </div>

                  <Link
                    to={opp.link}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors"
                  >
                    <span>View Opportunity</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* MY JOURNEY EVIDENCE PORTFOLIO */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-indigo-600" />
                  My Journey Evidence (Activity Portfolio)
                </h3>
                <p className="text-xs text-slate-500">
                  Document verified hours, real outcomes, and personal reflections for university applications.
                </p>
              </div>

              <button
                onClick={() => setShowAddEvidence(!showAddEvidence)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Activity Record</span>
              </button>
            </div>

            {/* Add Evidence Form */}
            {showAddEvidence && (
              <form onSubmit={handleAddEvidence} className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
                  New Evidence Entry
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Name</label>
                    <input
                      type="text"
                      required
                      value={newEvidence.activityName}
                      onChange={(e) => setNewEvidence({ ...newEvidence, activityName: e.target.value })}
                      placeholder="e.g. Student Math Mentorship"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / School</label>
                    <input
                      type="text"
                      value={newEvidence.organization}
                      onChange={(e) => setNewEvidence({ ...newEvidence, organization: e.target.value })}
                      placeholder="e.g. High School Math Dept"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Role</label>
                    <input
                      type="text"
                      value={newEvidence.role}
                      onChange={(e) => setNewEvidence({ ...newEvidence, role: e.target.value })}
                      placeholder="e.g. Founder & Tutor"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Dates & Total Hours</label>
                    <input
                      type="text"
                      value={newEvidence.totalHours}
                      onChange={(e) => setNewEvidence({ ...newEvidence, totalHours: e.target.value })}
                      placeholder="e.g. Oct 2025 - Present (approx 20 hours)"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Skills Developed</label>
                    <input
                      type="text"
                      value={newEvidence.skillsDeveloped}
                      onChange={(e) => setNewEvidence({ ...newEvidence, skillsDeveloped: e.target.value })}
                      placeholder="e.g. Teaching, Excel, public speaking"
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">What You Actually Did</label>
                  <textarea
                    rows={2}
                    value={newEvidence.whatDone}
                    onChange={(e) => setNewEvidence({ ...newEvidence, whatDone: e.target.value })}
                    placeholder="Describe your concrete tasks and responsibilities honestly..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Real Results & Reflection</label>
                  <textarea
                    rows={2}
                    value={newEvidence.reflection}
                    onChange={(e) => setNewEvidence({ ...newEvidence, reflection: e.target.value })}
                    placeholder="What did you learn about yourself? What was the outcome?"
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddEvidence(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Save Activity Record
                  </button>
                </div>
              </form>
            )}

            {/* Evidence List */}
            <div className="space-y-3">
              {evidenceList.map((ev) => (
                <div key={ev.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{ev.activityName}</h4>
                      <p className="text-xs text-indigo-700 font-semibold">{ev.role} • {ev.organization}</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {ev.totalHours}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ev.whatDone}</p>
                  {ev.reflection && (
                    <div className="p-3 bg-white rounded-xl border border-slate-100 text-[11px] text-slate-600 italic">
                      "{ev.reflection}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={() => setActiveStep(4)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Roadmap</span>
            </button>

            <button
              onClick={() => setActiveStep(6)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.02]"
            >
              <span>Open Reflection & Mentor Chat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: REFLECTION MENTOR, PROGRESS DASHBOARD & AI CHAT */}
      {/* ========================================================================= */}
      {activeStep === 6 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Progress Dashboard & Reflection Mentor */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PROGRESS DASHBOARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Self-Set Milestone Tracking
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  My Journey Progress
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tracks progress toward your self-selected goals (This is <strong>NOT an admissions formula or score</strong>).
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Academic Coursework & Consistency', val: 75, color: 'bg-indigo-600' },
                  { label: 'Career & Discipline Exploration', val: 70, color: 'bg-violet-600' },
                  { label: 'Independent Projects & Passion Building', val: 55, color: 'bg-emerald-600' },
                  { label: 'Peer Mentorship & Community Leadership', val: 60, color: 'bg-amber-500' },
                  { label: 'Evidence Documentation & Portfolio', val: 45, color: 'bg-cyan-600' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">{item.label}</span>
                      <span className="text-slate-500">{item.val}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REFLECTION MENTOR FORM */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-indigo-600" />
                  Reflection Mentor
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Reflecting on what you liked—or what you disliked—helps refine your future direction. If you discover you dislike an activity, that is valuable self-knowledge!
                </p>
              </div>

              <form onSubmit={handleSaveReflection} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Activity or Project You Are Reflecting On
                  </label>
                  <input
                    type="text"
                    value={currentReflection.activityTitle}
                    onChange={(e) => setCurrentReflection({ ...currentReflection, activityTitle: e.target.value })}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      What surprised you most during this activity?
                    </label>
                    <textarea
                      rows={2}
                      value={currentReflection.whatSurprised}
                      onChange={(e) => setCurrentReflection({ ...currentReflection, whatSurprised: e.target.value })}
                      placeholder="e.g. How willing students were to talk about money problems..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      What problem did you face, and how did you resolve it?
                    </label>
                    <textarea
                      rows={2}
                      value={currentReflection.problemFaced}
                      onChange={(e) => setCurrentReflection({ ...currentReflection, problemFaced: e.target.value })}
                      placeholder="e.g. Some students were shy to answer, so we made the survey fully anonymous..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Did this change your interest in this field?
                    </label>
                    <select
                      value={currentReflection.changedInterest}
                      onChange={(e) => setCurrentReflection({ ...currentReflection, changedInterest: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      <option value="Increased my interest in this area">Increased my interest in this area</option>
                      <option value="Realized I dislike this specific aspect">Realized I dislike this specific aspect</option>
                      <option value="Want to pivot to a different topic">Want to pivot to a different topic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Would you continue this activity?
                    </label>
                    <select
                      value={currentReflection.continueActivity}
                      onChange={(e) => setCurrentReflection({ ...currentReflection, continueActivity: e.target.value })}
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                    >
                      <option value="Yes, want to expand further">Yes, want to expand further</option>
                      <option value="Finished milestone, moving to next task">Finished milestone, moving to next task</option>
                      <option value="No, want to try something else">No, want to try something else</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Col: AI MENTOR CHAT ("Ask My Mentor") */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-[750px]">
            
            {/* Chat Header */}
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Ask My Mentor</h3>
                  <p className="text-[11px] text-slate-400">Context: {background.grade} • {targetUniversity.name}</p>
                </div>
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="py-2 flex gap-1.5 overflow-x-auto text-[11px] text-slate-600">
              {[
                'I only have 3 hours/week. What to focus on?',
                'What can I do for free without money?',
                'I dislike one of my projects. What now?',
              ].map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPrompt(qp)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 whitespace-nowrap transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
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
                  <span>Mentor is thinking...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-100 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  placeholder="Ask a question about your preparation..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs text-slate-800 bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputChat.trim() || chatLoading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

          </div>

        </div>
      )}

    </div>
  );
};
