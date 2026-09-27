import React, { useState } from 'react';
import { DeadlineBadge } from './DeadlineBadge';
import { Modal } from './Modal';
import { CommentSection } from './CommentSection';
import { useLanguage } from '../context/LanguageContext';
import { ExternalLink, MapPin, Award, Users, CheckCircle2, Calendar, MessageSquare } from 'lucide-react';

const TYPE_STYLES = {
  'Summer Program': 'bg-amber-50 text-amber-800 border-amber-200',
  'Fellowship': 'bg-purple-50 text-purple-800 border-purple-200',
  'Competition': 'bg-rose-50 text-rose-800 border-rose-200',
  'Internship': 'bg-blue-50 text-blue-800 border-blue-200',
  'Conferences': 'bg-teal-50 text-teal-800 border-teal-200',
  'Academic Program': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Leadership Program': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Scholarship': 'bg-cyan-50 text-cyan-800 border-cyan-200',
};

export const OpportunityCard = ({ opportunity }) => {
  const { t, tr } = useLanguage();
  const [showComments, setShowComments] = useState(false);
  const typeStyle = TYPE_STYLES[opportunity.type] || 'bg-slate-50 text-slate-800 border-slate-200';

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${typeStyle}`}>
              {tr(opportunity.type)}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {tr(opportunity.country)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
            {tr(opportunity.title)}
          </h3>

          <p className="text-xs font-medium text-slate-500 mb-3">
            {t('Organized by:')} <span className="text-slate-700">{opportunity.provider}</span>
          </p>

          <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
            {opportunity.description}
          </p>

          <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
            <div>
              <strong className="text-slate-700">{t('Eligibility:')} </strong>
              <span className="text-slate-600">{tr(opportunity.eligibility)}</span>
            </div>
            <div>
              <strong className="text-slate-700">{t('Funding / Prize:')} </strong>
              <span className="text-emerald-700 font-medium">{tr(opportunity.funding)}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <DeadlineBadge deadline={opportunity.deadline} />
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComments(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              title={t('View student questions and tips')}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('Discussion')}</span>
            </button>

            {opportunity.applicationUrl && (
              <a
                href={opportunity.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <span>{t('Portal')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Discussion Modal for this Opportunity */}
      <Modal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        title={`Discussion: ${opportunity.title}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900">
            <strong>{opportunity.type}</strong> organized by {opportunity.provider} • {opportunity.country}
          </div>
          <CommentSection
            targetType="opportunity"
            targetId={opportunity.id}
            targetTitle={opportunity.title}
            compact={true}
          />
        </div>
      </Modal>
    </>
  );
};
