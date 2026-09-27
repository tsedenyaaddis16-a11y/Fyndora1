import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Globe, GraduationCap, Award, Save, Sparkles, ShieldCheck, Sun, Moon, Laptop, Palette, Check } from 'lucide-react';

export const Profile = () => {
  const { user, updateProfile, toggleAdminRole } = useAuth();
  const { addToast } = useToast();
  const { theme, setTheme, isDark } = useTheme();
  const { language, setLanguage, isAmharic, t } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || 17,
    nationality: user?.nationality || 'Ethiopia',
    country: user?.country || 'Ethiopia',
    grade: user?.grade || 'Grade 11',
    graduationYear: user?.graduationYear || 2027,
    fundingPreference: user?.fundingPreference || 'Fully funded',
    interests: Array.isArray(user?.interests) ? user.interests.join(', ') : (user?.interests || ''),
    preferredCountries: Array.isArray(user?.preferredCountries) ? user.preferredCountries.join(', ') : (user?.preferredCountries || ''),
    preferredFields: Array.isArray(user?.preferredFields) ? user.preferredFields.join(', ') : (user?.preferredFields || ''),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile({
        name: formData.name,
        age: parseInt(formData.age, 10),
        nationality: formData.nationality,
        country: formData.country,
        grade: formData.grade,
        graduationYear: parseInt(formData.graduationYear, 10),
        fundingPreference: formData.fundingPreference,
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
        preferredCountries: formData.preferredCountries.split(',').map(s => s.trim()).filter(Boolean),
        preferredFields: formData.preferredFields.split(',').map(s => s.trim()).filter(Boolean),
      });
      addToast('Profile saved successfully!', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-100">
            {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{formData.name || 'Student Profile'}</h1>
            <p className="text-xs text-slate-500">{formData.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                {formData.grade}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {formData.nationality}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleAdminRole}
          className="self-start sm:self-auto text-xs px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
        >
          Account Role: <strong className="capitalize">{user?.role || 'student'}</strong> (Switch)
        </button>
      </div>

      {/* Theme & Appearance Customizer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Theme & Appearance</h2>
              <p className="text-xs text-slate-500">Choose how Fyndora looks on your device</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">
            Active: {theme}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              addToast('Switched to Light Theme', 'info');
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2.5 ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sun className="w-4 h-4" />
              </div>
              {theme === 'light' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">Selected</span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Light Mode</p>
              <p className="text-[11px] text-slate-500">Bright and clean interface with crisp contrast</p>
            </div>
          </button>

          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              addToast('Switched to Dark Theme', 'info');
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2.5 ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-indigo-900 text-indigo-300 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              {theme === 'dark' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">Selected</span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Dark Mode</p>
              <p className="text-[11px] text-slate-500">Deep slate theme that is easy on the eyes at night</p>
            </div>
          </button>

          {/* System Default Card */}
          <button
            type="button"
            onClick={() => {
              setTheme('system');
              addToast('Set to System Theme', 'info');
            }}
            className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2.5 ${
              theme === 'system'
                ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
                <Laptop className="w-4 h-4" />
              </div>
              {theme === 'system' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">Selected</span>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">System Default</p>
              <p className="text-[11px] text-slate-500">Syncs automatically with your OS preference</p>
            </div>
          </button>
        </div>

        {/* Language Selection inside Profile */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">{isAmharic ? 'የቋንቋ ምርጫ' : 'Interface Language'}</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
              {language === 'am' ? 'አማርኛ' : 'English'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                addToast('Language set to English', 'info');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                language === 'en'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🇬🇧</span>
                <div>
                  <p className="text-xs font-bold text-slate-900">English</p>
                  <p className="text-[10px] text-slate-500">Default interface</p>
                </div>
              </div>
              {language === 'en' && <Check className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setLanguage('am');
                addToast('ቋንቋ ወደ አማርኛ ተቀይሯል', 'info');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                language === 'am'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🇪🇹</span>
                <div>
                  <p className="text-xs font-bold text-slate-900">አማርኛ (Amharic)</p>
                  <p className="text-[10px] text-slate-500">የኢትዮጵያ ቋንቋ</p>
                </div>
              </div>
              {language === 'am' && <Check className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Academic & Personal Information</h2>
          <p className="text-xs text-slate-500">
            This information is used to calculate your personalized eligibility across scholarships and awards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full text-xs p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="13"
              max="35"
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Grade Level</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
              <option value="High School Graduate">High School Graduate</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">High School Graduation Year</label>
            <input
              type="number"
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Funding Preference</label>
            <select
              name="fundingPreference"
              value={formData.fundingPreference}
              onChange={handleChange}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="Fully funded">100% Fully funded (Tuition + Boarding)</option>
              <option value="Partially funded">Partially funded / Tuition Waiver</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Top Career / Subject Interests (comma separated)
            </label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g. Technology, Medicine & Health, Engineering"
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Preferred Study Destinations (comma separated)
            </label>
            <input
              type="text"
              name="preferredCountries"
              value={formData.preferredCountries}
              onChange={handleChange}
              placeholder="e.g. USA, Canada, Germany, Japan"
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Intended University Majors / Fields (comma separated)
            </label>
            <input
              type="text"
              name="preferredFields"
              value={formData.preferredFields}
              onChange={handleChange}
              placeholder="e.g. Computer Science, Mechanical Engineering"
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

    </div>
  );
};
