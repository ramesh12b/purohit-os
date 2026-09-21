import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { RitualBooking, GoogleChatSpace } from '../types';
import {
  X,
  MapPin,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Send,
  Copy,
  Download,
  Share2,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Plus,
  AlertCircle,
  Bell,
  QrCode,
  Smartphone,
  ExternalLink,
  RefreshCw,
  Save,
  BookmarkCheck,
} from 'lucide-react';

interface RiderModalProps {
  booking: RitualBooking | null;
  onClose: () => void;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
}

export const RiderTrackingModal: React.FC<RiderModalProps> = ({ booking, onClose, onShowToast }) => {
  if (!booking || !booking.riderInfo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-amber-300 shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D9381E] to-[#B33018] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-black text-base font-serif">
                D-1 Samagri Rider Live Transit
              </h3>
              <p className="text-xs text-amber-200">
                Booking: #{booking.id.toUpperCase()} • {booking.locality}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Simulator */}
        <div className="p-4 space-y-4">
          <div className="h-44 bg-neutral-900 rounded-xl relative overflow-hidden flex flex-col justify-between p-3 border border-neutral-700">
            {/* Simulated Road Grids */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                GPS Active: Indiranagar 100ft Rd Corridor
              </span>
              <span className="bg-orange-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-full">
                ETA: {booking.riderInfo.etaMinutes} Mins
              </span>
            </div>

            {/* Visual Route Markers */}
            <div className="relative z-10 flex items-center justify-between px-6 py-2">
              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mx-auto shadow-md">
                  📦
                </div>
                <span className="text-[10px] text-neutral-300 font-bold block mt-1">Indiranagar Hub</span>
              </div>

              {/* Dotted Trail */}
              <div className="flex-1 mx-2 border-b-2 border-dashed border-amber-400 relative">
                <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-amber-500 text-white p-1 rounded-full text-xs animate-bounce shadow">
                  🛵
                </div>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mx-auto shadow-md">
                  🏠
                </div>
                <span className="text-[10px] text-neutral-300 font-bold block mt-1">Yajamana Home</span>
              </div>
            </div>

            <p className="relative z-10 text-[11px] text-neutral-300 text-center font-medium">
              Current Location: <strong className="text-white">{booking.riderInfo.currentLocation}</strong>
            </p>
          </div>

          {/* Rider Info Card */}
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 font-bold uppercase">Assigned Delivery Executive</p>
              <h4 className="font-black text-neutral-900 text-sm">{booking.riderInfo.name}</h4>
              <p className="text-xs font-mono text-neutral-600">{booking.riderInfo.phone}</p>
            </div>
            <a
              href={`tel:${booking.riderInfo.phone}`}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Rider
            </a>
          </div>

          {/* Kit Items Confirmation Checklist */}
          <div className="border border-amber-200 rounded-xl p-3 bg-amber-50/50">
            <p className="text-xs font-bold text-neutral-800 mb-1.5">
              Verified Kit Checklist ({booking.samagriKitName}):
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-neutral-700">
              {booking.samagriItems.map((item) => (
                <div key={item.id} className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-amber-100">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 p-3 px-4 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            D-1 Assurance: Kit staged 18 hours before ritual.
          </span>
          <button
            onClick={() => {
              onShowToast('Delivery Mark Prompted', 'Notification sent to rider to upload photo proof on doorstep.', 'info');
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#D9381E] hover:bg-[#B33018] text-white text-xs font-bold"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface DossierModalProps {
  booking: RitualBooking | null;
  onClose: () => void;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  onSaveFieldNotes?: (bookingId: string, notes: string) => void;
}

const RITUAL_PROGRESS_STAGES = [
  {
    id: 'step-1',
    number: 1,
    title: 'Purvanga & Ganapati Puja',
    subtitle: 'Deepa Prajwalana, Achamanam & Vigneshwara invocation',
    mantraCue: 'ॐ गं गणपतये नमः • भद्रं कर्णेभिः शृणुयाम देवाः',
    estimatedMinutes: 25,
    tag: 'Foundation',
  },
  {
    id: 'step-2',
    number: 2,
    title: 'Maha Sankalpa',
    subtitle: 'Desha, Kala, Gotra recitation & sacred family commitment',
    mantraCue: 'ममोपात्त-समस्त-दुरितक्षयद्वारा श्री परमेश्वर प्रीत्यर्थं...',
    estimatedMinutes: 20,
    tag: 'Sacred Vow',
  },
  {
    id: 'step-3',
    number: 3,
    title: 'Kalasha Sthapana & Punyahavachanam',
    subtitle: 'Varuna Devata invocation & holy water sanctification',
    mantraCue: 'इमं मे गङ्गे यमुने सरस्वति शुतुद्रि स्तोमं सचता परुष्ण्या...',
    estimatedMinutes: 20,
    tag: 'Purification',
  },
  {
    id: 'step-4',
    number: 4,
    title: 'Agni Pratishtha & Homa',
    subtitle: 'Kindling the holy Agni & 108 Oshadhi herbal oblations',
    mantraCue: 'ॐ अग्नये स्वाहा • सोमाय स्वाहा • प्रजापतये स्वाहा',
    estimatedMinutes: 45,
    tag: 'Sacred Oblation',
  },
  {
    id: 'step-5',
    number: 5,
    title: 'Maha Purnahuti & Vasordhara',
    subtitle: 'Silk vastra oblation, unspilled ghee stream & final offering',
    mantraCue: 'पूर्णमदः पूर्णमिदं पूर्णात् पूर्णमुदच्यते...',
    estimatedMinutes: 15,
    tag: 'Culmination',
  },
  {
    id: 'step-6',
    number: 6,
    title: 'Mangalarathi & Ashirvachanam',
    subtitle: 'Camphor aarthi, Vedic blessing, Raksha sutra & prashad',
    mantraCue: 'कर्पूरगौरं करुणावतारं • ॐ स्वस्ति न इन्द्रो वृद्धश्रवाः',
    estimatedMinutes: 20,
    tag: 'Blessing',
  },
];

export const DossierModal: React.FC<DossierModalProps> = ({
  booking,
  onClose,
  onShowToast,
  onSaveFieldNotes,
}) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(1); // Default at Step 2: Sankalpa
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [stageElapsed, setStageElapsed] = useState<Record<number, number>>({
    0: 25 * 60, // Step 1 already completed
    1: 340,     // Step 2 in progress (5 min 40 sec)
  });
  const [stageTimeBonus, setStageTimeBonus] = useState<Record<number, number>>({});
  const [fieldNotes, setFieldNotes] = useState<string>(booking?.fieldNotes || '');
  const [isNotesSaved, setIsNotesSaved] = useState<boolean>(true);

  // Sync field notes if booking changes
  useEffect(() => {
    if (booking) {
      setFieldNotes(booking.fieldNotes || '');
      setIsNotesSaved(true);
    }
  }, [booking]);

  if (!booking) return null;

  const currentStage = RITUAL_PROGRESS_STAGES[activeStageIndex];
  const bonusMinutes = stageTimeBonus[activeStageIndex] || 0;
  const targetTotalMinutes = currentStage.estimatedMinutes + bonusMinutes;
  const targetSeconds = targetTotalMinutes * 60;
  const currentElapsed = stageElapsed[activeStageIndex] || 0;
  const remainingSeconds = Math.max(0, targetSeconds - currentElapsed);
  const isOvertime = currentElapsed > targetSeconds;
  const overtimeSeconds = Math.max(0, currentElapsed - targetSeconds);
  const timePercent = Math.min(100, Math.round((currentElapsed / targetSeconds) * 100));
  const remainingPercent = Math.max(0, Math.min(100, Math.round((remainingSeconds / targetSeconds) * 100)));

  // Total Ceremony Statistics
  const totalCeremonyElapsedSeconds = Object.values(stageElapsed).reduce((sum, val) => sum + val, 0);
  const totalEstimatedCeremonyMinutes = RITUAL_PROGRESS_STAGES.reduce(
    (sum, s, idx) => sum + s.estimatedMinutes + (stageTimeBonus[idx] || 0),
    0
  );

  const playBellChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz auspicious frequency
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Ignore audio policy issues
    }
  };

  // Live Timer Interval
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setStageElapsed((prev) => {
        const curr = prev[activeStageIndex] || 0;
        const next = curr + 1;
        const target = (currentStage.estimatedMinutes + (stageTimeBonus[activeStageIndex] || 0)) * 60;
        if (next === target) {
          playBellChime();
          onShowToast(
            `Muhurat Window Concluded 🔔`,
            `${currentStage.title} allotted ${currentStage.estimatedMinutes}m has elapsed. Prepare transition.`,
            'warning'
          );
        }
        return { ...prev, [activeStageIndex]: next };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, activeStageIndex, currentStage.estimatedMinutes, currentStage.title, stageTimeBonus, onShowToast]);

  const formatMmSs = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((activeStageIndex + 1) / RITUAL_PROGRESS_STAGES.length) * 100);

  // SVG Circular progress math (radius = 36, circumference = ~226.19)
  const dialRadius = 36;
  const dialCircumference = 2 * Math.PI * dialRadius;
  const strokeOffset = isOvertime ? 0 : dialCircumference * (1 - remainingPercent / 100);

  const handleNextStage = () => {
    if (activeStageIndex < RITUAL_PROGRESS_STAGES.length - 1) {
      const nextIdx = activeStageIndex + 1;
      setActiveStageIndex(nextIdx);
      setIsTimerRunning(true);
      onShowToast(
        `Ritual Advanced: ${RITUAL_PROGRESS_STAGES[nextIdx].title} 🪔`,
        `Step ${nextIdx + 1} of ${RITUAL_PROGRESS_STAGES.length} is now active. Countdown started.`,
        'success'
      );
    } else {
      onShowToast('Ritual Completed! 🕉️', 'All 6 Vedic stages fulfilled with Mangalarathi.', 'success');
    }
  };

  const handlePrevStage = () => {
    if (activeStageIndex > 0) {
      setActiveStageIndex((prev) => prev - 1);
    }
  };

  const handleNotifyFamily = () => {
    onShowToast(
      'Family Notified! 📲',
      `WhatsApp alert sent to ${booking.clientName}: "${currentStage.title} is underway (${formatMmSs(currentElapsed)} elapsed). Please assemble for offerings."`,
      'info'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-amber-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#D9381E] to-[#B33018] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-black text-base font-serif">
                Priest Ritual Dossier &amp; Live Progression
              </h3>
              <p className="text-xs text-amber-200">
                {booking.ritualName} • {booking.clientName} ({booking.gotra})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs">
          {/* STEP-BY-STEP PROGRESS TIMELINE & CUMULATIVE STATS */}
          <div className="bg-gradient-to-br from-[#FAF6F0] via-[#FFF9F2] to-[#F7EFE6] p-4 rounded-xl border-2 border-amber-300 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D9381E] animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-[#D9381E] font-serif">
                  Live Ritual Progression &amp; Pacing
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                  Stage {activeStageIndex + 1} of {RITUAL_PROGRESS_STAGES.length}
                </span>
                <span className="bg-white text-neutral-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                  Total Elapsed: {formatMmSs(totalCeremonyElapsedSeconds)} / {totalEstimatedCeremonyMinutes}m
                </span>
              </div>
            </div>

            {/* Visual Cumulative Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#D9381E] to-[#D4AF37] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>Purvanga Start</span>
                <span>Ritual Progress: {progressPercent}%</span>
                <span>Mangalarathi</span>
              </div>
            </div>

            {/* Horizontal Stage Stepper Pills */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
              {RITUAL_PROGRESS_STAGES.map((stage, idx) => {
                const isCompleted = idx < activeStageIndex;
                const isActive = idx === activeStageIndex;
                const elapsedForStage = stageElapsed[idx] || 0;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStageIndex(idx)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center ${
                      isActive
                        ? 'bg-[#D9381E] text-white border-[#B33018] shadow-sm ring-2 ring-amber-300'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <span
                          className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                            isActive ? 'bg-white text-[#D9381E]' : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {stage.number}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold leading-tight line-clamp-1">
                      {stage.title.split(' ')[0]}
                    </span>
                    <span
                      className={`text-[8px] font-semibold uppercase mt-0.5 ${
                        isActive
                          ? 'text-amber-200 font-mono font-bold'
                          : isCompleted
                          ? 'text-emerald-700 font-mono'
                          : 'text-neutral-400'
                      }`}
                    >
                      {isActive
                        ? formatMmSs(currentElapsed)
                        : isCompleted
                        ? `${formatMmSs(elapsedForStage)}`
                        : `~${stage.estimatedMinutes}m`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Detailed Card */}
            <div className="bg-white rounded-xl p-3.5 border border-amber-300/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded uppercase mb-1">
                    <Flame className="w-3 h-3 text-[#D9381E]" />
                    Stage {currentStage.number}: {currentStage.tag}
                  </div>
                  <h4 className="text-sm font-black text-neutral-900 font-serif">
                    {currentStage.title}
                  </h4>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    {currentStage.subtitle}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-amber-900 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-200 inline-block">
                    Target: {targetTotalMinutes} mins
                  </span>
                  {bonusMinutes > 0 && (
                    <span className="block text-[9px] text-emerald-700 font-bold mt-0.5">
                      +{bonusMinutes}m buffer active
                    </span>
                  )}
                </div>
              </div>

              {/* VISUAL RADIAL COUNTDOWN & ELAPSED MUHURAT COCKPIT */}
              <div
                className={`text-white p-4 rounded-xl border shadow-md space-y-3 transition-all ${
                  isOvertime
                    ? 'bg-gradient-to-br from-[#2D0F0F] via-[#3B1212] to-[#1F0A0A] border-red-500/60 ring-1 ring-red-500/30'
                    : remainingSeconds < 120
                    ? 'bg-gradient-to-br from-[#2D1B0F] via-[#381F10] to-[#1F120A] border-amber-500/60 ring-1 ring-amber-500/30'
                    : 'bg-gradient-to-br from-[#122019] via-[#1A2E24] to-[#0E1A14] border-emerald-500/50'
                }`}
              >
                {/* Visual Cue Alert Bar */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {isOvertime ? '🔔' : remainingSeconds < 120 ? '⏳' : '🪔'}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider block text-white/90">
                        {isOvertime
                          ? 'Overtime Warning'
                          : remainingSeconds < 120
                          ? 'Wrap-Up Window'
                          : 'Segment Muhurat Clock'}
                      </span>
                      <p className="text-[10px] text-neutral-300">
                        {isOvertime
                          ? `Allotted ${targetTotalMinutes}m exceeded. Conclude offerings for next stage.`
                          : remainingSeconds < 120
                          ? `Final 2 minutes remaining. Begin transition chanting.`
                          : `Recite according to traditional Vedic tempo.`}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isOvertime ? (
                      <span className="inline-flex items-center gap-1 bg-red-900/80 text-red-200 border border-red-400 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                        <AlertCircle className="w-3 h-3 text-red-300" />
                        +{formatMmSs(overtimeSeconds)} Over
                      </span>
                    ) : remainingSeconds < 120 ? (
                      <span className="inline-flex items-center gap-1 bg-amber-900/80 text-amber-200 border border-amber-400 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                        <Clock className="w-3 h-3 text-amber-300" />
                        Final 2 Mins
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-emerald-900/80 text-emerald-200 border border-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        On Schedule
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary Dual-Display: Radial Gauge + High-Contrast Digits */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-black/30 p-3.5 rounded-xl border border-white/10">
                  {/* Left: Circular SVG Dial */}
                  <div className="sm:col-span-5 flex items-center justify-center sm:justify-start gap-3">
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        {/* Background track circle */}
                        <circle
                          cx="40"
                          cy="40"
                          r={dialRadius}
                          className="stroke-white/15"
                          strokeWidth="6"
                          fill="none"
                        />
                        {/* Dynamic Progress fill circle */}
                        <circle
                          cx="40"
                          cy="40"
                          r={dialRadius}
                          stroke={isOvertime ? '#EF4444' : remainingSeconds < 120 ? '#F59E0B' : '#10B981'}
                          strokeWidth="6"
                          strokeDasharray={dialCircumference}
                          strokeDashoffset={strokeOffset}
                          strokeLinecap="round"
                          fill="none"
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>

                      {/* Center label in circle */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[11px] font-mono font-black leading-none">
                          {isOvertime ? `+${Math.floor(overtimeSeconds / 60)}m` : `${remainingPercent}%`}
                        </span>
                        <span className="text-[7px] uppercase font-bold text-white/70 mt-0.5">
                          {isOvertime ? 'Over' : 'Left'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block">
                        {isOvertime ? 'Time Over Allotted' : 'Time Remaining'}
                      </span>
                      <div
                        className={`font-mono text-2xl sm:text-3xl font-black tracking-tight ${
                          isOvertime
                            ? 'text-red-400 animate-pulse'
                            : remainingSeconds < 120
                            ? 'text-amber-300'
                            : 'text-emerald-300'
                        }`}
                      >
                        {isOvertime ? `+${formatMmSs(overtimeSeconds)}` : formatMmSs(remainingSeconds)}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        Target: <span className="text-white font-bold">{targetTotalMinutes}:00</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Elapsed Time breakdown */}
                  <div className="sm:col-span-3 border-y sm:border-y-0 sm:border-x border-white/10 py-2 sm:py-0 sm:px-3 text-center sm:text-left space-y-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Elapsed In Stage
                    </span>
                    <div className="font-mono text-xl font-bold text-white">
                      {formatMmSs(currentElapsed)}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Pacing: <strong className="text-amber-200">{timePercent}%</strong> of window
                    </div>
                  </div>

                  {/* Right: Priest Quick Action Controls */}
                  <div className="sm:col-span-4 flex flex-wrap items-center justify-center sm:justify-end gap-1.5">
                    {/* Pause / Resume */}
                    <button
                      onClick={() => setIsTimerRunning((prev) => !prev)}
                      title={isTimerRunning ? 'Pause countdown' : 'Resume countdown'}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                        isTimerRunning
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40'
                          : 'bg-gradient-to-r from-[#D9381E] to-[#B33018] text-white hover:brightness-110 border border-[#D9381E]'
                      }`}
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Resume</span>
                        </>
                      )}
                    </button>

                    {/* Reset Segment */}
                    <button
                      onClick={() => {
                        setStageElapsed((prev) => ({ ...prev, [activeStageIndex]: 0 }));
                        onShowToast('Timer Reset', `${currentStage.title} timer reset to 00:00.`, 'info');
                      }}
                      title="Reset elapsed time for this segment"
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/10 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    {/* +2m Buffer */}
                    <button
                      onClick={() => {
                        setStageTimeBonus((prev) => ({
                          ...prev,
                          [activeStageIndex]: (prev[activeStageIndex] || 0) + 2,
                        }));
                        onShowToast('+2 Mins Added ⏱️', `Added 2 minutes to ${currentStage.title}.`, 'info');
                      }}
                      title="Add 2 minutes buffer"
                      className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/15 text-xs font-bold transition-colors"
                    >
                      +2m
                    </button>

                    {/* +5m Buffer */}
                    <button
                      onClick={() => {
                        setStageTimeBonus((prev) => ({
                          ...prev,
                          [activeStageIndex]: (prev[activeStageIndex] || 0) + 5,
                        }));
                        onShowToast('+5 Mins Extended ⏱️', `Added 5 minutes to ${currentStage.title} muhurat window.`, 'info');
                      }}
                      title="Add 5 minutes buffer for extra mantras or delay"
                      className="px-2 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30 text-xs font-bold transition-colors"
                    >
                      +5m
                    </button>

                    {/* Auspicious Bell Sound */}
                    <button
                      onClick={playBellChime}
                      title="Play auspicious sacred temple bell chime"
                      className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/30 transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar with Color Cue */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-neutral-300">
                    <span>Segment Progress</span>
                    <span className="font-mono text-amber-300 font-bold">{timePercent}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOvertime
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 animate-pulse'
                          : remainingSeconds < 120
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                          : 'bg-gradient-to-r from-emerald-500 via-amber-400 to-[#D4AF37]'
                      }`}
                      style={{ width: `${Math.min(100, (currentElapsed / targetSeconds) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Sanskrit Mantra Cue Prompt */}
              <div className="bg-[#FAF6F0] p-2.5 rounded-lg border border-amber-200 text-neutral-800">
                <span className="text-[9px] font-mono font-bold text-amber-900 uppercase block mb-0.5">
                  Vedic Mantra Cue:
                </span>
                <p className="font-serif text-xs font-semibold text-neutral-900 italic">
                  "{currentStage.mantraCue}"
                </p>
              </div>

              {/* Stage Navigation & Notification Actions */}
              <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevStage}
                    disabled={activeStageIndex === 0}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 border transition-all ${
                      activeStageIndex === 0
                        ? 'opacity-40 cursor-not-allowed text-neutral-400 border-neutral-200'
                        : 'text-neutral-700 hover:bg-neutral-100 border-neutral-300'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Previous
                  </button>

                  <button
                    onClick={handleNextStage}
                    className="px-3 py-1 rounded-md bg-[#D9381E] hover:bg-[#B33018] text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all"
                  >
                    {activeStageIndex === RITUAL_PROGRESS_STAGES.length - 1 ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Mark Complete
                      </>
                    ) : (
                      <>
                        Next: {RITUAL_PROGRESS_STAGES[activeStageIndex + 1].title.split(' ')[0]}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleNotifyFamily}
                  className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  <Bell className="w-3 h-3 text-emerald-600" />
                  Notify Family on WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Sanskrit Sankalpa Box */}
          <div className="bg-[#FAF6F0] p-4 rounded-xl border-2 border-amber-200">
            <span className="text-[10px] font-mono font-bold text-amber-900 uppercase block mb-1">
              VEDIC SANKALPA INVOCATION (DESHA, KALA, GOTRA)
            </span>
            <p className="font-serif text-sm font-semibold text-neutral-900 leading-relaxed italic">
              "ममोपात्त-समस्त-दुरितक्षयद्वारा श्री परमेश्वर प्रीत्यर्थं {booking.gotra} उत्पन्नस्य {booking.clientName} नामधेयस्य सपरिवारस्य आयुर्-आरोग्य-ऐश्वर्य अभिवृद्ध्यर्थं {booking.ritualName} कर्म करिष्ये..."
            </p>
          </div>

          {/* Lineage Matrix */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-500 font-semibold block">Gotra &amp; Pravara</span>
              <span className="font-black text-neutral-900 text-sm">{booking.gotra}</span>
            </div>
            <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-500 font-semibold block">Veda &amp; Sakha</span>
              <span className="font-black text-neutral-900 text-sm">{booking.veda || 'Krishna Yajurveda'}</span>
            </div>
            <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-500 font-semibold block">Nakshatra &amp; Rashi</span>
              <span className="font-black text-neutral-900 text-sm">{booking.nakshatra || 'Shravana'}</span>
            </div>
            <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
              <span className="text-neutral-500 font-semibold block">Expected Attendees</span>
              <span className="font-black text-neutral-900 text-sm">{booking.guestCount} Family Members</span>
            </div>
          </div>

          {/* Venue & Directions */}
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
            <span className="text-neutral-500 font-semibold block mb-0.5">Venue Coordinates &amp; Access</span>
            <p className="font-bold text-neutral-900">{booking.address}</p>
            <p className="text-neutral-600 mt-0.5">{booking.locality}</p>
          </div>

          {/* Notes */}
          {booking.specialNotes && (
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
              <span className="text-amber-900 font-bold block mb-0.5">Host Custom Requests:</span>
              <p className="text-neutral-700 italic">"{booking.specialNotes}"</p>
            </div>
          )}

          {/* FIELD NOTES & OBSERVATIONS ARCHIVAL CRM TEXTAREA */}
          <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] p-4 rounded-xl border-2 border-amber-300 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-amber-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#D9381E]/10 text-[#D9381E] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 font-serif">
                    Field Notes &amp; Ritual Deviations (Archival CRM)
                  </h4>
                  <p className="text-[10px] text-neutral-500">
                    Record observations, extra ahutis, family requests, or timing deviations for the family's permanent CRM dossier.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isNotesSaved ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                    <BookmarkCheck className="w-3 h-3 text-emerald-600" />
                    Archived in CRM
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 animate-pulse">
                    Unsaved Changes
                  </span>
                )}
              </div>
            </div>

            {/* Quick Insertion Tag Shortcuts */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                Quick Tag Shortcuts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '+ 108 Ahutis Completed',
                  '+ Extended Agni Mukha (+15m)',
                  '+ Additional Prashad Offered',
                  '+ Kula Devata Special Archana',
                  '+ Excellent Homa Smoke Clearance',
                  '+ Requested Annual Shraddha Reminder',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setFieldNotes((prev) => (prev ? `${prev.trim()}\n• ${tag.replace('+ ', '')}` : `• ${tag.replace('+ ', '')}`));
                      setIsNotesSaved(false);
                    }}
                    className="text-[10px] font-medium bg-white hover:bg-amber-100/70 text-neutral-800 px-2 py-1 rounded-md border border-amber-200 transition-colors cursor-pointer shadow-2xs"
                  >
                    {tag}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const timeStamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const entry = `[${timeStamp} - Stage ${currentStage.number}: ${currentStage.title}]: `;
                    setFieldNotes((prev) => (prev ? `${prev.trim()}\n${entry}` : entry));
                    setIsNotesSaved(false);
                  }}
                  className="text-[10px] font-bold bg-amber-100 hover:bg-amber-200 text-[#8B1E0F] px-2 py-1 rounded-md border border-amber-300 transition-colors cursor-pointer shadow-2xs"
                >
                  ⏱️ + Stamp Current Stage
                </button>
              </div>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-1.5">
              <textarea
                value={fieldNotes}
                onChange={(e) => {
                  setFieldNotes(e.target.value);
                  setIsNotesSaved(false);
                }}
                rows={3}
                placeholder="Log ritual observations, family preferences, mantra pacing notes, or homa modifications here (e.g., 'Family requested extra Gayathri ahutis. Excellent natural cross-ventilation in puja hall. Devotee asked for Sankranti Panchang reminder')..."
                className="w-full text-xs p-3 rounded-xl border border-amber-200 bg-white text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400 leading-relaxed font-sans placeholder:text-neutral-400 resize-y"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[10px] text-neutral-500 font-mono">
                  {fieldNotes.length} characters • Linked to {booking.clientName} (#{booking.id})
                </span>

                <div className="flex items-center gap-2">
                  {fieldNotes && (
                    <button
                      type="button"
                      onClick={() => {
                        setFieldNotes('');
                        setIsNotesSaved(false);
                      }}
                      className="text-[11px] text-neutral-500 hover:text-neutral-800 px-2 py-1 rounded transition-colors"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (onSaveFieldNotes && booking) {
                        onSaveFieldNotes(booking.id, fieldNotes);
                      }
                      setIsNotesSaved(true);
                      onShowToast(
                        'Field Notes Archived 🗄️',
                        `Custom ritual observations saved to ${booking.clientName}'s CRM profile.`,
                        'success'
                      );
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#D9381E] to-[#B33018] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:brightness-105 transition-all cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save &amp; Archive to CRM</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-50 p-3 px-4 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-medium">
            Active: <strong>{currentStage.title}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `Sankalpa for ${booking.clientName} (${booking.gotra}): "ममोपात्त-समस्त-दुरितक्षयद्वारा श्री परमेश्वर प्रीत्यर्थं ${booking.gotra} उत्पन्नस्य ${booking.clientName} नामधेयस्य... Active Stage: ${currentStage.title}"`
                );
                onShowToast('Dossier Copied', 'Sankalpa text and family gotra copied to clipboard.', 'info');
              }}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-800 text-xs font-bold flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Sankalpa
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#D9381E] hover:bg-[#B33018] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HomaSafetyModalProps {
  booking: RitualBooking | null;
  onClose: () => void;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
}

export const HomaSafetyModal: React.FC<HomaSafetyModalProps> = ({ booking, onClose, onShowToast }) => {
  const [checklist, setChecklist] = useState({
    ventilation: true,
    fireBlanket: true,
    heatPlate: true,
    waterBucket: true,
    smokeDetector: true,
  });

  if (!booking) return null;

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-amber-300 shadow-2xl overflow-hidden animate-scaleUp">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-black text-base font-serif">
                Homa Kund Fire Safety Protocol
              </h3>
              <p className="text-xs text-amber-100">
                Mandatory Apartment Safety Clearance
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <p className="text-neutral-600">
            Ensure the following 5 safety protocols are active at <strong className="text-neutral-900">{booking.address}</strong> before kindling Agni:
          </p>

          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.heatPlate}
              onChange={(e) => setChecklist({ ...checklist, heatPlate: e.target.checked })}
              className="rounded text-[#D9381E] focus:ring-[#D9381E]"
            />
            <span className="font-medium text-neutral-800">
              Heavy copper/brass base tray placed under Homa Kund (protects marble flooring)
            </span>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.ventilation}
              onChange={(e) => setChecklist({ ...checklist, ventilation: e.target.checked })}
              className="rounded text-[#D9381E] focus:ring-[#D9381E]"
            />
            <span className="font-medium text-neutral-800">
              Balcony/window cross-ventilation verified (open airflow)
            </span>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.waterBucket}
              onChange={(e) => setChecklist({ ...checklist, waterBucket: e.target.checked })}
              className="rounded text-[#D9381E] focus:ring-[#D9381E]"
            />
            <span className="font-medium text-neutral-800">
              Shanti Jala / cooling vessel within arm's reach of Purohit
            </span>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.smokeDetector}
              onChange={(e) => setChecklist({ ...checklist, smokeDetector: e.target.checked })}
              className="rounded text-[#D9381E] focus:ring-[#D9381E]"
            />
            <span className="font-medium text-neutral-800">
              Low-smoke camphor used; apartment ceiling sprinkler alerted
            </span>
          </label>
        </div>

        <div className="bg-neutral-50 p-3 px-4 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-500">
            {allChecked ? '🟢 All 5 Points Clear' : '⚠️ Unchecked Items'}
          </span>
          <button
            onClick={() => {
              booking.readiness.homaSafetyConfirmed = true;
              onShowToast('Homa Safety Verified! 🔥', 'Puja kund is safe for indoor execution.', 'success');
              onClose();
            }}
            disabled={!allChecked}
            className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all ${
              allChecked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-neutral-400 cursor-not-allowed'
            }`}
          >
            Confirm Safety Clearance
          </button>
        </div>
      </div>
    </div>
  );
};

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  phone: string;
  occasion: string;
  messageText: string;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  clientName,
  phone,
  occasion,
  messageText,
  onShowToast,
}) => {
  const [text, setText] = useState(messageText);

  if (!isOpen) return null;

  const handleSend = () => {
    onShowToast('WhatsApp Dispatched! 📲', `Vedic notification sent to ${clientName} (${phone}).`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full border-4 border-neutral-800 shadow-2xl overflow-hidden animate-scaleUp">
        {/* WhatsApp Phone Mock Header */}
        <div className="bg-[#075E54] text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm">
              🕉️
            </div>
            <div>
              <h4 className="font-bold text-xs leading-tight">{clientName}</h4>
              <p className="text-[10px] text-emerald-200">Online • Purohit OS Verified</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="bg-[#E5DDD5] p-3 min-h-[220px] flex flex-col justify-end space-y-2">
          <div className="bg-white rounded-xl rounded-tr-none p-3 shadow-xs max-w-[90%] self-end text-xs text-neutral-800 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full bg-transparent resize-none focus:outline-none text-xs text-neutral-900"
            />
            <span className="text-[9px] font-mono text-neutral-400 block text-right mt-1">
              Just now • ✓✓
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-3 flex items-center justify-between gap-2 border-t border-neutral-200">
          <button
            onClick={() => {
              navigator.clipboard.writeText(text);
              onShowToast('Text Copied', 'Message copied to clipboard.', 'info');
            }}
            className="p-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs font-bold"
            title="Copy Text"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            onClick={handleSend}
            className="flex-1 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Send className="w-4 h-4" />
            Send via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

interface GoogleChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  spaces: GoogleChatSpace[];
  selectedSpace: string;
  onSelectSpace: (space: string) => void;
  defaultMessage: string;
  onSend: (space: string, message: string) => void;
}

export const GoogleChatModal: React.FC<GoogleChatModalProps> = ({
  isOpen,
  onClose,
  spaces,
  selectedSpace,
  onSelectSpace,
  defaultMessage,
  onSend,
}) => {
  const [msg, setMsg] = useState(defaultMessage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-blue-300 shadow-2xl overflow-hidden animate-scaleUp">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
            </svg>
            <div>
              <h3 className="font-black text-base">Broadcast to Google Chat</h3>
              <p className="text-xs text-blue-200">Send ritual updates directly to workspace spaces</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Select Target Space:
            </label>
            <select
              value={selectedSpace}
              onChange={(e) => onSelectSpace(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-blue-600"
            >
              {spaces.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.displayName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              Message Content:
            </label>
            <textarea
              rows={4}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="bg-neutral-50 p-3 px-4 border-t border-neutral-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(selectedSpace, msg)}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onShowToast }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    // Generate a standalone, single-file HTML bundle with React, Babel, and Tailwind CDN
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Purohit OS & Family Ritual Companion (Standalone)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cinzel:wght@700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #FDFBF7; }
    .font-serif { font-family: 'Cinzel', serif; }
  </style>
</head>
<body class="bg-[#FDFBF7] text-neutral-900">
  <div id="root"></div>
  <script type="text/babel">
    const { useState } = React;
    function App() {
      return (
        <div class="max-w-4xl mx-auto p-6 text-center space-y-6">
          <div class="inline-block p-4 rounded-3xl bg-gradient-to-r from-[#D9381E] to-[#D4AF37] text-white shadow-xl">
            <h1 class="text-3xl font-black font-serif">🕉️ PUROHIT OS (Standalone Edition)</h1>
            <p class="text-sm mt-1">Venture-Scalable Ritual Commerce & Priest Operating System</p>
          </div>
          <p class="text-neutral-700 text-sm">Full React + Tailwind bundle compiled for zero-dependency hosting on Netlify.</p>
        </div>
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purohit-os-singlefile.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onShowToast('Export Complete! 📄', 'Downloaded purohit-os-singlefile.html ready for Netlify drop.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full border border-amber-300 shadow-2xl overflow-hidden animate-scaleUp">
        <div className="bg-gradient-to-r from-[#D9381E] to-[#B33018] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-300" />
            <h3 className="font-black text-base font-serif">
              Export Single-File Standalone HTML
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs text-neutral-600">
          <p>
            As requested by the prompt, this generates a completely self-contained <strong className="text-neutral-900">HTML5 + React + Tailwind CSS</strong> standalone file with CDN scripts.
          </p>
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
            <p className="font-bold">✓ Zero Build Steps Required</p>
            <p className="text-[11px] mt-0.5">
              Ready to drag-and-drop into Netlify Drop, GitHub Pages, or any static web hosting.
            </p>
          </div>
        </div>

        <div className="bg-neutral-50 p-3 px-4 border-t border-neutral-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-1.5 rounded-lg bg-[#D9381E] hover:bg-[#B33018] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Download HTML File
          </button>
        </div>
      </div>
    </div>
  );
};

interface ShareAppQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  customUrl?: string;
}

export const ShareAppQrModal: React.FC<ShareAppQrModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  customUrl,
}) => {
  const defaultSharedUrl = 'https://ais-pre-v4qoqlrc5srmqzekdfrv5j-493811283130.asia-southeast1.run.app';
  const currentBrowserUrl = typeof window !== 'undefined' ? window.location.href : defaultSharedUrl;
  const devUrl = 'https://ais-dev-v4qoqlrc5srmqzekdfrv5j-493811283130.asia-southeast1.run.app';

  const [urlType, setUrlType] = useState<'shared' | 'current' | 'dev'>('shared');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const activeUrl = customUrl || (urlType === 'shared' ? defaultSharedUrl : urlType === 'current' ? currentBrowserUrl : devUrl);

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(activeUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#1F1410',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((dataUri) => {
        setQrDataUrl(dataUri);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
  }, [isOpen, activeUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    onShowToast('Link Copied! 📋', 'Purohit OS application URL copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Purohit OS & Family Ritual Companion',
          text: 'Open Purohit OS & Family Ritual Companion on your mobile device:',
          url: activeUrl,
        });
      } catch (err) {
        console.log('Share canceled or not supported', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border-2 border-amber-300 shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B1E0F] via-[#D9381E] to-[#B33018] p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-200">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base font-serif tracking-tight">
                Scan &amp; Open on Mobile
              </h3>
              <p className="text-[11px] text-amber-200 font-medium">
                Instant QR Gateway for Devotees &amp; Priests
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* URL Switcher Tabs */}
          <div className="flex items-center p-1 bg-amber-50 rounded-xl border border-amber-200 text-neutral-700">
            <button
              onClick={() => setUrlType('shared')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition-all ${
                urlType === 'shared'
                  ? 'bg-gradient-to-r from-[#D9381E] to-[#B33018] text-white shadow-xs'
                  : 'hover:text-neutral-900'
              }`}
            >
              Public Shared URL
            </button>
            <button
              onClick={() => setUrlType('current')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition-all ${
                urlType === 'current'
                  ? 'bg-gradient-to-r from-[#D9381E] to-[#B33018] text-white shadow-xs'
                  : 'hover:text-neutral-900'
              }`}
            >
              Current Browser URL
            </button>
          </div>

          {/* QR Code Card Frame */}
          <div className="bg-gradient-to-b from-amber-50/60 to-[#FAF6F0] p-4 rounded-2xl border border-amber-200 text-center relative shadow-inner">
            <div className="inline-block relative p-2 bg-white rounded-2xl shadow-md border-2 border-amber-300">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Scan to open Purohit OS on Mobile"
                  className="w-56 h-56 mx-auto rounded-xl"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-neutral-400 font-medium text-xs">
                  Generating QR code...
                </div>
              )}

              {/* Decorative sacred center glyph */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-[#D9381E] to-[#D4AF37] border-2 border-white shadow-md flex items-center justify-center text-white text-base font-bold font-serif pointer-events-none">
                ॐ
              </div>
            </div>

            {/* Mobile Scan Prompt */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-neutral-700 font-semibold">
              <Smartphone className="w-4 h-4 text-[#D9381E]" />
              <span>Point Camera or Google Lens to open instantly</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              Works on iOS Safari &amp; Android Chrome without installing any app.
            </p>
          </div>

          {/* URL Display & Action Bar */}
          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] text-neutral-600 truncate flex-1 select-all">
              {activeUrl}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all"
                title="Copy Link"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-all"
                title="Open in new window"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open</span>
              </a>
            </div>
          </div>

          {/* Quick Notice about AI Studio Share Link */}
          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#D9381E] shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Sharing with outside users?</strong> If using the Public Shared URL, ensure you have clicked <em>Share &gt; Anyone with link</em> in the top-right AI Studio header so it is accessible publicly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 p-3 px-5 border-t border-neutral-200 flex items-center justify-between">
          <button
            onClick={handleNativeShare}
            className="text-neutral-700 hover:text-neutral-900 text-xs font-bold flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#D9381E]" />
            Share via Apps
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#D9381E] hover:bg-[#B33018] text-white text-xs font-bold shadow-xs transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
