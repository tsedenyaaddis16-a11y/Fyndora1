import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Sparkles, Building2, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CATEGORY_COLORS = {
  Technology: 'bg-blue-50 text-blue-700 border-blue-200',
  'Medicine & Health': 'bg-rose-50 text-rose-700 border-rose-200',
  Engineering: 'bg-amber-50 text-amber-700 border-amber-200',
  Business: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Science: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Law: 'bg-purple-50 text-purple-700 border-purple-200',
  'Arts & Media': 'bg-pink-50 text-pink-700 border-pink-200',
  Education: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Social Sciences': 'bg-teal-50 text-teal-700 border-teal-200',
  Design: 'bg-orange-50 text-orange-700 border-orange-200',
};

export const CareerCard = ({ career }) => {
  const { t, isAmharic } = useLanguage();
  const categoryColor = CATEGORY_COLORS[career.category] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all flex flex-col justify-between">
      <div>
        {/* Category & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColor}`}>
            {t(career.category)}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            {career.workplaces ? `${career.workplaces.length} ${isAmharic ? 'ዘርፎች' : 'sectors'}` : (isAmharic ? 'የተለያዩ' : 'Various')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
          <Link to={`/careers/${career.id || career._id}`}>
            {t(career.title)}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {career.description}
        </p>

        {/* University Majors / Education Pathway */}
        <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            {isAmharic ? 'የሚመከሩ የዩኒቨርሲቲ ዲግሪዎች:' : 'Typical University Pathway:'}
          </div>
          <p className="text-xs text-slate-600 font-medium">
            {career.universitySubjects && career.universitySubjects.slice(0, 2).map(s => t(s)).join(', ')}
            {career.universitySubjects && career.universitySubjects.length > 2 && (isAmharic ? ' እና ሌሎችም' : ' & more')}
          </p>
        </div>

        {/* Key Skills */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-500 mb-2">{isAmharic ? 'ዋና ዋና ክህሎቶች:' : 'Important Skills:'}</div>
          <div className="flex flex-wrap gap-1.5">
            {career.skills && career.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium"
              >
                {t(skill)}
              </span>
            ))}
            {career.skills && career.skills.length > 4 && (
              <span className="text-xs px-2 py-1 text-slate-400 font-medium">
                +{career.skills.length - 4} {isAmharic ? 'ተጨማሪ' : 'more'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/careers/${career.id || career._id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700"
        >
          {isAmharic ? 'ዝርዝር እቅዱን ይመልከቱ' : 'Explore Pathway'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          to={`/career-quiz`}
          title="Take quiz to test alignment with this career"
          className="text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          Test fit
        </Link>
      </div>
    </div>
  );
};
