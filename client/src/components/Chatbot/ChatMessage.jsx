import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Compass, 
  ThumbsUp,
  Clock,
  ShieldCheck,
  Info
} from 'lucide-react';

/**
 * Custom lightweight renderer for mentor messages.
 * Formats Markdown headers, bold text, lists, and internal platform links.
 */
export const ChatMessage = ({ 
  message, 
  onPromptClick,
  onNavigate 
}) => {
  const isAssistant = message.sender === 'assistant';
  const [copied, setCopied] = useState(false);
  const [helpful, setHelpful] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  // Convert markdown-style links [Text](/path) into interactive navigation links
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');

    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-3 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{renderInlineStyles(trimmed.slice(4))}</span>
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-bold text-slate-900 dark:text-slate-100 text-base mt-3 mb-1">
                {renderInlineStyles(trimmed.slice(3))}
              </h3>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={idx} className="font-extrabold text-slate-900 dark:text-slate-100 text-lg mt-3 mb-1">
                {renderInlineStyles(trimmed.slice(2))}
              </h2>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-1 text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                <span className="flex-1">{renderInlineStyles(trimmed.slice(2))}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2.5 ml-1 text-slate-700 dark:text-slate-300">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded-md shrink-0 mt-0.5">
                  {numMatch[1]}
                </span>
                <span className="flex-1">{renderInlineStyles(numMatch[2])}</span>
              </div>
            );
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-2 border-indigo-400 pl-3 italic text-slate-600 dark:text-slate-400 text-xs my-1 bg-indigo-50/40 dark:bg-indigo-950/30 py-1 rounded-r-lg">
                {renderInlineStyles(trimmed.slice(2))}
              </blockquote>
            );
          }

          // Standard paragraph
          return (
            <p key={idx} className="text-slate-700 dark:text-slate-300">
              {renderInlineStyles(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  // Parses bold, italics, code, and markdown links
  const renderInlineStyles = (text) => {
    // Regex for markdown links: [link text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const linkLabel = match[1];
      const linkUrl = match[2];
      const isInternal = linkUrl.startsWith('/');

      parts.push(
        isInternal ? (
          <Link
            key={match.index}
            to={linkUrl}
            onClick={() => onNavigate && onNavigate(linkUrl)}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline underline-offset-2 transition-colors mx-0.5"
          >
            <span>{linkLabel}</span>
            <Compass className="w-3 h-3 inline" />
          </Link>
        ) : (
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mx-0.5"
          >
            <span>{linkLabel}</span>
            <ExternalLink className="w-3 h-3 inline" />
          </a>
        )
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Now format bold (**text**)
    return parts.map((part, i) => {
      if (typeof part !== 'string') return part;

      const boldSegments = part.split(/(\*\*[^*]+\*\*)/g);
      return boldSegments.map((seg, j) => {
        if (seg.startsWith('**') && seg.endsWith('**')) {
          return (
            <strong key={`${i}-${j}`} className="font-semibold text-slate-900 dark:text-slate-100">
              {seg.slice(2, -2)}
            </strong>
          );
        }
        return seg;
      });
    });
  };

  const meta = message.metadata?.meta || {};
  const suggestedPrompts = message.metadata?.suggestedPrompts || [];

  return (
    <div className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'} group`}>
      
      {/* Mentor Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[80%] space-y-2`}>
        
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm shadow-xs transition-colors ${
            isAssistant
              ? 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm'
              : 'bg-indigo-600 text-white font-medium rounded-tr-sm'
          }`}
        >
          {isAssistant ? (
            renderFormattedContent(message.content)
          ) : (
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          )}

          {/* Assistant Footer Info (Provider/Notice) */}
          {isAssistant && meta.notice && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{meta.notice}</span>
            </div>
          )}
        </div>

        {/* Message Actions & Timestamp */}
        <div className={`flex items-center gap-2 px-1 text-[11px] text-slate-400 dark:text-slate-500 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTimestamp(message.createdAt)}
          </span>

          {isAssistant && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 hover:text-slate-700 dark:hover:text-slate-300 rounded transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
              <button
                onClick={() => setHelpful(helpful === true ? null : true)}
                className={`p-1 rounded transition-colors ${helpful === true ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-slate-700 dark:hover:text-slate-300'}`}
                title="Helpful"
              >
                <ThumbsUp className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Suggested Next Questions */}
        {isAssistant && suggestedPrompts && suggestedPrompts.length > 0 && (
          <div className="pt-1.5 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Suggested next questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onPromptClick && onPromptClick(prompt)}
                  className="text-left text-xs bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 rounded-xl px-2.5 py-1.5 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  👉 {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 shadow-xs mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
