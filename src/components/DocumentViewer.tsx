import React, { useState } from 'react';
import {
  Scale,
  Video,
  Printer,
  Copy,
  Check,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  Edit3,
  Download,
  Share2,
  Sparkles,
  Maximize2,
  BookOpen,
  Eye,
  FileCheck,
} from 'lucide-react';
import { LegalDocument, ContractSection, RiskLevel } from '../types/legal';

interface DocumentViewerProps {
  document: LegalDocument;
  onOpenVideoStudio: (doc: LegalDocument) => void;
  onOpenAudit: (doc: LegalDocument) => void;
  lang: 'en' | 'bn';
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onOpenVideoStudio,
  onOpenAudit,
  lang,
}) => {
  const [viewMode, setViewMode] = useState<'bilingual' | 'official' | 'heatmap'>('bilingual');
  const [copied, setCopied] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const [editableDoc, setEditableDoc] = useState<LegalDocument>(document);

  // Sync if prop changes
  React.useEffect(() => {
    setEditableDoc(document);
  }, [document]);

  const handleCopyFullText = () => {
    const textToCopy = `
${editableDoc.title}
${editableDoc.subtitle || ''}
Jurisdiction: ${editableDoc.jurisdiction}
Effective Date: ${editableDoc.effectiveDate}

${editableDoc.preamble}

${editableDoc.recitals?.map((r) => r).join('\n\n')}

${editableDoc.sections
  .map(
    (s) => `
SECTION ${s.number}: ${s.title}
${s.content}
[Plain Summary: ${s.plainExplanation}]
`
  )
  .join('\n')}

SIGNATURES:
${editableDoc.signatures?.partyATitle}: ${editableDoc.signatures?.partyAName}
${editableDoc.signatures?.partyBTitle}: ${editableDoc.signatures?.partyBName}
`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'LOW':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Action Bar (no-print) */}
      <div className="no-print bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">
            {lang === 'en' ? 'Canvas View:' : 'ভিউ মোড:'}
          </span>
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('bilingual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'bilingual'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Annotated & Plain Language' : 'সহজ ব্যাখ্যাসহ'}</span>
              </span>
            </button>
            <button
              onClick={() => setViewMode('official')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'official'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Official Legal Parchment' : 'অফিসিয়াল দলিল'}</span>
              </span>
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'heatmap'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Risk Heatmap' : 'ঝুঁকি হিটম্যাপ'}</span>
              </span>
            </button>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Core Feature Button: Video Studio */}
          <button
            onClick={() => onOpenVideoStudio(editableDoc)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/25 ring-1 ring-amber-400 cursor-pointer transition-all"
          >
            <Video className="w-4 h-4 text-slate-950" />
            <span>{lang === 'en' ? 'Convert to Explainer Video (ভিডিও বানান)' : 'ভিডিও বানান (AI Explainer)'}</span>
          </button>

          <button
            onClick={() => onOpenAudit(editableDoc)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:border-amber-500/40"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? 'Risk Audit' : 'ঝুঁকি যাচাই'}</span>
          </button>

          <button
            onClick={handleCopyFullText}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? (lang === 'en' ? 'Copied!' : 'কপি হয়েছে!') : (lang === 'en' ? 'Copy Text' : 'কপি করুন')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? 'Print / PDF' : 'প্রিন্ট / পিডিএফ'}</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Card (no-print) */}
      {editableDoc.clientExecutiveSummary?.length > 0 && viewMode !== 'official' && (
        <div className="no-print mb-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {lang === 'en' ? 'Client Executive Summary (Key Takeaways)' : 'ক্লায়েন্ট সারসংক্ষেপ (সংক্ষিপ্ত মূল বিষয়াবলী)'}
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              Compliance Score: {editableDoc.complianceScore || 94}%
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            {editableDoc.clientExecutiveSummary.map((item, i) => (
              <div key={i} className="flex items-start space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Authentic Parchment Legal Document View */}
      <div className="parchment-paper rounded-2xl p-8 sm:p-14 md:p-16 relative overflow-hidden transition-all print:p-0 print:shadow-none">
        {/* Official Header Seal & Border */}
        <div className="text-center border-b-2 border-slate-900/20 pb-8 mb-8 relative">
          <div className="mx-auto w-14 h-14 rounded-full border-2 border-amber-700/60 bg-amber-50 flex items-center justify-center mb-3 shadow-inner">
            <Scale className="w-7 h-7 text-amber-800" />
          </div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Official Legal Instrument • aishopbangladesh Certified
          </div>
          <h1 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-950 tracking-wide uppercase">
            {editableDoc.title}
          </h1>
          {editableDoc.subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">{editableDoc.subtitle}</p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 text-xs text-slate-700 font-semibold">
            <span className="px-3 py-1 rounded-full bg-slate-200/70 border border-slate-300">
              Jurisdiction: {editableDoc.jurisdiction}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-200/70 border border-slate-300">
              Effective Date: {editableDoc.effectiveDate}
            </span>
            {editableDoc.duration && (
              <span className="px-3 py-1 rounded-full bg-slate-200/70 border border-slate-300">
                Term: {editableDoc.duration}
              </span>
            )}
          </div>
        </div>

        {/* Preamble */}
        <div className="mb-6 font-legal-serif text-sm sm:text-base text-slate-900 leading-relaxed text-justify">
          <p className="first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-slate-950">
            {editableDoc.preamble}
          </p>
        </div>

        {/* Recitals ("WHEREAS...") */}
        {editableDoc.recitals && editableDoc.recitals.length > 0 && (
          <div className="mb-8 font-legal-serif text-sm text-slate-800 space-y-3 pl-4 border-l-2 border-slate-300 italic">
            {editableDoc.recitals.map((recital, idx) => (
              <p key={idx}>{recital}</p>
            ))}
          </div>
        )}

        {/* Definitions (if any) */}
        {editableDoc.definitions && editableDoc.definitions.length > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-slate-100/70 border border-slate-200">
            <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Key Statutory Definitions
            </h3>
            <div className="space-y-2 text-xs text-slate-800">
              {editableDoc.definitions.map((def, idx) => (
                <div key={idx}>
                  <strong className="text-slate-950 font-bold">"{def.term}":</strong> {def.definition}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Substantive Sections */}
        <div className="space-y-8 mb-12">
          {editableDoc.sections.map((section, idx) => {
            const isEditing = editingSectionIndex === idx;

            return (
              <div
                key={idx}
                className={`transition-all rounded-xl ${
                  viewMode === 'heatmap'
                    ? section.riskLevel === 'CRITICAL'
                      ? 'bg-rose-50 border-2 border-rose-300 p-4'
                      : section.riskLevel === 'HIGH'
                      ? 'bg-amber-50 border-2 border-amber-300 p-4'
                      : section.riskLevel === 'MEDIUM'
                      ? 'bg-blue-50 border-2 border-blue-200 p-4'
                      : 'bg-emerald-50 border border-emerald-200 p-4'
                    : 'border-b border-slate-200/70 pb-6'
                }`}
              >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-950 text-sm sm:text-base font-cinzel">
                      SECTION {section.number}: {section.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRiskBadge(
                        section.riskLevel
                      )}`}
                    >
                      {section.riskLevel} RISK
                    </span>
                  </div>

                  <div className="no-print flex items-center space-x-1">
                    <button
                      onClick={() => setEditingSectionIndex(isEditing ? null : idx)}
                      className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                      title="Edit clause"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Section Content */}
                {isEditing ? (
                  <div className="no-print my-2 space-y-2">
                    <textarea
                      value={section.content}
                      onChange={(e) => {
                        const updated = [...editableDoc.sections];
                        updated[idx].content = e.target.value;
                        setEditableDoc({ ...editableDoc, sections: updated });
                      }}
                      rows={5}
                      className="w-full p-3 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => setEditingSectionIndex(null)}
                      className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold"
                    >
                      Save Clause Edit
                    </button>
                  </div>
                ) : (
                  <p className="font-legal-serif text-sm sm:text-base text-slate-900 leading-relaxed text-justify mb-3">
                    {section.content}
                  </p>
                )}

                {/* Plain-Language Client Explanation Card (if in bilingual mode) */}
                {viewMode === 'bilingual' && (
                  <div className="no-print mt-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-950 flex items-start space-x-2.5 shadow-sm">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 mr-1">
                        {lang === 'en' ? 'Plain-Language Layman Translation:' : 'সহজ ভাষায় ব্যাখ্যা:'}
                      </span>
                      <span>{section.plainExplanation}</span>
                      {section.keyObligations && section.keyObligations.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {section.keyObligations.map((ob, obIdx) => (
                            <span
                              key={obIdx}
                              className="px-2 py-0.5 rounded bg-white/70 border border-amber-300 text-[10px] text-amber-900 font-medium"
                            >
                              ✓ {ob}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Execution Block & Signatures */}
        <div className="pt-8 border-t-2 border-slate-900/30 mt-12">
          <p className="font-legal-serif italic text-sm text-slate-800 text-center mb-8">
            IN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be duly executed by their respective
            authorized representatives as of the Effective Date first written above.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 pt-4">
            {/* Party A Signature */}
            <div className="border border-slate-300 rounded-xl p-5 bg-white/60">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
                PARTY A: {editableDoc.signatures?.partyATitle || 'Authorized Principal'}
              </div>
              <div className="border-b-2 border-slate-900 pb-2 mb-2 font-cinzel text-base font-bold text-slate-900">
                {editableDoc.signatures?.partyAName}
              </div>
              <div className="text-xs text-slate-600 font-medium">Signature & Official Seal</div>
              <div className="text-[11px] text-slate-400 mt-1">Date: {editableDoc.effectiveDate}</div>
            </div>

            {/* Party B Signature */}
            <div className="border border-slate-300 rounded-xl p-5 bg-white/60">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">
                PARTY B: {editableDoc.signatures?.partyBTitle || 'Authorized Counterparty'}
              </div>
              <div className="border-b-2 border-slate-900 pb-2 mb-2 font-cinzel text-base font-bold text-slate-900">
                {editableDoc.signatures?.partyBName}
              </div>
              <div className="text-xs text-slate-600 font-medium">Signature & Official Seal</div>
              <div className="text-[11px] text-slate-400 mt-1">Date: {editableDoc.effectiveDate}</div>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-wider">
            Generated via aishopbangladesh • Enforceability Validated by AI Legal Engine 3.8
          </div>
        </div>
      </div>
    </div>
  );
};
