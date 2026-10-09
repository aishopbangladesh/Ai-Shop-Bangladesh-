import React from 'react';
import {
  FileText,
  Shield,
  Code,
  Briefcase,
  UserCheck,
  Building2,
  Users,
  Scroll,
  ArrowRight,
  Video,
  Sparkles,
} from 'lucide-react';
import { TEMPLATE_CATEGORIES, SAMPLE_NDA_DOCUMENT } from '../data/defaultTemplates';
import { LegalDocument } from '../types/legal';

interface TemplateRepositoryProps {
  onSelectTemplate: (templateName: string) => void;
  onOpenVideoStudio: (doc: LegalDocument) => void;
  lang: 'en' | 'bn';
}

export const TemplateRepository: React.FC<TemplateRepositoryProps> = ({
  onSelectTemplate,
  onOpenVideoStudio,
  lang,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-5 h-5 text-amber-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-blue-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-emerald-400" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-purple-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-amber-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-indigo-400" />;
      case 'Scroll':
        return <Scroll className="w-5 h-5 text-rose-400" />;
      default:
        return <FileText className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-cinzel text-slate-100 tracking-wide">
              {lang === 'en' ? 'Standard Legal Template Vault' : 'আইনি চুক্তিপত্র ভল্ট ও টেমপ্লেট সংগ্রহ'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {lang === 'en'
              ? 'Pre-vetted enforceable contracts ready for automated drafting and video synthesis.'
              : 'যাচাইকৃত আইনসঙ্গত ড্রাফট যা দিয়ে তাৎক্ষণিক চুক্তি তৈরি ও ভিডিও বানানো যায়।'}
          </p>
        </div>

        <button
          onClick={() => onOpenVideoStudio(SAMPLE_NDA_DOCUMENT)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20"
        >
          <Video className="w-4 h-4 text-slate-950" />
          <span>{lang === 'en' ? 'Sample Video Walkthrough' : 'নমুনা ভিডিও দেখুন'}</span>
        </button>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEMPLATE_CATEGORIES.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between hover:border-amber-500/50 transition-all hover:shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-amber-500/40 transition-colors">
                  {getIcon(tpl.icon)}
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {tpl.popularity}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                {lang === 'en' ? tpl.name : tpl.bengaliName}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tpl.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => onSelectTemplate(tpl.name)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 transition-colors"
              >
                <span>{lang === 'en' ? 'Draft Contract' : 'ড্রাফট শুরু করুন'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
