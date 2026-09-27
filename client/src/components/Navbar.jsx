import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  BookOpen,
  Award,
  Sparkles,
  User,
  LogOut,
  Menu,
  X,
  Bookmark,
  FileCheck2,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Target,
  Home as HomeIcon,
  Globe,
  Building2,
  Info
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const { user, logout, isAdmin, toggleAdminRole } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tabletMoreOpen, setTabletMoreOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const tabletMoreRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Automatically close all menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setTabletMoreOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tabletMoreRef.current && !tabletMoreRef.current.contains(e.target)) {
        setTabletMoreOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  // Nav link style generator
  const desktopNavLinkClasses = ({ isActive }) =>
    `px-2 xl:px-2.5 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium transition-colors shrink-0 whitespace-nowrap ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
    }`;

  const tabletNavLinkClasses = ({ isActive }) =>
    `px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 whitespace-nowrap ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-semibold transition-all min-h-[46px] ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold'
        : 'text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* ========================================================= */}
          {/* LOGO (Stays pinned on the left on all devices) */}
          {/* ========================================================= */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div className="flex items-center">
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Fyndora
              </span>
              <span className="hidden xl:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/80">
                Student Hub
              </span>
            </div>
          </Link>

          {/* ========================================================= */}
          {/* 1. DESKTOP NAVIGATION (1024px and above) */}
          {/* All 9 items visible with responsive gap/padding */}
          {/* ========================================================= */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 shrink-0">
            <NavLink to="/" className={desktopNavLinkClasses}>{t('navHome')}</NavLink>
            <NavLink to="/careers" className={desktopNavLinkClasses}>{t('navCareers')}</NavLink>
            <NavLink to="/scholarships" className={desktopNavLinkClasses}>{t('navScholarships')}</NavLink>
            <NavLink to="/matches" className={desktopNavLinkClasses}>
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-violet-500 shrink-0" />
                <span>{t('navMatches')}</span>
              </span>
            </NavLink>
            <NavLink to="/opportunities" className={desktopNavLinkClasses}>{t('navOpportunities')}</NavLink>
            <NavLink to="/universities" className={desktopNavLinkClasses}>{t('navUniversities')}</NavLink>
            
            {/* Uni Mentor with badge */}
            <NavLink to="/university-mentor" className={desktopNavLinkClasses}>
              <span className="flex items-center gap-1 text-violet-700 dark:text-violet-300 bg-violet-50/90 dark:bg-violet-950/60 px-1.5 xl:px-2 py-0.5 rounded-md font-bold">
                <Compass className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                <span>{t('navUniMentor')}</span>
              </span>
            </NavLink>

            {/* Career Quiz with badge */}
            <NavLink to="/career-quiz" className={desktopNavLinkClasses}>
              <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 px-1.5 xl:px-2 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{t('navCareerQuiz')}</span>
              </span>
            </NavLink>

            <NavLink to="/about" className={desktopNavLinkClasses}>{t('navAbout')}</NavLink>
          </nav>

          {/* ========================================================= */}
          {/* 2. TABLET NAVIGATION (768px to 1023px) */}
          {/* Primary items visible, secondary in clean "More ▾" menu */}
          {/* ========================================================= */}
          <nav className="hidden md:flex lg:hidden items-center space-x-1 shrink-0">
            <NavLink to="/" className={tabletNavLinkClasses}>{t('navHome')}</NavLink>
            <NavLink to="/careers" className={tabletNavLinkClasses}>{t('navCareers')}</NavLink>
            <NavLink to="/scholarships" className={tabletNavLinkClasses}>{t('navScholarships')}</NavLink>
            <NavLink to="/universities" className={tabletNavLinkClasses}>{t('navUniversities')}</NavLink>
            
            {/* Uni Mentor */}
            <NavLink to="/university-mentor" className={tabletNavLinkClasses}>
              <span className="flex items-center gap-1 text-violet-700 dark:text-violet-300 bg-violet-50/80 dark:bg-violet-950/60 px-1.5 py-0.5 rounded-md font-bold">
                <Compass className="w-3 h-3 text-violet-600" />
                <span>{t('navUniMentor')}</span>
              </span>
            </NavLink>

            {/* "More ▾" Dropdown for Secondary Items */}
            <div className="relative" ref={tabletMoreRef}>
              <button
                type="button"
                onClick={() => setTabletMoreOpen(!tabletMoreOpen)}
                className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  tabletMoreOpen || ['/matches', '/opportunities', '/career-quiz', '/about'].includes(location.pathname)
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{t('navMore') || 'More'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${tabletMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {tabletMoreOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <NavLink
                    to="/matches"
                    onClick={() => setTabletMoreOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <Target className="w-4 h-4 text-violet-500" />
                    <span>{t('navMatches')}</span>
                  </NavLink>

                  <NavLink
                    to="/opportunities"
                    onClick={() => setTabletMoreOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>{t('navOpportunities')}</span>
                  </NavLink>

                  <NavLink
                    to="/career-quiz"
                    onClick={() => setTabletMoreOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{t('navCareerQuiz')}</span>
                  </NavLink>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  <NavLink
                    to="/about"
                    onClick={() => setTabletMoreOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                  >
                    <Info className="w-4 h-4 text-slate-400" />
                    <span>{t('navAbout')}</span>
                  </NavLink>
                </div>
              )}
            </div>
          </nav>

          {/* ========================================================= */}
          {/* RIGHT ACTION AREA (Desktop & Tablet: Language, Theme, Auth) */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center gap-1.5 xl:gap-2 shrink-0">
            {/* Language Selector */}
            <LanguageToggle />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Role Switcher Demo Helper (only shown on md+) */}
            {user && (
              <button
                onClick={toggleAdminRole}
                title="Click to toggle between Student and Admin mode"
                className={`text-[11px] xl:text-xs px-2 py-0.5 rounded-full font-medium border transition-colors ${
                  isAdmin
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                Role: {user.role === 'admin' ? 'Admin' : 'Student'} ⇄
              </button>
            )}

            {/* User Account Dropdown or Login / Sign Up */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 xl:gap-2 p-1 xl:p-1.5 pr-2 xl:pr-3 rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs xl:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[80px] xl:max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs xl:text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      {t('navDashboard')}
                    </Link>

                    <Link
                      to="/saved"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs xl:text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400" />
                      {t('navSaved')}
                    </Link>

                    <Link
                      to="/applications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs xl:text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                    >
                      <FileCheck2 className="w-4 h-4 text-slate-400" />
                      {t('navApplications')}
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs xl:text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      {t('navProfile')}
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs xl:text-sm text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/40 hover:bg-purple-100"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        {t('navAdmin')}
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs xl:text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('navSignOut')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 xl:gap-2">
                <Link
                  to="/login"
                  className="px-2.5 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                >
                  {t('navLogIn')}
                </Link>
                <Link
                  to="/register"
                  className="px-3 xl:px-4 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all shrink-0"
                >
                  {t('navSignUp')}
                </Link>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 3. MOBILE CONTROLS (below 768px: Logo on left, compact actions on right) */}
          {/* Essential actions: Language, Theme, and Hamburger button */}
          {/* ========================================================= */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <LanguageToggle variant="button" />
            <ThemeToggle variant="button" />
            
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MOBILE NAVIGATION DRAWER & BACKDROP (<768px) */}
      {/* Contains all 9 navigation links + touch friendly user actions */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay for clicking outside */}
          <div
            className="fixed inset-0 top-16 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Mobile Navigation Panel */}
          <div className="relative z-50 md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 animate-in slide-in-from-top-3 duration-200">
            
            {/* The 9 Primary Navigation Links (touch-friendly, large targets) */}
            <div className="p-3 sm:p-4 space-y-1">
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <div className="flex items-center gap-3">
                  <HomeIcon className="w-5 h-5 text-slate-400" />
                  <span>{t('navHome')}</span>
                </div>
              </NavLink>

              <NavLink to="/careers" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  <span>{t('navCareers')}</span>
                </div>
              </NavLink>

              <NavLink to="/scholarships" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-slate-400" />
                  <span>{t('navScholarships')}</span>
                </div>
              </NavLink>

              <NavLink to="/matches" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-violet-500" />
                  <span>{t('navMatches')}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
                  AI Fit
                </span>
              </NavLink>

              <NavLink to="/opportunities" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <span>{t('navOpportunities')}</span>
                </div>
              </NavLink>

              <NavLink to="/universities" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <span>{t('navUniversities')}</span>
                </div>
              </NavLink>

              <NavLink to="/university-mentor" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-violet-600" />
                  <span className="font-bold text-violet-700 dark:text-violet-300">{t('navUniMentor')}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
                  New
                </span>
              </NavLink>

              <NavLink to="/career-quiz" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{t('navCareerQuiz')}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  3 min
                </span>
              </NavLink>

              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-slate-400" />
                  <span>{t('navAbout')}</span>
                </div>
              </NavLink>
            </div>

            {/* Mobile Account Section */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-950/50 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleAdminRole}
                      className="text-[10px] px-2 py-1 rounded-full font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      {user.role === 'admin' ? 'Admin Mode' : 'Student Mode'} ⇄
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                      <span>{t('navDashboard')}</span>
                    </Link>

                    <Link
                      to="/saved"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"
                    >
                      <Bookmark className="w-4 h-4 text-indigo-500" />
                      <span>{t('navSaved')}</span>
                    </Link>

                    <Link
                      to="/applications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"
                    >
                      <FileCheck2 className="w-4 h-4 text-indigo-500" />
                      <span>{t('navApplications')}</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      <span>{t('navProfile')}</span>
                    </Link>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-bold text-xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t('navAdmin')}</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('navSignOut')}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
                  >
                    {t('navLogIn')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-colors"
                  >
                    {t('navSignUp')}
                  </Link>
                </div>
              )}
            </div>

          </div>
        </>
      )}
    </header>
  );
};
