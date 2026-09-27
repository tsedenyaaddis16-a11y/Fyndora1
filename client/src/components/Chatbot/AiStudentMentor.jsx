import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { UNIVERSITIES } from '../../data/universityData';
import { DEMO_CAREERS, DEMO_SCHOLARSHIPS } from '../../data/mockData';

// Subcomponents
import { ChatMessage } from './ChatMessage';
import { ChatQuickPrompts } from './ChatQuickPrompts';
import { ChatProfileModal } from './ChatProfileModal';
import { ChatHistoryDrawer } from './ChatHistoryDrawer';

// Icons
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Maximize2, 
  Minimize2, 
  History, 
  UserCheck, 
  Plus, 
  RotateCcw, 
  Compass, 
  GraduationCap, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

const SESSION_STORAGE_KEY = 'fyndora_chat_session_id';

const getSessionId = () => {
  let sid = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(SESSION_STORAGE_KEY, sid);
  }
  return sid;
};

export const AiStudentMentor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [sessionId] = useState(getSessionId);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);

  // Student Profile for Personalization
  const [studentProfile, setStudentProfile] = useState({
    preferredName: user?.name || '',
    country: user?.country || 'Ethiopia',
    grade: user?.grade || 'Grade 11',
    academicInterests: user?.interests || ['Mathematics', 'Computer Science'],
    careerGoals: user?.preferredFields || ['Software Engineering'],
    targetUniversities: user?.preferredCountries || ['Harvard University'],
    weeklyHours: '3–5 hours/week',
    financialConstraints: user?.fundingPreference || 'Need free / full scholarships',
  });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // -------------------------------------------------------------
  // PAGE CONTEXT RESOLUTION
  // -------------------------------------------------------------
  const resolvePageContext = () => {
    const path = location.pathname;

    if (path.startsWith('/universities/')) {
      const slug = path.replace('/universities/', '');
      const uni = UNIVERSITIES.find((u) => u.slug === slug);
      if (uni) {
        return {
          type: 'University Profile',
          id: uni.slug,
          title: uni.name,
          details: {
            country: uni.country,
            city: uni.city,
            acceptanceRate: uni.acceptanceRate,
            needBlind: uni.needBlindInternational,
            meetsFullNeed: uni.meetsFullNeed,
          },
        };
      }
    }

    if (path.startsWith('/careers/')) {
      const id = path.replace('/careers/', '');
      const car = DEMO_CAREERS.find((c) => c.id === id);
      if (car) {
        return {
          type: 'Career Pathway',
          id: car.id,
          title: car.title,
          details: { category: car.category, skills: car.skills?.slice(0, 3) },
        };
      }
    }

    if (path.startsWith('/scholarships/')) {
      const id = path.replace('/scholarships/', '');
      const sch = DEMO_SCHOLARSHIPS.find((s) => s.id === id);
      if (sch) {
        return {
          type: 'Scholarship Opportunity',
          id: sch.id,
          title: sch.title,
          details: { provider: sch.provider, fundingType: sch.fundingType, deadline: sch.deadline },
        };
      }
    }

    if (path === '/career-quiz') {
      return { type: 'Tool', id: 'career-quiz', title: 'Interactive Career Quiz' };
    }
    if (path === '/opportunities') {
      return { type: 'Hub', id: 'opportunities', title: 'Extracurricular & Summer Opportunities' };
    }
    if (path === '/dashboard') {
      return { type: 'Dashboard', id: 'dashboard', title: 'Student Journey Dashboard' };
    }
    if (path === '/applications') {
      return { type: 'Tracker', id: 'applications', title: 'Application Tracker' };
    }

    return null;
  };

  const activePageContext = resolvePageContext();

  // -------------------------------------------------------------
  // INITIAL DATA LOADING
  // -------------------------------------------------------------
  useEffect(() => {
    const initChat = async () => {
      // 1. Fetch AI Status
      try {
        const status = await api.getChatStatus();
        setAiStatus(status);
      } catch (e) {
        console.warn('Status check warning:', e);
      }

      // 2. Fetch or Sync Profile
      try {
        const profRes = await api.getChatStudentProfile(sessionId);
        if (profRes?.profile) {
          setStudentProfile((prev) => ({ ...prev, ...profRes.profile }));
        }
      } catch (e) {
        console.warn('Profile fetch warning:', e);
      }

      // 3. Fetch Conversations
      try {
        const convRes = await api.getChatConversations(sessionId);
        if (convRes?.conversations?.length > 0) {
          setConversations(convRes.conversations);
          // Load most recent conversation
          const latest = convRes.conversations[0];
          setCurrentConversationId(latest.id);
          const details = await api.getChatConversationDetails(latest.id, sessionId);
          if (details?.conversation?.messages) {
            setMessages(details.conversation.messages);
          }
        }
      } catch (e) {
        console.warn('Conversations fetch warning:', e);
      }
    };

    initChat();
  }, [sessionId, user]);

  // Keyboard shortcut listener (Ctrl+/ or Cmd+/) and custom event to toggle chatbot
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    const handleCustomOpen = (e) => {
      setIsOpen(true);
      if (e.detail?.prompt) {
        setTimeout(() => {
          handleSendMessage(e.detail.prompt);
        }, 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-ai-mentor', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-ai-mentor', handleCustomOpen);
    };
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Auto-resize input textarea
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  // -------------------------------------------------------------
  // CHAT ACTIONS
  // -------------------------------------------------------------
  const handleStartNewChat = async () => {
    try {
      const res = await api.createChatConversation('New Mentorship Session', activePageContext, sessionId);
      if (res?.conversation) {
        setConversations((prev) => [res.conversation, ...prev]);
        setCurrentConversationId(res.conversation.id);
        setMessages([]);
      }
    } catch (err) {
      setCurrentConversationId('local_' + Date.now());
      setMessages([]);
    }
    setShowHistory(false);
  };

  const handleSelectConversation = async (convId) => {
    setCurrentConversationId(convId);
    setIsLoading(true);
    try {
      const res = await api.getChatConversationDetails(convId, sessionId);
      if (res?.conversation?.messages) {
        setMessages(res.conversation.messages);
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (convId) => {
    try {
      await api.deleteChatConversation(convId, sessionId);
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (currentConversationId === convId) {
        handleStartNewChat();
      }
      addToast('Conversation deleted', 'info');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleClearAllConversations = async () => {
    try {
      await api.clearAllChatConversations(sessionId);
      setConversations([]);
      setMessages([]);
      setCurrentConversationId(null);
      addToast('All conversations cleared', 'info');
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const handleSaveProfile = async (newProfile) => {
    setStudentProfile(newProfile);
    try {
      await api.saveChatStudentProfile({ ...newProfile, sessionId });
      addToast('Student profile updated! Your AI Mentor will use these details.', 'success');
    } catch (err) {
      console.error('Save profile error:', err);
    }
  };

  // Send message
  const handleSendMessage = async (customText = null) => {
    const textToSend = (typeof customText === 'string' ? customText : inputMessage).trim();
    if (!textToSend || isLoading) return;

    if (!customText) {
      setInputMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }

    // Append user message immediately
    const userMsgObj = {
      id: 'temp_' + Date.now(),
      sender: 'user',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsgObj]);
    setIsLoading(true);

    try {
      const res = await api.sendChatMessage({
        conversationId: currentConversationId,
        message: textToSend,
        pageContext: activePageContext,
        sessionId,
        studentProfile,
      });

      if (res?.success) {
        if (!currentConversationId && res.conversationId) {
          setCurrentConversationId(res.conversationId);
          // Add to conversation list if new
          setConversations((prev) => [
            {
              id: res.conversationId,
              title: textToSend.slice(0, 35) + '...',
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        }

        if (res.message) {
          setMessages((prev) => [...prev, res.message]);
        }
      }
    } catch (err) {
      console.error('Send message error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'assistant',
          content: 'I encountered an issue connecting to the mentor service. Please try asking again in a moment!',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. FLOATING LAUNCHER BUTTON */}
      {/* ========================================================= */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          
          {/* Quick Context / Help Tooltip Badge */}
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl cursor-pointer hover:scale-105 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Need advice? Ask AI Mentor</span>
            <kbd className="hidden lg:inline-block text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
              Ctrl+/
            </kbd>
          </div>

          {/* Launcher Trigger Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center relative group"
            aria-label="Open AI Student Mentor"
            title="Open AI Student Mentor"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CHAT PANEL (Docked / Expanded) */}
      {/* ========================================================= */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-10 lg:inset-14 rounded-3xl'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] md:w-[460px] h-[100dvh] sm:h-[660px] sm:max-h-[88vh] rounded-none sm:rounded-3xl'
          }`}
        >
          {/* ------------------------------------------------------- */}
          {/* HEADER */}
          {/* ------------------------------------------------------- */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/20">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight truncate">
                    AI Student Mentor
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-indigo-100 truncate">
                  Personalized guidance for {studentProfile.grade} • {studentProfile.country}
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              
              {/* History Button */}
              <button
                onClick={() => setShowHistory((prev) => !prev)}
                className={`p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors ${
                  showHistory ? 'bg-white/20 text-white' : ''
                }`}
                title="Conversation History"
              >
                <History className="w-4 h-4" />
              </button>

              {/* Profile / Personalization Button */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Student Profile & Preferences"
              >
                <UserCheck className="w-4 h-4" />
              </button>

              {/* Expand / Minimize Fullscreen Toggle (Desktop/Tablet) */}
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="hidden sm:flex p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title={isExpanded ? 'Dock to corner' : 'Expand full page'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------- */}
          {/* CONTEXT CHIP BAR (Shows active page context) */}
          {/* ------------------------------------------------------- */}
          {activePageContext && (
            <div className="px-4 py-2 bg-indigo-50/90 dark:bg-indigo-950/50 border-b border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-xs text-indigo-950 dark:text-indigo-200 shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span className="font-medium text-slate-500 dark:text-slate-400 text-[11px]">Context:</span>
                <span className="font-bold truncate text-[11px]">{activePageContext.title}</span>
              </div>
              <button
                onClick={() => handleSendMessage(`Can you explain ${activePageContext.title} and what I need to prepare?`)}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 ml-2"
              >
                Ask about this
              </button>
            </div>
          )}

          {/* ------------------------------------------------------- */}
          {/* MESSAGES & CONTENT VIEWPORT */}
          {/* ------------------------------------------------------- */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin relative">
            
            {/* History Slide-In Drawer */}
            <ChatHistoryDrawer
              isOpen={showHistory}
              onClose={() => setShowHistory(false)}
              conversations={conversations}
              activeConversationId={currentConversationId}
              onSelectConversation={handleSelectConversation}
              onNewChat={handleStartNewChat}
              onDeleteConversation={handleDeleteConversation}
              onClearAllConversations={handleClearAllConversations}
            />

            {/* Empty State / Welcome Screen */}
            {messages.length === 0 && (
              <div className="space-y-5 py-4 animate-in fade-in duration-300">
                <div className="p-4 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👋</span>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                      Welcome, {studentProfile.preferredName || user?.name || 'Future Scholar'}!
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    I am your <strong>AI Student Mentor</strong>. Ask me anything about finding scholarships, exploring careers, building zero-cost passion projects, drafting preparation roadmaps, or writing application essays.
                  </p>
                  
                  {/* Personalization shortcut pill */}
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-indigo-100 dark:border-indigo-900/50">
                    <span>
                      Target: <strong>{studentProfile.grade}</strong> • <strong>{studentProfile.country}</strong>
                    </span>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>

                {/* Suggested Starters */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Choose a starting question:
                  </span>
                  <ChatQuickPrompts
                    onSelectPrompt={(text) => handleSendMessage(text)}
                    pageContext={activePageContext}
                  />
                </div>
              </div>
            )}

            {/* Render Messages */}
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.id || index}
                message={msg}
                onPromptClick={(text) => handleSendMessage(text)}
                onNavigate={(url) => {
                  navigate(url);
                  if (window.innerWidth < 640) {
                    setIsOpen(false);
                  }
                }}
              />
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-2">
                  <span className="font-medium">AI Mentor is thinking</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ------------------------------------------------------- */}
          {/* INPUT FORM */}
          {/* ------------------------------------------------------- */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about scholarships, careers, roadmaps, essays..."
                className="flex-1 bg-transparent resize-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder:text-slate-400 p-1 max-h-28 scrollbar-thin"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center shrink-0 transition-all shadow-xs"
                title="Send message (Enter)"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
              <span>Shift+Enter for new line</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Ethical & verified admissions advice</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. STUDENT PROFILE PERSONALIZATION MODAL */}
      {/* ========================================================= */}
      <ChatProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentProfile={studentProfile}
        onSaveProfile={handleSaveProfile}
      />
    </>
  );
};
