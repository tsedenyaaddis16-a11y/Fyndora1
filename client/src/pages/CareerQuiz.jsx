import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QUIZ_QUESTIONS, DEMO_CAREERS } from '../data/mockData';
import { CareerCard } from '../components/CareerCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Info,
  Compass,
  Award,
  BookOpen
} from 'lucide-react';

export const CareerQuiz = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const { t, tr, isAmharic } = useLanguage();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [categoryScores, setCategoryScores] = useState({});
  const [matchedCareers, setMatchedCareers] = useState([]);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (answers[currentQuestion.id] === undefined) {
      addToast(isAmharic ? 'እባክዎ ለመቀጠል አንዱን ምርጫ ይምረጡ።' : 'Please choose an option to continue.', 'info');
      return;
    }

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const scores = {};

    QUIZ_QUESTIONS.forEach(q => {
      const selectedIndex = answers[q.id];
      if (selectedIndex !== undefined) {
        const option = q.options[selectedIndex];
        if (option && option.weights) {
          Object.entries(option.weights).forEach(([cat, val]) => {
            scores[cat] = (scores[cat] || 0) + val;
          });
        }
      }
    });

    // Sort categories by score
    const sortedCategories = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]);

    const maxScore = sortedCategories[0] ? sortedCategories[0][1] : 1;
    const normalizedScores = {};
    sortedCategories.forEach(([cat, val]) => {
      normalizedScores[cat] = Math.min(98, Math.round((val / maxScore) * 100));
    });

    setCategoryScores(normalizedScores);

    // Pick top matching careers based on top 3 categories
    const topCategoryNames = sortedCategories.slice(0, 3).map(([cat]) => cat);
    const matched = DEMO_CAREERS.filter(c => topCategoryNames.includes(c.category));

    setMatchedCareers(matched.slice(0, 6));
    setIsCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If logged in, automatically save top interests to profile
    if (user && updateProfile) {
      updateProfile({ interests: topCategoryNames });
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    setCategoryScores({});
    setMatchedCareers([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {!isCompleted ? (
        <div className="space-y-8">
          
          {/* Quiz Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {t('Fyndora Career Alignment Tool')}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t('Interactive Career Questionnaire')}
            </h1>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              {t('Answer honestly based on what you actually enjoy, not what others think you should choose. There are no right or wrong answers!')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{t('Question')} {currentStep + 1} {t('of')} {QUIZ_QUESTIONS.length}</span>
              <span className="text-indigo-600 font-bold">{progressPercent}% {t('Completed')}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {tr(currentQuestion.question)}
            </h2>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-100'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 fill-current" />}
                    </div>
                    <span className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                      {tr(option.text)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Nav Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('Previous')}
              </button>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 transition-all hover:scale-105"
              >
                <span>{currentStep === QUIZ_QUESTIONS.length - 1 ? t('See My Matches') : t('Next Question')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* QUIZ RESULTS VIEW */
        <div className="space-y-12 animate-in fade-in duration-500">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/30">
              <Sparkles className="w-8 h-8" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {t('Your Career Matches')}
            </h1>

            {/* CRITICAL NOTE: Do not tell students that one career is objectively best */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 max-w-2xl mx-auto border border-white/15 text-left flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                <strong>{t('These careers match several of the interests and preferences you selected.')}</strong> {t('We encourage you to explore multiple options—your passions can evolve as you study, volunteer, and gain experience.')}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold transition-colors border border-white/20"
              >
                <RotateCcw className="w-4 h-4" />
                {t('Retake Questionnaire')}
              </button>
            </div>
          </div>

          {/* Top Matching Categories Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              {t('Your Interest Alignment Breakdown')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(categoryScores)
                .slice(0, 4)
                .map(([cat, percent]) => (
                  <div key={cat} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                      <span>{tr(cat)}</span>
                      <span className="text-indigo-600">{percent}% {t('Match')}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Recommended Careers Grid */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900">{t('Recommended Career Pathways')}</h2>
                <p className="text-sm text-slate-600">
                  {t('Click any career below to see required high school subjects and degrees.')}
                </p>
              </div>
              <Link
                to="/careers"
                className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                {t('Browse All Pathways →')}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedCareers.map(career => (
                <CareerCard key={career.id || career._id} career={career} />
              ))}
            </div>
          </div>

          {/* Next Step Callout: Find Scholarships in these areas */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-indigo-100">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl font-bold">{t('Now, let\'s find scholarships for these paths!')}</h3>
              <p className="text-indigo-100 text-sm max-w-lg">
                {t('Discover fully funded university and pre-university awards that match your nationality and grade level.')}
              </p>
            </div>
            <Link
              to="/matches"
              className="px-6 py-3.5 rounded-2xl bg-white text-indigo-900 font-bold text-sm shrink-0 hover:bg-slate-100 transition-colors shadow-lg"
            >
              {t('Match Eligible Scholarships')}
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};
