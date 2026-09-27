import React, { useState } from 'react';
import { 
  GraduationCap, 
  Compass, 
  Sparkles, 
  Calendar, 
  FileText, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
  { id: 'careers', label: 'Careers', icon: Compass },
  { id: 'extracurriculars', label: 'Activities', icon: Sparkles },
  { id: 'roadmap', label: 'Roadmap', icon: Calendar },
  { id: 'essays', label: 'Essays', icon: FileText },
];

const PROMPTS = [
  {
    category: 'scholarships',
    title: 'Help me find scholarships',
    description: 'Find fully funded opportunities matching my grade and country',
    text: 'Help me find scholarships and financial aid opportunities that match my profile.',
  },
  {
    category: 'scholarships',
    title: 'Universities with 100% Need Met',
    description: 'Which top institutions cover full demonstrated need for internationals?',
    text: 'Which universities in the US and globally meet 100% of demonstrated financial need for international students?',
  },
  {
    category: 'careers',
    title: 'Explore careers for my interests',
    description: 'Match favorite subjects to high-growth degree paths',
    text: 'Explore careers that match my academic interests and favorite school subjects.',
  },
  {
    category: 'careers',
    title: 'Computer Science & Economics',
    description: 'How can I combine tech skills with economics in college?',
    text: 'How can I combine an interest in Computer Science and Quantitative Economics in university?',
  },
  {
    category: 'extracurriculars',
    title: 'Suggest $0-budget passion projects',
    description: 'Meaningful community and research initiatives at zero cost',
    text: 'Suggest 3 authentic extracurricular activities or passion projects I can start with a $0 budget.',
  },
  {
    category: 'extracurriculars',
    title: 'Start a Peer Mentorship Group',
    description: 'Step-by-step guidance on creating a student study group',
    text: 'How do I start and organize an authentic student peer tutoring or study club at my high school?',
  },
  {
    category: 'roadmap',
    title: 'Build my preparation roadmap',
    description: 'Custom weekly and monthly action plan for my grade level',
    text: 'Build my university preparation plan and break it down into realistic monthly milestones.',
  },
  {
    category: 'roadmap',
    title: 'What should I focus on this month?',
    description: 'Clear priorities based on my available weekly hours',
    text: 'What should I focus on this month to prepare for university admissions without getting overwhelmed?',
  },
  {
    category: 'essays',
    title: 'Brainstorm personal statement ideas',
    description: 'Identify authentic stories from my own life experiences',
    text: 'Help me brainstorm compelling essay topics and personal statement themes from my life experiences.',
  },
  {
    category: 'essays',
    title: 'Prepare for Admissions Interviews',
    description: 'Practice questions and frameworks to showcase authentic curiosity',
    text: 'How should I prepare for university and scholarship interviews? What questions should I expect?',
  },
];

export const ChatQuickPrompts = ({ onSelectPrompt, pageContext }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPrompts = selectedCategory === 'all'
    ? PROMPTS
    : PROMPTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-4 py-2">
      
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Context-Specific Banner if viewing a page */}
      {pageContext?.title && (
        <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Active Page Context
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Ask about: <strong className="text-indigo-700 dark:text-indigo-300">{pageContext.title}</strong>
            </p>
          </div>
          <button
            onClick={() => onSelectPrompt(`Tell me more about ${pageContext.title}, its eligibility requirements, and how I should prepare.`)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1"
          >
            <span>Ask Mentor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Prompt Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredPrompts.slice(0, 6).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt.text)}
            className="text-left p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all group flex flex-col justify-between"
          >
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                <span>{prompt.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {prompt.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
