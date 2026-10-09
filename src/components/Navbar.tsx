import React from 'react';
import {
  Scale,
  Video,
  FileText,
  ShieldAlert,
  Sparkles,
  Globe,
  Printer,
  Download,
  FolderArchive,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'viewer' | 'video' | 'audit' | 'templates';
  setActiveTab: (tab: 'generator' | 'viewer' | 'video' | 'audit' | 'templates') => void;
  lang: 'en' | 'bn';
  setLang: (lang: 'en' | 'bn') => void;
  hasDocument: boolean;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  hasDocument,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('generator')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
              <Scale className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-slate-100">
                  AISHOP<span className="text-amber-400">BANGLADESH</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full">
                  Legal Engine 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {lang === 'en'
                  ? 'Automated Legal Documentation & Video Walkthrough Studio'
                  : 'এআই লিগ্যাল চুক্তিপত্র ও ভিডিও ব্রিফিং স্টুডিও'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'generator'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Draft Contract' : 'চুক্তিপত্র তৈরি'}</span>
            </button>

            {hasDocument && (
              <button
                onClick={() => setActiveTab('viewer')}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'viewer'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Legal Canvas' : 'মূল চুক্তিপত্র'}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all relative ${
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-500/25 ring-1 ring-amber-300'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/30 border border-amber-500/30'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-current animate-pulse" />
              <span>{lang === 'en' ? 'Video Explainer Studio' : 'ভিডিও বানিয়ে ব্রিফিং'}</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'audit'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Risk Audit' : 'ঝুঁকি স্ক্যানার'}</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'templates'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Templates' : 'টেমপ্লেট'}</span>
            </button>
          </nav>

          {/* Right Controls: Language & Print */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  lang === 'en' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('bn')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  lang === 'bn' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                বাংলা
              </button>
            </div>

            {hasDocument && (
              <button
                onClick={onPrint}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                title="Print or Export as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'en' ? 'Export PDF' : 'পিডিএফ ডাউনলোড'}</span>
              </button>
            )}

            <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden lg:inline">{lang === 'en' ? 'AI Jurist Active' : 'এআই জুড়িস্ট সক্রিয়'}</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-800/80 scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1 rounded-md shrink-0 ${activeTab === 'generator' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
          >
            {lang === 'en' ? 'Draft' : 'চুক্তি তৈরি'}
          </button>
          {hasDocument && (
            <button
              onClick={() => setActiveTab('viewer')}
              className={`px-3 py-1 rounded-md shrink-0 ${activeTab === 'viewer' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
            >
              {lang === 'en' ? 'Document' : 'চুক্তিপত্র'}
            </button>
          )}
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1 rounded-md shrink-0 flex items-center space-x-1 ${activeTab === 'video' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-amber-950/40 text-amber-300 border border-amber-500/30'}`}
          >
            <Video className="w-3 h-3" />
            <span>{lang === 'en' ? 'Video Explainer' : 'ভিডিও স্টুডিও'}</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1 rounded-md shrink-0 ${activeTab === 'audit' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
          >
            {lang === 'en' ? 'Risk Audit' : 'ঝুঁকি স্ক্যান'}
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1 rounded-md shrink-0 ${activeTab === 'templates' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-300'}`}
          >
            {lang === 'en' ? 'Templates' : 'টেমপ্লেট'}
          </button>
        </div>
      </div>
    </header>
  );
};
