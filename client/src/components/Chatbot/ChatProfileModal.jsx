import React, { useState, useEffect } from 'react';
import { 
  User, 
  X, 
  Sparkles, 
  Check, 
  Globe, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const COMMON_INTERESTS = [
  'Mathematics', 'Computer Science', 'Economics', 'Physics', 
  'Biology', 'Chemistry', 'Public Policy', 'Business & Finance',
  'Engineering', 'Literature & Writing', 'Arts & Design', 'Environmental Science'
];

export const ChatProfileModal = ({ 
  isOpen, 
  onClose, 
  currentProfile, 
  onSaveProfile 
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    preferredName: '',
    country: 'Ethiopia',
    grade: 'Grade 11',
    academicInterests: ['Mathematics', 'Computer Science'],
    careerGoals: ['Software Engineering', 'Quantitative Economics'],
    targetUniversities: ['Harvard University', 'University of Toronto'],
    extracurriculars: 'Math Club, volunteer tutor for Grade 9 students',
    weeklyHours: '3–5 hours/week',
    financialConstraints: 'Need free / full scholarships',
  });

  const [customInterest, setCustomInterest] = useState('');

  // Hydrate form when profile changes or opens
  useEffect(() => {
    if (currentProfile) {
      setForm((prev) => ({
        ...prev,
        ...currentProfile,
        preferredName: currentProfile.preferredName || user?.name || '',
        country: currentProfile.country || user?.country || 'Ethiopia',
        grade: currentProfile.grade || user?.grade || 'Grade 11',
      }));
    } else if (user) {
      setForm((prev) => ({
        ...prev,
        preferredName: user.name || '',
        country: user.country || 'Ethiopia',
        grade: user.grade || 'Grade 11',
        academicInterests: user.interests?.length ? user.interests : prev.academicInterests,
        careerGoals: user.preferredFields?.length ? user.preferredFields : prev.careerGoals,
        targetUniversities: user.preferredCountries?.length ? user.preferredCountries : prev.targetUniversities,
        financialConstraints: user.fundingPreference || prev.financialConstraints,
      }));
    }
  }, [currentProfile, user, isOpen]);

  if (!isOpen) return null;

  const toggleInterest = (interest) => {
    setForm((prev) => {
      const exists = prev.academicInterests.includes(interest);
      const updated = exists
        ? prev.academicInterests.filter((i) => i !== interest)
        : [...prev.academicInterests, interest];
      return { ...prev, academicInterests: updated };
    });
  };

  const handleAddCustomInterest = (e) => {
    e.preventDefault();
    if (!customInterest.trim()) return;
    if (!form.academicInterests.includes(customInterest.trim())) {
      setForm((prev) => ({
        ...prev,
        academicInterests: [...prev.academicInterests, customInterest.trim()],
      }));
    }
    setCustomInterest('');
  };

  const handleSyncAccount = () => {
    if (!user) {
      addToast('No logged in account to sync. You can fill in the fields below manually!', 'info');
      return;
    }
    setForm((prev) => ({
      ...prev,
      preferredName: user.name || prev.preferredName,
      country: user.country || prev.country,
      grade: user.grade || prev.grade,
      academicInterests: user.interests?.length ? user.interests : prev.academicInterests,
      careerGoals: user.preferredFields?.length ? user.preferredFields : prev.careerGoals,
      targetUniversities: user.preferredCountries?.length ? user.preferredCountries : prev.targetUniversities,
      financialConstraints: user.fundingPreference || prev.financialConstraints,
    }));
    addToast('Synced profile details from your Fyndora account!', 'success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                Personalize Your AI Mentor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Helps the mentor tailor roadmaps and recommendations to you
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 scrollbar-thin">
          
          {/* Sync Account Banner */}
          {user && (
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between">
              <div className="text-xs text-indigo-950 dark:text-indigo-200">
                Logged in as <strong>{user.name}</strong> ({user.email})
              </div>
              <button
                type="button"
                onClick={handleSyncAccount}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sync Account</span>
              </button>
            </div>
          )}

          {/* Name & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>Preferred Name</span>
              </label>
              <input
                type="text"
                value={form.preferredName}
                onChange={(e) => setForm({ ...form, preferredName: e.target.value })}
                placeholder="e.g. Selam, Alex, David"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>Country of Residence</span>
              </label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="e.g. Ethiopia, Kenya, Ghana"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Grade & Weekly Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                <span>Current Grade</span>
              </label>
              <select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              >
                <option value="Grade 9">Grade 9 (Freshman)</option>
                <option value="Grade 10">Grade 10 (Sophomore)</option>
                <option value="Grade 11">Grade 11 (Junior)</option>
                <option value="Grade 12">Grade 12 (Senior)</option>
                <option value="Gap Year">Gap Year</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Available Project Time</span>
              </label>
              <select
                value={form.weeklyHours}
                onChange={(e) => setForm({ ...form, weeklyHours: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
              >
                <option value="1–2 hours/week">1–2 hours/week (Light)</option>
                <option value="3–5 hours/week">3–5 hours/week (Balanced)</option>
                <option value="6–10 hours/week">6–10 hours/week (Deep Focus)</option>
              </select>
            </div>
          </div>

          {/* Academic Interests */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Academic Interests & Subjects</span>
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {COMMON_INTERESTS.map((int) => {
                const selected = form.academicInterests.includes(int);
                return (
                  <button
                    key={int}
                    type="button"
                    onClick={() => toggleInterest(int)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                      selected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {int}
                  </button>
                );
              })}
            </div>

            {/* Custom Interest Input */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="Add other subject or interest..."
                className="flex-1 text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Financial Circumstances */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
              <span>Financial Constraints & Needs</span>
            </label>
            <select
              value={form.financialConstraints}
              onChange={(e) => setForm({ ...form, financialConstraints: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="Need free / full scholarships">100% Free / Full Scholarships Required ($0 budget)</option>
              <option value="Partial financial aid needed">Partial Financial Aid / Tuition Waiver Needed</option>
              <option value="Self-funded / Flexible">Self-funded / Budget Flexible</option>
            </select>
          </div>

          {/* Current Extracurriculars */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Current Activities & Hobbies
            </label>
            <textarea
              rows={2}
              value={form.extracurriculars}
              onChange={(e) => setForm({ ...form, extracurriculars: e.target.value })}
              placeholder="e.g. School debate team, coding on weekends, helping at family shop"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Apply to Chat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
