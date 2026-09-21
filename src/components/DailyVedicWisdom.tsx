import React, { useState, useEffect } from 'react';
import {
  VEDIC_WISDOM_COLLECTION,
  getWisdomIndexForTithi,
  VedicVerse,
} from '../data/vedicWisdomData';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  Copy,
  Check,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Sun,
  Flame,
} from 'lucide-react';

interface DailyVedicWisdomProps {
  currentTithi: string;
  onShowToast?: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
}

export const DailyVedicWisdom: React.FC<DailyVedicWisdomProps> = ({
  currentTithi,
  onShowToast,
}) => {
  const initialIndex = getWisdomIndexForTithi(currentTithi);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync if Tithi changes externally
  useEffect(() => {
    const idx = getWisdomIndexForTithi(currentTithi);
    setCurrentIndex(idx);
  }, [currentTithi]);

  // Auto rotation timer when enabled
  useEffect(() => {
    if (!isAutoRotating) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % VEDIC_WISDOM_COLLECTION.length);
    }, 8000); // 8 seconds per verse

    return () => clearInterval(timer);
  }, [isAutoRotating]);

  const currentVerse: VedicVerse = VEDIC_WISDOM_COLLECTION[currentIndex] || VEDIC_WISDOM_COLLECTION[0];
  const isTodayTithi = currentIndex === initialIndex;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % VEDIC_WISDOM_COLLECTION.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + VEDIC_WISDOM_COLLECTION.length) % VEDIC_WISDOM_COLLECTION.length);
  };

  const handleResetToToday = () => {
    setCurrentIndex(initialIndex);
    if (onShowToast) {
      onShowToast(
        "Tithi Wisdom Aligned 📿",
        `Reset to today's active Tithi: ${currentVerse.tithiName}`,
        'info'
      );
    }
  };

  const handleCopy = () => {
    const textToCopy = `॥ ${currentVerse.sanskrit} ॥\n\n${currentVerse.transliteration}\n\nMeaning: ${currentVerse.english}\nSource: ${currentVerse.source} (${currentVerse.deity})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onShowToast) {
      onShowToast('Vedic Verse Copied 📋', 'Sanskrit text and translation copied to clipboard.', 'success');
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const playVedicBellChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Dual harmonic resonance (528Hz Love/Transformation + 108Hz Om undertone)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, ctx.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(432, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.8);
      osc2.stop(ctx.currentTime + 1.8);

      if (onShowToast) {
        onShowToast('Sacred Chime 🔔', 'Harmonic 528Hz Vedic bell chime sounded for meditation.', 'info');
      }
    } catch {
      // Audio policy safe
    }
  };

  return (
    <div
      id="daily-vedic-wisdom-section"
      className="bg-gradient-to-r from-[#FFFDF9] via-[#FAF4EA] to-[#FFFDF9] border-y border-amber-200/90 shadow-xs relative transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        {/* Top Wisdom Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Title & Tithi Alignment Pill */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0 bg-gradient-to-r from-amber-700 to-[#8B1E0F] text-white px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-200 animate-pulse" />
              <span>Daily Vedic Wisdom</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="hidden sm:inline-block text-neutral-400 text-xs">•</span>
              <span
                className={`text-[11px] font-bold truncate ${
                  isTodayTithi ? 'text-[#8B1E0F]' : 'text-neutral-700'
                }`}
              >
                {currentVerse.tithiName}
              </span>
              {isTodayTithi && (
                <span className="shrink-0 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                  Today's Tithi
                </span>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            {/* Audio bell button */}
            <button
              onClick={playVedicBellChime}
              title="Sound Sacred 528Hz Bell Chime"
              className="p-1 rounded-md text-amber-900 hover:bg-amber-200/60 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              title="Copy Sanskrit Verse and Translation"
              className="p-1 rounded-md text-amber-900 hover:bg-amber-200/60 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* Auto Rotate Toggle */}
            <button
              onClick={() => setIsAutoRotating((prev) => !prev)}
              title={isAutoRotating ? 'Pause auto-rotation' : 'Start auto-rotation of Vedic wisdom'}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                isAutoRotating
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200'
              }`}
            >
              {isAutoRotating ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
              <span className="hidden md:inline">{isAutoRotating ? 'Rotating' : 'Auto-Rotate'}</span>
            </button>

            {/* Reset to today's tithi if navigated away */}
            {!isTodayTithi && (
              <button
                onClick={handleResetToToday}
                title="Reset to today's Panchang Tithi"
                className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-[#8B1E0F] px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">Today</span>
              </button>
            )}

            {/* Prev / Next Buttons */}
            <div className="flex items-center bg-amber-100/70 rounded-md border border-amber-200 overflow-hidden">
              <button
                onClick={handlePrev}
                title="Previous Tithi Verse"
                className="p-1 hover:bg-amber-200 text-amber-900 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-1.5 text-[10px] font-mono font-bold text-amber-900 select-none">
                {currentIndex + 1}/{VEDIC_WISDOM_COLLECTION.length}
              </span>
              <button
                onClick={handleNext}
                title="Next Tithi Verse"
                className="p-1 hover:bg-amber-200 text-amber-900 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Expand / Collapse Details */}
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              title={isExpanded ? 'Collapse to compact banner' : 'Expand full Vedic verse exegesis'}
              className="flex items-center gap-1 text-[#8B1E0F] hover:text-black font-bold text-[11px] p-1 rounded hover:bg-amber-100 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isExpanded ? 'Less' : 'Exegesis'}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Compact Banner View (Always Visible) */}
        <div className="mt-1.5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          {/* Sanskrit Line */}
          <div className="flex items-start md:items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D9381E] to-[#D4AF37] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs font-serif">
              ॐ
            </span>
            <p className="font-serif text-[13px] sm:text-[14px] font-semibold text-neutral-900 tracking-wide truncate">
              {currentVerse.sanskrit}
            </p>
          </div>

          {/* Source and Deity Pill */}
          <div className="flex items-center gap-2 shrink-0 text-[11px] text-neutral-600">
            <span className="bg-amber-100/90 text-amber-950 font-medium px-2 py-0.5 rounded-md border border-amber-200 font-mono text-[10px]">
              {currentVerse.source}
            </span>
            <span className="hidden lg:inline text-neutral-500 font-medium">
              Deity: <strong className="text-neutral-800">{currentVerse.deity}</strong>
            </span>
          </div>
        </div>

        {/* Expanded Rich View (When toggled on) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-amber-200/70 space-y-3 animate-fadeIn">
            {/* Full Sanskrit & Transliteration Card */}
            <div className="bg-gradient-to-b from-[#FFFDF9] to-[#F7EFE2] p-3 rounded-xl border border-amber-300 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#D9381E]" />
                  Sacred Sanskrit Shloka &amp; Pronunciation
                </span>
                <button
                  onClick={() => setShowTransliteration((prev) => !prev)}
                  className="text-[10px] font-semibold text-[#8B1E0F] hover:underline"
                >
                  {showTransliteration ? 'Hide Transliteration' : 'Show Roman Script'}
                </button>
              </div>

              <div className="text-center py-2 px-3 bg-white/70 rounded-lg border border-amber-200/80 shadow-inner">
                <p className="font-serif text-base sm:text-lg font-bold text-neutral-950 tracking-wider leading-relaxed">
                  {currentVerse.sanskrit}
                </p>
                {showTransliteration && (
                  <p className="font-serif italic text-xs sm:text-sm text-neutral-700 mt-1.5 tracking-wide">
                    {currentVerse.transliteration}
                  </p>
                )}
              </div>
            </div>

            {/* Translation & Spiritual Guidance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#8B1E0F] font-bold text-[11px]">
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  <span>Vedic Meaning &amp; Essence</span>
                </div>
                <p className="text-neutral-800 leading-relaxed font-serif text-[12px]">
                  "{currentVerse.english}"
                </p>
                <div className="pt-1 text-[11px] text-amber-900 font-semibold">
                  Core Essence: <span className="text-neutral-700 font-normal">{currentVerse.essence}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ritual Application for Today ({currentVerse.tithiKeyword})</span>
                </div>
                <p className="text-neutral-700 leading-relaxed text-[11px]">
                  {currentVerse.ritualContext}
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-500">
                  <span>Presiding Deity: <strong className="text-neutral-800">{currentVerse.deity}</strong></span>
                  <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">{currentVerse.source}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
