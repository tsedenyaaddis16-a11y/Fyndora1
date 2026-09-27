import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DeadlineBadge } from '../components/DeadlineBadge';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  FileCheck2,
  Plus,
  Calendar,
  CheckSquare,
  Square,
  Trash2,
  Edit3,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const STATUSES = ['Interested', 'Preparing', 'Applied', 'Interview', 'Accepted', 'Rejected'];

export const ApplicationTracker = () => {
  const { addToast } = useToast();
  const { t, tr, isAmharic } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for New/Edit Application
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({
    scholarshipTitle: '',
    deadline: '',
    status: 'Preparing',
    dateApplied: '',
    notes: '',
  });

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenCreate = () => {
    setEditingApp(null);
    setFormData({
      scholarshipTitle: '',
      deadline: '',
      status: 'Preparing',
      dateApplied: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app) => {
    setEditingApp(app);
    setFormData({
      scholarshipTitle: app.scholarshipTitle,
      deadline: app.deadline || '',
      status: app.status || 'Preparing',
      dateApplied: app.dateApplied || '',
      notes: app.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.scholarshipTitle.trim()) {
      addToast('Scholarship title is required', 'error');
      return;
    }

    try {
      if (editingApp) {
        await api.updateApplication(editingApp.id, formData);
        addToast('Application updated successfully!', 'success');
      } else {
        await api.createApplication({
          ...formData,
          checklist: [
            { text: 'High School Official Transcripts', completed: false },
            { text: 'Teacher Recommendation Letters (2)', completed: false },
            { text: 'Personal Motivation Essay', completed: false },
            { text: 'English Language Certification / Waiver', completed: false },
            { text: 'Final Portal Submission Verified', completed: false }
          ]
        });
        addToast('New application added to your tracker!', 'success');
      }
      setIsModalOpen(false);
      fetchApplications();
    } catch (err) {
      addToast('Failed to save application', 'error');
    }
  };

  const handleToggleChecklist = async (app, index) => {
    const updatedChecklist = [...app.checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    try {
      await api.updateApplication(app.id, { checklist: updatedChecklist });
      setApplications(prev =>
        prev.map(a => (a.id === app.id ? { ...a, checklist: updatedChecklist } : a))
      );
      addToast('Document checklist updated', 'info', 1500);
    } catch (err) {
      addToast('Failed to update checklist item', 'error');
    }
  };

  const handleDelete = async (appId, title) => {
    if (!window.confirm(`Delete application tracker for "${title}"?`)) return;

    try {
      await api.deleteApplication(appId);
      addToast('Application deleted', 'info');
      fetchApplications();
    } catch (err) {
      addToast('Failed to delete application', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-bold uppercase tracking-wider mb-2">
            <FileCheck2 className="w-3.5 h-3.5" />
            {t('Milestone Management')}
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('Application Tracker')}</h1>
          <p className="text-sm text-slate-600">
            {t('Never miss a scholarship deadline. Manage document requirements, submission dates, and track interview statuses.')}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 self-start sm:self-auto transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{t('Track New Application')}</span>
        </button>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
              <div className="h-20 bg-slate-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((app) => {
            const total = app.checklist ? app.checklist.length : 0;
            const completed = app.checklist ? app.checklist.filter(c => c.completed).length : 0;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all space-y-6"
              >
                {/* Top Row: Title, Status, Deadline & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={app.status} />
                      {app.dateApplied && (
                        <span className="text-xs text-slate-500 font-medium">
                          {isAmharic ? `የተላከበት ቀን፡ ${app.dateApplied}` : `Submitted on ${app.dateApplied}`}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {tr(app.scholarshipTitle)}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <DeadlineBadge deadline={app.deadline} />
                    <button
                      onClick={() => handleOpenEdit(app)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      title={t('Edit application details')}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(app.id, app.scholarshipTitle)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title={t('Delete application')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      {t('Documents & Readiness Progress')} ({completed} {t('of')} {total} {t('Completed')})
                    </span>
                    <span className="text-indigo-600">{progress}% {t('Ready')}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Documents Interactive Checklist */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {t('Application Document Checklist (Click to toggle)')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {app.checklist && app.checklist.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleToggleChecklist(app, idx)}
                        className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-3 transition-colors ${
                          item.completed
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200 line-through opacity-85'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                        }`}
                      >
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span>{tr(item.text)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {app.notes && (
                  <div className="text-xs text-slate-600 bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                    <strong className="text-amber-900 block mb-0.5">{t('Notes:')}</strong>
                    {app.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center mx-auto">
            <FileCheck2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t('No Applications Tracked Yet')}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {t('Organize and track every scholarship you\'re preparing for. Add a scholarship to track transcripts, essays, and deadlines.')}
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
          >
            {t('Start Tracking an Application')}
          </button>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? t('Edit Application Details') : t('Track New Application')}
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('Scholarship Title *')}</label>
            <input
              type="text"
              required
              value={formData.scholarshipTitle}
              onChange={(e) => setFormData({ ...formData, scholarshipTitle: e.target.value })}
              placeholder={t('e.g. Mastercard Foundation Scholars Program')}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('Submission Deadline')}</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('Current Status')}</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{tr(s)}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('Date Applied (if submitted)')}</label>
            <input
              type="date"
              value={formData.dateApplied}
              onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('Application Notes')}</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('e.g. Interview scheduled for next Tuesday, need copy of English test score...')}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-4 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              {t('Cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow"
            >
              {editingApp ? t('Save Changes') : t('Create Application')}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
