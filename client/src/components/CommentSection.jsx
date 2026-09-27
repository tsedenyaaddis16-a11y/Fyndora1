import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { 
  MessageSquare, 
  Send, 
  Heart, 
  Reply, 
  Trash2, 
  Sparkles, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Globe, 
  ArrowUpDown,
  CornerDownRight
} from 'lucide-react';

const formatTimeAgo = (dateString, isAmharic = false) => {
  if (!dateString) return isAmharic ? 'አሁን' : 'Just now';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return isAmharic ? 'አሁን' : 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return isAmharic ? `ከ ${diffInMinutes} ደቂቃ በፊት` : `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return isAmharic ? `ከ ${diffInHours} ሰዓት በፊት` : `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return isAmharic ? `ከ ${diffInDays} ቀን በፊት` : `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Generates consistent soft gradient background based on username
const getAvatarGradient = (name = 'S') => {
  const gradients = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-violet-500 to-fuchsia-600'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

export const CommentSection = ({
  targetType = 'general',
  targetId = 'community',
  targetTitle = 'General Community',
  compact = false,
}) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t, tr, isAmharic } = useLanguage();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'likes'

  // Fetch comments
  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await api.getComments(targetType, targetId, sortBy);
      if (res?.comments) {
        setComments(res.comments);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [targetType, targetId, sortBy]);

  // Submit a top-level comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      setSubmitting(true);
      const payload = {
        targetType,
        targetId,
        targetTitle,
        content: newCommentText.trim(),
        userId: user?.id || null,
        userName: user?.name || 'Curious Student',
        userEmail: user?.email || 'student@fyndora.org',
        userRole: user?.role || 'student',
        userCountry: user?.country || 'Ethiopia',
        userGrade: user?.grade || 'Grade 11',
      };

      const res = await api.createComment(payload);
      if (res?.success && res?.comment) {
        setComments(prev => [res.comment, ...prev]);
        setNewCommentText('');
        addToast(tr('Your comment was posted!'), 'success');
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
      addToast(tr('Could not post comment. Please try again.'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit a reply
  const handleSubmitReply = async (parentId) => {
    if (!replyText.trim()) return;

    try {
      setSubmittingReply(true);
      const payload = {
        targetType,
        targetId,
        targetTitle,
        parentId,
        content: replyText.trim(),
        userId: user?.id || null,
        userName: user?.name || 'Curious Student',
        userEmail: user?.email || 'student@fyndora.org',
        userRole: user?.role || 'student',
        userCountry: user?.country || 'Ethiopia',
        userGrade: user?.grade || 'Grade 11',
      };

      const res = await api.createComment(payload);
      if (res?.success && res?.comment) {
        setComments(prev =>
          prev.map(c => {
            if (String(c.id) === String(parentId)) {
              return {
                ...c,
                replies: [...(c.replies || []), res.comment],
              };
            }
            return c;
          })
        );
        setReplyText('');
        setReplyingToId(null);
        addToast(tr('Reply added successfully!'), 'success');
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
      addToast(tr('Could not post reply. Please try again.'), 'error');
    } finally {
      setSubmittingReply(false);
    }
  };

  // Like toggle
  const handleLike = async (commentId, isReply = false, parentId = null) => {
    const userEmail = user?.email || 'guest';
    try {
      const res = await api.likeComment(commentId, userEmail);
      if (res?.success) {
        setComments(prev =>
          prev.map(c => {
            if (!isReply && String(c.id) === String(commentId)) {
              return {
                ...c,
                likes: res.likes,
                likedBy: res.likedBy || (res.hasLiked ? [...(c.likedBy || []), userEmail] : (c.likedBy || []).filter(u => u !== userEmail)),
              };
            }
            if (isReply && String(c.id) === String(parentId)) {
              return {
                ...c,
                replies: (c.replies || []).map(r =>
                  String(r.id) === String(commentId)
                    ? {
                        ...r,
                        likes: res.likes,
                        likedBy: res.likedBy || (res.hasLiked ? [...(r.likedBy || []), userEmail] : (r.likedBy || []).filter(u => u !== userEmail)),
                      }
                    : r
                ),
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  // Delete comment
  const handleDelete = async (commentId, isReply = false, parentId = null) => {
    if (!window.confirm(tr('Are you sure you want to remove this comment?'))) return;

    try {
      const res = await api.deleteComment(commentId);
      if (res?.success) {
        if (!isReply) {
          setComments(prev => prev.filter(c => String(c.id) !== String(commentId)));
        } else {
          setComments(prev =>
            prev.map(c => {
              if (String(c.id) === String(parentId)) {
                return {
                  ...c,
                  replies: (c.replies || []).filter(r => String(r.id) !== String(commentId)),
                };
              }
              return c;
            })
          );
        }
        addToast(tr('Comment deleted'), 'info');
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      addToast(tr('Could not delete comment.'), 'error');
    }
  };

  const totalCommentsCount = comments.reduce(
    (acc, curr) => acc + 1 + (curr.replies ? curr.replies.length : 0),
    0
  );

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm ${compact ? 'p-5' : 'p-6 sm:p-8'} space-y-6`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{tr('Student Discussions & Questions')}</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                {totalCommentsCount}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {tr('Ask questions, exchange tips, or discuss requirements with fellow students & mentors.')}
            </p>
          </div>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto text-xs font-semibold text-slate-600 bg-slate-50 p-1 rounded-xl border border-slate-200">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <button
            onClick={() => setSortBy('newest')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              sortBy === 'newest' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            {tr('Newest')}
          </button>
          <button
            onClick={() => setSortBy('likes')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              sortBy === 'likes' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            {tr('Most Liked')}
          </button>
        </div>
      </div>

      {/* New Comment Input Box */}
      <form onSubmit={handleSubmitComment} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            {tr('Posting as:')} <strong className="text-slate-800">{user?.name || tr('Guest Student')}</strong>
            {user?.grade && <span className="text-slate-400">• {user.grade}</span>}
            {user?.country && <span className="text-slate-400">• {user.country}</span>}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {tr('Be kind and respectful')}
          </span>
        </div>

        <textarea
          rows={3}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={isAmharic ? `ስለ ${targetTitle} ጥያቄዎን፣ ምክርዎን ወይም አስተያየትዎን ያጋሩ...` : `Share your question, advice, or perspective about ${targetTitle}...`}
          className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white text-sm text-slate-800 placeholder:text-slate-400 resize-none transition-all"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-400">
            {newCommentText.length > 0 && `${newCommentText.length} ${isAmharic ? 'ፊደላት' : 'characters'}`}
          </div>
          <button
            type="submit"
            disabled={submitting || !newCommentText.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? tr('Posting...') : tr('Post Comment')}</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4 py-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
              </div>
              <div className="h-10 bg-slate-200/60 rounded"></div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">{tr('No discussions here yet')}</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {tr('Be the first student to ask a question, share an experience, or start a helpful discussion!')}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => {
            const userIdentifier = user?.email || 'guest';
            const hasLiked = (comment.likedBy || []).includes(userIdentifier);
            const canDelete = user && (user.role === 'admin' || user.email === comment.userEmail);

            return (
              <div
                key={comment.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/30 transition-all space-y-3"
              >
                {/* Author Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${getAvatarGradient(comment.userName)} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}>
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{comment.userName}</span>
                        {comment.userRole === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-purple-600" />
                            {tr('Advisor')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-medium border border-indigo-100">
                            <GraduationCap className="w-3 h-3" />
                            {comment.userGrade || tr('Student')}
                          </span>
                        )}
                        {comment.userCountry && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {comment.userCountry}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {formatTimeAgo(comment.createdAt, isAmharic)}
                      </span>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      title={tr('Delete comment')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Comment Content */}
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-12">
                  {comment.content}
                </p>

                {/* Comment Actions */}
                <div className="flex items-center gap-3 pl-12 pt-1 text-xs">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-medium ${
                      hasLiked
                        ? 'bg-rose-50 text-rose-600 font-bold'
                        : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50/50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                    <span>{comment.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => {
                      setReplyingToId(replyingToId === comment.id ? null : comment.id);
                      setReplyText('');
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{tr('Reply')}</span>
                  </button>
                </div>

                {/* Inline Reply Box */}
                {replyingToId === comment.id && (
                  <div className="ml-12 mt-3 pt-3 border-t border-slate-100 space-y-2 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
                      <CornerDownRight className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isAmharic ? `ለ ${comment.userName} ምላሽ በመስጠት ላይ` : `Replying to ${comment.userName}`}</span>
                    </div>
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={tr('Write your reply...')}
                      className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setReplyingToId(null);
                          setReplyText('');
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200/60"
                      >
                        {tr('Cancel')}
                      </button>
                      <button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={submittingReply || !replyText.trim()}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-50"
                      >
                        {submittingReply ? tr('Posting...') : tr('Send Reply')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Threaded Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 sm:ml-12 mt-3 space-y-3 pt-2 border-l-2 border-indigo-100 pl-4">
                    {comment.replies.map((reply) => {
                      const replyLiked = (reply.likedBy || []).includes(userIdentifier);
                      const canDeleteReply = user && (user.role === 'admin' || user.email === reply.userEmail);

                      return (
                        <div key={reply.id} className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${getAvatarGradient(reply.userName)} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                                {reply.userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-slate-900">{reply.userName}</span>
                                  {reply.userRole === 'admin' && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 text-[9px] font-bold">
                                      {tr('Advisor')}
                                    </span>
                                  )}
                                  {reply.userCountry && (
                                    <span className="text-[10px] text-slate-400">
                                      • {reply.userCountry}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {formatTimeAgo(reply.createdAt, isAmharic)}
                                </span>
                              </div>
                            </div>

                            {canDeleteReply && (
                              <button
                                onClick={() => handleDelete(reply.id, true, comment.id)}
                                title={tr('Delete reply')}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed pl-9">
                            {reply.content}
                          </p>

                          <div className="pl-9 pt-0.5">
                            <button
                              onClick={() => handleLike(reply.id, true, comment.id)}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
                                replyLiked
                                  ? 'text-rose-600 font-bold bg-rose-50'
                                  : 'text-slate-400 hover:text-rose-600'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${replyLiked ? 'fill-current' : ''}`} />
                              <span>{reply.likes || 0}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
