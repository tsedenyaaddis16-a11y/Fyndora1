import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Bookmark,
  Trash2,
  Edit3,
  ExternalLink,
  Calendar,
  AlertCircle,
  FileCheck2,
  CheckCircle,
  Plus
} from 'lucide-react';

const STATUS_OPTIONS = ['Interested', 'Preparing', 'Applied', 'Interview', 'Accepted', 'Rejected'];

export const SavedScholarships = () => {
  const { addToast } = useToast();
  const { tr, isAmharic } = useLanguage();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal for editing notes & status
  const [activeItem, setActiveItem] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('Interested');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const data = await api.getSaved();
      setSavedItems(data);
    } catch (err) {
      console.error('Failed to load saved scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleOpenEdit = (item) => {
    setActiveItem(item);
    setEditNotes(item.notes || '');
    setEditStatus(item.status || 'Interested');
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      await api.saveScholarship(activeItem.scholarshipId, editNotes, editStatus);
      setIsModalOpen(false);
      addToast(tr('Application status and personal notes updated!'), 'success');
      fetchSaved();
    } catch (err) {
      addToast(tr('Failed to update saved item'), 'error');
    }
  };

  const handleRemove = async (scholarshipId, title) => {
    if (!window.confirm(isAmharic ? `"${title}"ን ከተቀመጡት ዝርዝር ውስጥ ማስወገድ እንደሚፈልጉ እርግጠኛ ነዎት?` : `Are you sure you want to remove "${title}" from your saved list?`)) return;

    try {
      await api.removeSaved(scholarshipId);
      addToast(tr('Scholarship removed from saved collection'), 'info');
      fetchSaved();
    } catch (err) {
      addToast(tr('Failed to remove scholarship'), 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            Personal Opportunity Vault
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saved Scholarships</h1>
          <p className="text-sm text-slate-600">
            Keep track of deadlines, personalize your preparation notes, and track your application milestones.
          </p>
        </div>

        <Link
          to="/scholarships"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Find More Scholarships</span>
        </Link>
      </div>

      {/* Saved Items List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
              <div className="h-10 bg-slate-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : savedItems.length > 0 ? (
        <div className="space-y-4">
          {savedItems.map((item) => {
            const sch = item.scholarship || {};
            return (
              <div
                key={item.scholarshipId}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status || 'Interested'} />
                      <span className="text-xs text-slate-500 font-medium">
                        {sch.destination || 'International'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      <Link to={`/scholarships/${item.scholarshipId}`} className="hover:text-indigo-600 transition-colors">
                        {sch.title || 'Scholarship Opportunity'}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500">{sch.provider}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <DeadlineBadge deadline={sch.deadline} />
                    <button
                      onClick={() => handleRemove(item.scholarshipId, sch.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Personal Notes Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1 text-xs sm:text-sm">
                    <span className="font-semibold text-slate-700 block">Personal Notes:</span>
                    <p className="text-slate-600 italic">
                      {item.notes ? `"${item.notes}"` : 'No notes added yet. Click edit to write requirements or reminders.'}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors shadow-2xs shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Status & Notes</span>
                  </button>
                </div>

                {/* Quick Links & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                  <span className="text-slate-400">
                    Saved on: {new Date(item.savedAt || Date.now()).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/scholarships/${item.scholarshipId}`}
                      className="font-bold text-indigo-600 hover:text-indigo-700"
                    >
                      View Details & Criteria &rarr;
                    </Link>
                    {sch.applicationUrl && (
                      <a
                        href={sch.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-slate-700 hover:text-indigo-600"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your Saved Vault is Empty</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            As you explore scholarships, click the bookmark icon on any card to save it here for quick deadline tracking.
          </p>
          <Link
            to="/scholarships"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
          >
            Explore Scholarships
          </Link>
        </div>
      )}

      {/* EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Status & Personal Notes"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Application Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Personal Notes</label>
            <textarea
              rows="4"
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="e.g., Requested transcript translation from school principal; need 2 recommendation letters by Oct 15..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
