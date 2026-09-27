import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Building2, 
  Search, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Universities = () => {
  const { t, isAmharic } = useLanguage();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [onlyNeedBlind, setOnlyNeedBlind] = useState(false);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await api.getUniversities();
      if (res?.universities) {
        setUniversities(res.universities);
      }
    } catch (err) {
      console.error('Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const regions = ['All', 'North America', 'Europe', 'Africa'];

  const filteredUniversities = universities.filter(u => {
    const matchesRegion = selectedRegion === 'All' || u.region === selectedRegion;
    const matchesNeedBlind = !onlyNeedBlind || u.needBlindInternational;
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.popularMajors && u.popularMajors.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesRegion && matchesNeedBlind && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {isAmharic ? 'የዩኒቨርሲቲ የጉዞ አማካሪ' : 'University Journey Mentor'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {isAmharic ? 'ዩኒቨርሲቲዎችን ያስሱ እና የሁለተኛ ደረጃ ዝግጅትዎን ያቅዱ' : 'Explore Universities & Chart Your High-School Preparation'}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {isAmharic ? 'ይፋዊ የመግቢያ መስፈርቶችን፣ የውጤት ፖሊሲዎችን እና የነጻ የገንዘብ ድጋፎችን ይወቁ። ከዚያም ለእርስዎ ፍላጎት የሚመጥን የዝግጅት እቅድ ያውጡ።' : 'Discover official admissions policies, academic requirements, and financial aid guarantees. Then build a personalized high-school journey tailored to your background and passions.'}
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Philosophy Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3.5 text-xs sm:text-sm text-indigo-950">
        <Compass className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-indigo-900">{isAmharic ? 'የዩኒቨርሲቲ አማካሪው እንዴት ይሰራል?' : 'How the University Mentor Works:'}</strong>
          <p className="text-slate-600 leading-relaxed text-xs">
            {isAmharic ? 'ተማሪዎች እውነተኛ ፍላጎታቸውን እንዲመረምሩ እና በራሳቸው የሚሰሩ ፕሮጀክቶችን እንዲፈጥሩ በይፋ የሚገኙ መመሪያዎችን እንጠቀማለን። ፈጽሞ የሀሰት መግቢያ ዋስትና አንሰጥም።' : 'We use each university’s publicly available preparation guidance to help you discover authentic activities, design independent projects, and prepare academically. We never fabricate admissions formulas or promise guaranteed acceptance.'}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAmharic ? 'ዩኒቨርሲቲ በስም፣ በሀገር ወይም በትምህርት ዘርፍ ይፈልጉ (ለምሳሌ Harvard, Computer Science)...' : 'Search universities by name, country, or popular majors (e.g. Harvard, Computer Science)...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-sm text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Region Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedRegion === reg
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {reg === 'All' ? (isAmharic ? 'ሁሉም' : 'All') : t(reg)}
            </button>
          ))}

          <button
            onClick={() => setOnlyNeedBlind(!onlyNeedBlind)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              onlyNeedBlind
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${onlyNeedBlind ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{isAmharic ? 'የፋይናንስ አቅም የማያዩ (Need-Blind)' : 'Need-Blind for International'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Universities */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <div className="h-6 w-32 bg-slate-200 rounded"></div>
              <div className="h-4 w-48 bg-slate-100 rounded"></div>
              <div className="h-20 bg-slate-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredUniversities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Universities Found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or reset the region filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((uni) => (
            <div
              key={uni.slug || uni.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {uni.country}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[140px]">{uni.city}</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                    {uni.overview}
                  </p>
                </div>

                {/* Quick Facts */}
                <div className="space-y-2 pt-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500">{isAmharic ? 'የመግቢያ ምጣኔ:' : 'Acceptance Rate:'}</span>
                    <span className="font-bold text-slate-800">{uni.acceptanceRate || (isAmharic ? 'ከፍተኛ ፉክክር' : 'Selective')}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500">{isAmharic ? 'የገንዘብ ድጋፍ:' : 'Financial Aid:'}</span>
                    <span className="font-semibold text-emerald-700 text-right truncate max-w-[170px]">
                      {uni.needBlindInternational
                        ? (isAmharic ? 'ለአለም አቀፍ Need-Blind' : 'Need-Blind for All')
                        : (isAmharic ? '100% ሙሉ ድጋፍ' : '100% Need Met')}
                    </span>
                  </div>
                </div>

                {/* Popular Majors Chips */}
                {uni.popularMajors && uni.popularMajors.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {isAmharic ? 'ተፈላጊ የትምህርት ዘርፎች' : 'Popular Programs'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {uni.popularMajors.slice(0, 3).map((major, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {t(major)}
                        </span>
                      ))}
                      {uni.popularMajors.length > 3 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{uni.popularMajors.length - 3} {isAmharic ? 'ተጨማሪ' : 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between gap-2">
                <Link
                  to={`/universities/${uni.slug || uni.id}`}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  {isAmharic ? 'መገለጫውን ይመልከቱ' : 'View Profile'}
                </Link>

                <Link
                  to={`/universities/${uni.slug || uni.id}?tab=journey`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-all group-hover:scale-[1.02]"
                >
                  <span>{isAmharic ? 'የዝግጅት እቅድ አውጣ' : 'Build Journey'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
