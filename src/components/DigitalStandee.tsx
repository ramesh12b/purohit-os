import React, { useState } from 'react';
import {
  QrCode,
  Volume2,
  CheckCircle2,
  Printer,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Send,
  Download,
  Share2,
  Phone,
} from 'lucide-react';

interface DigitalStandeeProps {
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  onSendToChat?: (text: string) => void;
  hasGoogleChat: boolean;
}

export const DigitalStandee: React.FC<DigitalStandeeProps> = ({
  onShowToast,
  onSendToChat,
  hasGoogleChat,
}) => {
  const [lastPayment, setLastPayment] = useState<{
    amount: number;
    devoteeName: string;
    gotra: string;
    txnId: string;
    time: string;
  } | null>(null);

  const [isPlayingSoundbox, setIsPlayingSoundbox] = useState(false);
  const [standeeStyle, setStandeeStyle] = useState<'brass' | 'acrylic'>('brass');

  const simulatePayment = (amount: number, devotee = 'Ramesh Sharma', gotra = 'Kashyapa Gotra') => {
    const txn = `UPI/2026/09/${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    setIsPlayingSoundbox(true);
    setLastPayment({
      amount,
      devoteeName: devotee,
      gotra,
      txnId: txn,
      time: now,
    });

    // Simulate Soundbox voice alert using browser Web Speech API if available
    try {
      if ('speechSynthesis' in window) {
        const text = `Received ${amount} Rupees Dakshina on Phone Pe. Shubh Labh.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis not available or blocked in iframe:', e);
    }

    setTimeout(() => {
      setIsPlayingSoundbox(false);
    }, 3000);

    onShowToast(
      'Payment Received! 🔔',
      `₹${amount.toLocaleString('en-IN')} Dakshina credited directly from ${devotee}. Zero MDR deduction.`,
      'success'
    );

    if (hasGoogleChat && onSendToChat) {
      onSendToChat(
        `💰 [PUROHIT DAKSHINA RECEIVED]\n• Amount: ₹${amount.toLocaleString('en-IN')}\n• Devotee: ${devotee} (${gotra})\n• Transaction ID: ${txn}\n• Time: ${now}\n• Status: 100% Direct Bank Settlement`
      );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Module Title */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#C2341D] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Counter Hardware
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                Digital Standee &amp; Soundbox UPI Reconciliation
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Printable temple altar QR standee. Instant zero-fee UPI Dakshina reconciliation with multi-lingual audio confirmation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              id="print-standee-btn"
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all touch-target"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>Print Standee</span>
            </button>
          </div>
        </div>

        {/* Style switchers */}
        <div className="flex items-center gap-2 text-xs font-medium text-stone-600 flex-wrap">
          <span className="font-semibold text-stone-800">Standee Finish:</span>
          <button
            onClick={() => setStandeeStyle('brass')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all touch-target ${
              standeeStyle === 'brass'
                ? 'bg-amber-100 border-amber-300 text-amber-950 shadow-2xs'
                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            🔱 Sacred Gold &amp; Temple Brass
          </button>
          <button
            onClick={() => setStandeeStyle('acrylic')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all touch-target ${
              standeeStyle === 'acrylic'
                ? 'bg-stone-200 border-stone-400 text-stone-900 shadow-2xs'
                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            🪞 Minimalist Acrylic White
          </button>
        </div>
      </div>

      {/* Main Grid: Standee Preview + Soundbox Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Realistic Physical Standee Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            className={`w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl relative transition-all ${
              standeeStyle === 'brass'
                ? 'bg-gradient-to-b from-[#251814] via-[#2F1F1A] to-[#1A110D] border-4 border-[#D4AF37] text-white'
                : 'bg-white border-4 border-stone-300 text-stone-900'
            }`}
          >
            {/* Top Standee Header */}
            <div className="text-center pb-4 border-b border-amber-400/30">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#C2341D] to-[#D4AF37] flex items-center justify-center text-2xl shadow-md border-2 border-amber-300">
                🕉️
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight mt-2 font-display text-amber-200">
                VEDA BRAHMA PUROHIT PARISHAD
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-amber-300/80 font-bold">
                Direct Dakshina &amp; Sankalpa Gateway
              </p>
            </div>

            {/* Priest Profile Box */}
            <div className="mt-4 text-center">
              <div className="inline-block relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400 mx-auto overflow-hidden bg-amber-950/40 flex items-center justify-center text-3xl shadow-inner">
                  📿
                </div>
                <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                  VERIFIED
                </span>
              </div>
              <h4 className="text-base font-bold mt-2 font-display">
                Pt. Venkatesha Shastri Dixit
              </h4>
              <p className="text-xs text-amber-300 font-medium">
                Rigveda Sakala Shakha • 24 Years Experience
              </p>
              <p className="text-[11px] text-stone-400">
                Bengaluru East • Whitefield &amp; Indiranagar Chapter
              </p>
            </div>

            {/* QR Code Container with Saffron Corners */}
            <div className="mt-5 bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-md text-center relative max-w-[240px] mx-auto">
              <div className="bg-stone-50 p-2 rounded-xl border border-stone-200">
                <svg
                  className="w-full h-auto aspect-square mx-auto"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <rect x="0" y="0" width="30" height="30" fill="#1A1A1A" rx="3" />
                  <rect x="4" y="4" width="22" height="22" fill="#FFFFFF" rx="2" />
                  <rect x="8" y="8" width="14" height="14" fill="#C2341D" rx="2" />

                  <rect x="70" y="0" width="30" height="30" fill="#1A1A1A" rx="3" />
                  <rect x="74" y="4" width="22" height="22" fill="#FFFFFF" rx="2" />
                  <rect x="78" y="8" width="14" height="14" fill="#C2341D" rx="2" />

                  <rect x="0" y="70" width="30" height="30" fill="#1A1A1A" rx="3" />
                  <rect x="4" y="74" width="22" height="22" fill="#FFFFFF" rx="2" />
                  <rect x="8" y="78" width="14" height="14" fill="#C2341D" rx="2" />

                  <rect x="36" y="36" width="28" height="28" fill="#D4AF37" rx="4" />
                  <text
                    x="50"
                    y="55"
                    fontSize="18"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontFamily="serif"
                    fontWeight="bold"
                  >
                    ॐ
                  </text>

                  <circle cx="40" cy="15" r="2.5" fill="#1A1A1A" />
                  <circle cx="50" cy="15" r="2.5" fill="#1A1A1A" />
                  <circle cx="60" cy="15" r="2.5" fill="#1A1A1A" />
                  <circle cx="40" cy="25" r="2.5" fill="#1A1A1A" />
                  <circle cx="55" cy="25" r="2.5" fill="#1A1A1A" />
                  <circle cx="15" cy="45" r="2.5" fill="#1A1A1A" />
                  <circle cx="25" cy="45" r="2.5" fill="#1A1A1A" />
                  <circle cx="15" cy="55" r="2.5" fill="#1A1A1A" />
                  <circle cx="75" cy="45" r="2.5" fill="#1A1A1A" />
                  <circle cx="85" cy="55" r="2.5" fill="#1A1A1A" />
                  <circle cx="40" cy="75" r="2.5" fill="#1A1A1A" />
                  <circle cx="50" cy="85" r="2.5" fill="#1A1A1A" />
                  <circle cx="60" cy="75" r="2.5" fill="#1A1A1A" />
                  <circle cx="75" cy="85" r="2.5" fill="#1A1A1A" />
                  <circle cx="85" cy="75" r="2.5" fill="#1A1A1A" />
                </svg>
              </div>

              <div className="mt-2 text-stone-800">
                <span className="font-mono text-[10px] font-bold block bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  UPI ID: purohit.venkatesh@icici
                </span>
                <span className="text-[9px] text-stone-500 font-semibold block mt-0.5">
                  Scan with GPay, PhonePe, Paytm, BHIM
                </span>
              </div>
            </div>

            {/* Standee Footer */}
            <div className="mt-5 pt-3 border-t border-amber-400/30 text-center text-xs text-amber-200/80">
              <p className="font-display italic">"Dharmo Rakshati Rakshitah"</p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                Zero-Fee Direct Bank Settlement • Instant WhatsApp Receipt
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Soundbox Simulator & Receipt Generator */}
        <div className="lg:col-span-5 space-y-4">
          {/* Soundbox Simulator Device */}
          <div className="bg-stone-900 rounded-2xl border-2 border-stone-700 p-5 text-white shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Purohit Soundbox 4G</h4>
                  <p className="text-[10px] text-stone-400">Vedic Voice Confirmation Alert</p>
                </div>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isPlayingSoundbox ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'
                }`}
              />
            </div>

            {/* Speaker Visual */}
            <div className="my-4 bg-stone-950 rounded-xl p-3.5 border border-stone-800 flex flex-col items-center justify-center">
              <div className="grid grid-cols-8 gap-1.5 my-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      isPlayingSoundbox ? 'bg-amber-400 animate-pulse' : 'bg-stone-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] font-mono text-amber-300 mt-2 text-center">
                {isPlayingSoundbox
                  ? '🔊 "₹5,500 Dakshina Received on PhonePe!"'
                  : 'READY: Awaiting UPI Inward Push'}
              </p>
            </div>

            {/* Test Payment Action Buttons */}
            <div>
              <p className="text-xs text-stone-300 font-bold mb-2">
                Simulate Devotee Paying at Counter / Home:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => simulatePayment(1100, 'Suresh K.', 'Gargya Gotra')}
                  className="bg-stone-800 hover:bg-stone-700 py-2.5 rounded-xl text-xs font-bold text-amber-300 border border-stone-700 transition-all touch-target"
                >
                  + ₹1,100
                </button>
                <button
                  onClick={() => simulatePayment(3000, 'M. Srinivasulu', 'Gautama Gotra')}
                  className="bg-stone-800 hover:bg-stone-700 py-2.5 rounded-xl text-xs font-bold text-amber-300 border border-stone-700 transition-all touch-target"
                >
                  + ₹3,000
                </button>
                <button
                  onClick={() => simulatePayment(5500, 'Ramesh Sharma', 'Kashyapa Gotra')}
                  className="bg-[#C2341D] hover:bg-[#A82A16] py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all touch-target"
                >
                  + ₹5,500
                </button>
              </div>
            </div>
          </div>

          {/* Instant Auto-Generated WhatsApp / Digital Receipt */}
          {lastPayment && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 shadow-xs animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Instant WhatsApp Receipt Dispatched
                </span>
                <span className="text-[10px] font-mono text-emerald-800 font-bold">
                  {lastPayment.time}
                </span>
              </div>

              <div className="mt-2 text-xs space-y-1 text-stone-800">
                <p>
                  <strong>Yajamana:</strong> {lastPayment.devoteeName} ({lastPayment.gotra})
                </p>
                <p>
                  <strong>Dakshina:</strong> ₹{lastPayment.amount.toLocaleString('en-IN')} (Confirmed)
                </p>
                <p className="font-mono text-[10px] text-stone-500">
                  Txn Ref: {lastPayment.txnId}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-emerald-200 flex items-center justify-between">
                <span className="text-[10px] text-emerald-800 font-semibold">
                  Zero Commission Deducted (100% Priest Bank Deposit)
                </span>
                <button
                  onClick={() => {
                    onShowToast('WhatsApp Receipt Sent', `Receipt with Vedic blessing forwarded to ${lastPayment.devoteeName}.`, 'info');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 shadow-2xs touch-target"
                >
                  <Send className="w-3 h-3" />
                  <span>Forward</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
