import React, { useState } from 'react';
import { TabMode, GoogleChatSpace } from '../types';
import { PANCHANG_INFO } from '../data/mockData';
import { DailyVedicWisdom } from './DailyVedicWisdom';
import {
  Calendar,
  Layers,
  Users,
  QrCode,
  Truck,
  Download,
  MessageSquare,
  LogOut,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Sun,
  ShieldAlert,
  Info,
  ExternalLink,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
  metrics: {
    ceremoniesToday: number;
    dakshinaToday: number;
    samagriStagedPercent: number;
    activeClientsCount: number;
  };
  currentUser: User | null;
  googleToken: string | null;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  chatSpaces: GoogleChatSpace[];
  selectedChatSpace: string;
  onSelectChatSpace: (space: string) => void;
  onOpenExportModal: () => void;
  onOpenShareQrModal: () => void;
  onShowToast?: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  metrics,
  currentUser,
  googleToken,
  onGoogleLogin,
  onGoogleLogout,
  onOpenExportModal,
  onOpenShareQrModal,
  onShowToast,
}) => {
  const [isPanchangModalOpen, setIsPanchangModalOpen] = useState(false);
  const [isWisdomExpanded, setIsWisdomExpanded] = useState(false);
  const [showMobileMetrics, setShowMobileMetrics] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Auspicious Panchang Bar (Desktop: Full info; Mobile: Tap-to-expand pill) */}
      <div className="bg-[#1C140E] text-stone-200 text-xs font-medium py-1 px-3 sm:px-4 border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Panchang Summary Pill */}
          <button
            onClick={() => setIsPanchangModalOpen(true)}
            id="header-panchang-trigger-btn"
            className="flex items-center gap-1.5 text-stone-300 hover:text-amber-200 transition-colors py-0.5 px-2 rounded-lg hover:bg-stone-800/60 text-left cursor-pointer"
            title="Click to view full Panchang & Muhurat calculation"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Panchang
            </span>
            <span className="text-stone-400 hidden sm:inline">•</span>
            <span className="text-stone-100 font-medium truncate max-w-[200px] sm:max-w-none text-[11px] sm:text-xs">
              {PANCHANG_INFO.tithi} ({PANCHANG_INFO.nakshatra})
            </span>
            <span className="hidden md:inline text-stone-500">•</span>
            <span className="hidden md:inline text-amber-200 text-[11px]">
              Muhurat: <strong className="text-emerald-300 font-semibold">{PANCHANG_INFO.shubhMuhurat}</strong>
            </span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {/* Action Utilities (Google Chat, QR Share, Export) */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            {/* Daily Wisdom Collapsible Toggle */}
            <button
              onClick={() => setIsWisdomExpanded(!isWisdomExpanded)}
              id="header-wisdom-toggle-btn"
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all ${
                isWisdomExpanded
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'text-stone-400 hover:text-amber-200 hover:bg-stone-800'
              }`}
              title="Daily Vedic Verse"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Daily Wisdom</span>
              {isWisdomExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Google Chat Connect / Active Pill */}
            {googleToken && currentUser ? (
              <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <MessageSquare className="w-3 h-3 text-emerald-300" />
                <span className="text-emerald-100 hidden md:inline truncate max-w-[110px]">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <button
                  onClick={onGoogleLogout}
                  title="Disconnect Google Chat"
                  className="text-stone-400 hover:text-white ml-0.5"
                >
                  <LogOut className="w-2.5 h-2.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onGoogleLogin}
                id="header-google-signin-btn"
                className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-200 px-2 py-0.5 rounded-md border border-stone-700 text-[11px] font-medium transition-colors"
                title="Connect Google Workspace Chat for ritual dispatch"
              >
                <MessageSquare className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Connect Chat</span>
              </button>
            )}

            {/* Share App QR */}
            <button
              onClick={onOpenShareQrModal}
              id="header-share-qr-btn"
              title="Share Mobile App via QR"
              className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-amber-300 px-2 py-0.5 rounded-md border border-stone-700 text-[11px] font-semibold transition-colors"
            >
              <QrCode className="w-3 h-3" />
              <span className="hidden sm:inline">Share QR</span>
            </button>

            {/* Standalone Export */}
            <button
              onClick={onOpenExportModal}
              id="export-single-file-btn"
              title="Export Standalone Single-File Bundle"
              className="hidden lg:flex items-center gap-1 text-stone-400 hover:text-white px-2 py-0.5 rounded text-[11px] transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Daily Vedic Wisdom Banner */}
      {isWisdomExpanded && (
        <div className="border-b border-amber-200/60 bg-[#FFFDF9] transition-all animate-fadeIn">
          <DailyVedicWisdom
            currentTithi={PANCHANG_INFO.tithi}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* Main Bar: Identity & Desktop Persona Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#C2341D] to-[#8B1E0F] text-white flex items-center justify-center text-lg shadow-sm border border-amber-400/30 shrink-0">
              🕉️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-stone-900 font-display">
                  PUROHIT<span className="text-[#C2341D]">OS</span>
                </h1>
                <span className="bg-[#C2341D]/10 text-[#C2341D] text-[10px] font-black uppercase px-1.5 py-0.2 rounded-full border border-[#C2341D]/20">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                Priest Operating System &amp; Sacred Tech Companion
              </p>
            </div>
          </div>

          {/* Desktop Tab Switcher (Visible on md and larger) */}
          <nav
            aria-label="Desktop Navigation"
            className="hidden md:flex items-center p-1 bg-stone-200/60 rounded-xl border border-stone-300/70 shadow-inner"
          >
            {/* Persona 1: Purohit OS */}
            <button
              onClick={() => onSelectTab('purohit')}
              id="desktop-nav-tab-purohit"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'purohit'
                  ? 'bg-white text-stone-950 shadow-xs ring-1 ring-stone-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <span>📿</span>
              <span>Purohit OS</span>
              {metrics.ceremoniesToday > 0 && (
                <span className="bg-[#C2341D] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {metrics.ceremoniesToday}
                </span>
              )}
            </button>

            {/* Persona 2: Family & Devotee */}
            <button
              onClick={() => onSelectTab('family')}
              id="desktop-nav-tab-family"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'family'
                  ? 'bg-white text-stone-950 shadow-xs ring-1 ring-stone-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <span>🪔</span>
              <span>Family &amp; Devotee</span>
            </button>

            {/* Persona 3: Aggregator Logistics */}
            <button
              onClick={() => onSelectTab('aggregator')}
              id="desktop-nav-tab-aggregator"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'aggregator'
                  ? 'bg-white text-stone-950 shadow-xs ring-1 ring-stone-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Logistics SLA</span>
            </button>

            {/* Persona 4: Digital Standee */}
            <button
              onClick={() => onSelectTab('standee')}
              id="desktop-nav-tab-standee"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'standee'
                  ? 'bg-white text-stone-950 shadow-xs ring-1 ring-stone-300'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-amber-700" />
              <span>UPI Standee</span>
            </button>
          </nav>

          {/* Quick Metrics Toggle Button on Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setShowMobileMetrics(!showMobileMetrics)}
              id="mobile-metrics-toggle-btn"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold bg-white shadow-2xs"
            >
              <span className="text-[11px] font-mono text-emerald-700 font-bold">
                ₹{metrics.dakshinaToday.toLocaleString('en-IN')}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showMobileMetrics ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Executive Metrics Bar (Always visible on desktop, toggleable on mobile) */}
        <div
          className={`${
            showMobileMetrics ? 'grid' : 'hidden md:grid'
          } grid-cols-2 md:grid-cols-4 gap-2 pt-2.5 mt-2 border-t border-stone-200/70 transition-all`}
        >
          {/* Metric 1 */}
          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Today's Pujas
              </span>
              <p className="text-base font-black text-stone-900 leading-tight flex items-center gap-1.5">
                {metrics.ceremoniesToday}
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                  Active
                </span>
              </p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#C2341D] flex items-center justify-center font-bold text-xs">
              📿
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Dakshina Settled
              </span>
              <p className="text-base font-black text-emerald-700 leading-tight">
                ₹{metrics.dakshinaToday.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                D-1 Samagri Kits
              </span>
              <p className="text-base font-black text-blue-700 leading-tight flex items-center gap-1.5">
                {metrics.samagriStagedPercent}%
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded">
                  Staged
                </span>
              </p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
              📦
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Yajamana Households
              </span>
              <p className="text-base font-black text-stone-800 leading-tight">
                {metrics.activeClientsCount} Gotras
              </p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs">
              🪔
            </div>
          </div>
        </div>
      </div>

      {/* Panchang Astrological Details Modal / Bottom Sheet */}
      {isPanchangModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full border border-stone-200 shadow-2xl overflow-hidden animate-bottom-sheet sm:animate-dialog-scale max-h-[85vh] flex flex-col">
            {/* Sheet Pull Handle on Mobile */}
            <div className="sm:hidden w-10 h-1 bg-stone-300 rounded-full mx-auto mt-2.5 mb-1" />

            {/* Modal Header */}
            <div className="bg-[#1C140E] text-white p-4 flex items-center justify-between border-b border-amber-900/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-base">
                  🪔
                </div>
                <div>
                  <h3 className="font-bold text-sm text-amber-200 font-display">
                    Panchang &amp; Muhurat Engine
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Bengaluru Metropolitan Vedic Coordinates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPanchangModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-3 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Tithi</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">{PANCHANG_INFO.tithi}</p>
                  <p className="text-[10px] text-stone-500 mt-1">Shukla Paksha</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase block">Nakshatra</span>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">{PANCHANG_INFO.nakshatra}</p>
                  <p className="text-[10px] text-stone-500 mt-1">Padam 3 (Deity: Brihaspati)</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    ✨ Shubh Muhurat
                  </span>
                  <p className="font-black text-emerald-900 text-sm mt-0.5">{PANCHANG_INFO.shubhMuhurat}</p>
                  <p className="text-[10px] text-emerald-700 mt-1">Abhijit / Amrit Kaal</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">
                    ⚠️ Rahu Kaal
                  </span>
                  <p className="font-bold text-amber-950 text-sm mt-0.5">{PANCHANG_INFO.rahuKaal}</p>
                  <p className="text-[10px] text-amber-800 mt-1">Avoid initiation of vows</p>
                </div>
              </div>

              {/* Sun & Moon Timings */}
              <div className="p-3 rounded-xl bg-[#FFFDF9] border border-amber-200/80 text-xs space-y-1">
                <div className="flex justify-between text-stone-700">
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    Sunrise / Sunset:
                  </span>
                  <strong className="text-stone-900">{PANCHANG_INFO.sunrise} / 06:14 PM</strong>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>Samvatsara:</span>
                  <strong className="text-stone-900">Krodhi Nama Samvatsara</strong>
                </div>
                <div className="flex justify-between text-stone-700">
                  <span>Dakshinayana / Ritu:</span>
                  <strong className="text-stone-900">Sharad Ritu (Autumn)</strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setIsPanchangModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
              >
                Close Panchang
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
