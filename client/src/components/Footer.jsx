import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Globe2, ShieldCheck, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t, isAmharic } = useLanguage();
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">{t('brandName')}</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t('brandSubtitle')}
            </p>
            <div className="pt-2 flex items-center flex-wrap gap-2 sm:gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isAmharic ? 'የተረጋገጡ እድሎች' : 'Verified Opportunities'}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <Globe2 className="w-4 h-4 text-indigo-400" />
                {isAmharic ? 'አለም አቀፍ እና ኢትዮጵያዊ' : 'Global & African Focus'}
              </span>
            </div>
          </div>

          {/* Careers Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">{t('navCareers')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/careers?category=Technology" className="hover:text-white transition-colors">{isAmharic ? 'ቴክኖሎጂ እና AI' : 'Technology & AI'}</Link></li>
              <li><Link to="/careers?category=Medicine+%26+Health" className="hover:text-white transition-colors">{isAmharic ? 'ህክምና እና ጤና' : 'Medicine & Health'}</Link></li>
              <li><Link to="/careers?category=Engineering" className="hover:text-white transition-colors">{isAmharic ? 'ኢንጂነሪንግ' : 'Engineering'}</Link></li>
              <li><Link to="/careers?category=Business" className="hover:text-white transition-colors">{isAmharic ? 'ቢዝነስ እና ስራ ፈጠራ' : 'Business & Startups'}</Link></li>
              <li><Link to="/careers?category=Law" className="hover:text-white transition-colors">{isAmharic ? 'ህግ እና ፖሊሲ' : 'Law & Public Policy'}</Link></li>
              <li><Link to="/careers" className="text-indigo-400 hover:text-indigo-300 font-medium">{t('viewAllCareers')} &rarr;</Link></li>
            </ul>
          </div>

          {/* Scholarships & Opportunities */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">{t('navScholarships')}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/scholarships?fundingType=Fully+funded" className="hover:text-white transition-colors">Fully Funded Awards</Link></li>
              <li><Link to="/scholarships?educationLevel=High+school" className="hover:text-white transition-colors">High School & Pre-U</Link></li>
              <li><Link to="/scholarships?educationLevel=Undergraduate" className="hover:text-white transition-colors">Undergraduate Degrees</Link></li>
              <li><Link to="/matches" className="hover:text-white transition-colors">Personal Eligibility Matcher</Link></li>
              <li><Link to="/opportunities" className="hover:text-white transition-colors">Competitions & Summer Camps</Link></li>
              <li><Link to="/saved" className="hover:text-white transition-colors">Saved Opportunities</Link></li>
            </ul>
          </div>

          {/* Guidance & Tools */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Student Tools</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/universities" className="hover:text-white transition-colors">Universities Directory</Link></li>
              <li><Link to="/university-mentor" className="text-amber-300 hover:text-amber-200 transition-colors font-semibold">University Journey Mentor</Link></li>
              <li><Link to="/career-quiz" className="hover:text-white transition-colors">Interactive Career Quiz</Link></li>
              <li><Link to="/applications" className="hover:text-white transition-colors">Application Tracker</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link></li>
              <li><Link to="/discussions" className="hover:text-white transition-colors">Student Discussions & Q&A</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">How Fyndora Works</Link></li>
              <li><Link to="/admin" className="text-slate-500 hover:text-slate-400 text-xs">Admin Management</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="text-center md:text-left max-w-2xl leading-relaxed">
            <strong>Educational Disclaimer:</strong> Fyndora compiles publicly accessible scholarship deadlines, eligibility criteria, and career insights to assist students. Always review final terms on the official scholarship provider websites before submitting applications.
          </p>
          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            <span>Built for students worldwide</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline mx-1" />
            <span>&copy; {new Date().getFullYear()} Fyndora</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
