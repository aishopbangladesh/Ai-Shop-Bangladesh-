import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DocumentGenerator } from './components/DocumentGenerator';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoExplainerStudio } from './components/VideoExplainerStudio';
import { RiskAuditor } from './components/RiskAuditor';
import { TemplateRepository } from './components/TemplateRepository';
import { SAMPLE_NDA_DOCUMENT } from './data/defaultTemplates';
import { LegalDocument } from './types/legal';
import { Scale, ShieldCheck, Video, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'viewer' | 'video' | 'audit' | 'templates'>('generator');
  const [currentDocument, setCurrentDocument] = useState<LegalDocument>(SAMPLE_NDA_DOCUMENT);
  const [lang, setLang] = useState<'en' | 'bn'>('bn');

  const handleDocumentGenerated = (doc: LegalDocument) => {
    setCurrentDocument(doc);
    setActiveTab('viewer');
  };

  const handleOpenVideoStudio = (doc?: LegalDocument) => {
    if (doc) setCurrentDocument(doc);
    setActiveTab('video');
  };

  const handleOpenAudit = (doc?: LegalDocument) => {
    if (doc) setCurrentDocument(doc);
    setActiveTab('audit');
  };

  const handleSelectTemplate = (templateName: string) => {
    setActiveTab('generator');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        hasDocument={!!currentDocument}
        onPrint={handlePrint}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'generator' && (
          <DocumentGenerator
            onDocumentGenerated={handleDocumentGenerated}
            onOpenVideoStudio={handleOpenVideoStudio}
            lang={lang}
          />
        )}

        {activeTab === 'viewer' && (
          <DocumentViewer
            document={currentDocument}
            onOpenVideoStudio={handleOpenVideoStudio}
            onOpenAudit={handleOpenAudit}
            lang={lang}
          />
        )}

        {activeTab === 'video' && (
          <VideoExplainerStudio document={currentDocument} lang={lang} />
        )}

        {activeTab === 'audit' && (
          <RiskAuditor document={currentDocument} lang={lang} />
        )}

        {activeTab === 'templates' && (
          <TemplateRepository
            onSelectTemplate={handleSelectTemplate}
            onOpenVideoStudio={handleOpenVideoStudio}
            lang={lang}
          />
        )}
      </main>

      {/* Footer (hidden in print) */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/90 text-slate-500 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="font-cinzel text-slate-300 font-bold tracking-wider">
              AISHOP<span className="text-amber-400">BANGLADESH.COM</span>
            </span>
            <span className="text-slate-600">|</span>
            <span>{lang === 'en' ? 'AI Legal Documentation & Video Explainer Engine' : 'এআই আইনি দলিল ও ভিডিও নির্মাণ প্ল্যাটফর্ম'}</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-500 max-w-md">
            {lang === 'en'
              ? 'aishopbangladesh outputs are generated via Google GenAI for legal drafting assistance. Consult local bar advocates for jurisdictional certification.'
              : 'aishopbangladesh গুগল জেনএআই চালিত লিগ্যাল অ্যাসিস্ট্যান্ট। বিশেষ আইনি প্রয়োজনে সংশ্লিষ্ট এখতিয়ারের আইনজীবীর পরামর্শ নিন।'}
          </div>
        </div>
      </footer>
    </div>
  );
}
