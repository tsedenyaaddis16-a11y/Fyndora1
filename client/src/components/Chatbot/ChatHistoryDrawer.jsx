import React from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  X, 
  Clock, 
  ChevronRight, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';

export const ChatHistoryDrawer = ({
  isOpen,
  onClose,
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onClearAllConversations,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col rounded-3xl animate-in slide-in-from-left duration-200 border border-slate-200/80 dark:border-slate-800">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Chat History
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        {conversations.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-2">
            <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              No conversations yet
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[200px] mx-auto">
              Ask your AI Student Mentor a question to start your first session.
            </p>
          </div>
        ) : (
          conversations.map((c) => {
            const isActive = c.id === activeConversationId;
            return (
              <div
                key={c.id}
                className={`group flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 font-semibold text-indigo-900 dark:text-indigo-200'
                    : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                onClick={() => {
                  onSelectConversation(c.id);
                  onClose();
                }}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="truncate text-xs font-medium">{c.title || 'Conversation'}</p>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {formatDate(c.updatedAt || c.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this conversation?')) {
                        onDeleteConversation(c.id);
                      }
                    }}
                    className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-300'}`} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Clear All */}
      {conversations.length > 0 && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
          <span className="text-slate-400">
            {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={() => {
              if (window.confirm('Clear all conversation history? This cannot be undone.')) {
                onClearAllConversations();
              }
            }}
            className="text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        </div>
      )}
    </div>
  );
};
