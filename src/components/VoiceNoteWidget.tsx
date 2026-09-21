import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Sparkles, Check, Globe, Volume2 } from 'lucide-react';
import { RitualBooking } from '../types';

interface VoiceNoteWidgetProps {
  onBookingCreated: (booking: RitualBooking) => void;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  onSendToChat?: (text: string) => void;
  hasGoogleChat: boolean;
}

interface LanguagePreset {
  lang: string;
  code: string;
  flag: string;
  transcript: string;
  englishMeaning: string;
}

const PRESETS: LanguagePreset[] = [
  {
    lang: 'English',
    code: 'en-IN',
    flag: '🇮🇳',
    transcript: 'Tomorrow 9:00 AM Griha Pravesh for Ramesh Sharma at Prestige Shantiniketan, 15 guests, require full Vastu Homa Kit.',
    englishMeaning: 'Standard Bengaluru Metropolitan Griha Pravesh with Vastu Homa',
  },
  {
    lang: 'Hindi',
    code: 'hi-IN',
    flag: '🕉️',
    transcript: 'कल सुबह 9:00 बजे रमेश शर्मा जी के लिए प्रतिष्ठा शांतिनिकेतन में गृह प्रवेश, 15 अतिथि, संपूर्ण वास्तु होम किट चाहिए।',
    englishMeaning: 'Hindi voice note translated & mapped into Rigvedic Griha Pravesh',
  },
  {
    lang: 'Kannada',
    code: 'kn-IN',
    flag: '🟡🔴',
    transcript: 'ನಾಳೆ ಬೆಳಗ್ಗೆ 9:00 ಗಂಟೆಗೆ ರಮೇಶ್ ಶರ್ಮಾ ಅವರಿಗೆ ಗೃಹ ಪ್ರವೇಶ, ಪ್ರೆಸ್ಟೀಜ್ ಶಾಂತಿನಿಕೇತನ, 15 ಅತಿಥಿಗಳು, ವಾಸ್ತು ಹೋಮ ಕಿಟ್ ಬೇಕು.',
    englishMeaning: 'Kannada voice note parsed with local Whitefield delivery hub allocation',
  },
  {
    lang: 'Telugu',
    code: 'te-IN',
    flag: '🪔',
    transcript: 'రేపు ఉదయం 9:00 గంటలకు రమేష్ శర్మ గారికి గృహ ప్రవేశం, ప్రెస్టీజ్ శాంతినికేతన్, 15 మంది అతిథులు, పూర్తి వాస్తు హోమం కిట్ కావాలి.',
    englishMeaning: 'Telugu voice note with Ashta Dravya & Navagraha Kit specification',
  },
  {
    lang: 'Tamil',
    code: 'ta-IN',
    flag: '📿',
    transcript: 'நாளை காலை 9:00 மணிக்கு ரமேஷ் சர்மா அவர்களுக்கு கிரகப்பிரவேசம், பிரஸ்டீஜ் சாந்திநிகேதன், 15 விருந்தினர்கள், வாஸ்து ஹோம கிட் தேவை.',
    englishMeaning: 'Tamil voice note converted into Vedic Griha Pravesh dossier',
  },
];

export const VoiceNoteWidget: React.FC<VoiceNoteWidgetProps> = ({
  onBookingCreated,
  onShowToast,
  onSendToChat,
  hasGoogleChat,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [activeTranscript, setActiveTranscript] = useState('');
  const [extractedData, setExtractedData] = useState<Partial<RitualBooking> | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleSimulateAudio = (presetIndex = selectedPresetIndex) => {
    if (isRecording || isProcessing) return;

    setSelectedPresetIndex(presetIndex);
    const chosenPreset = PRESETS[presetIndex];
    setIsRecording(true);
    setActiveTranscript('Listening to spoken vernacular audio stream...');
    setExtractedData(null);

    setTimeout(() => {
      setIsRecording(false);
      setIsProcessing(true);
      setActiveTranscript(chosenPreset.transcript);

      setTimeout(() => {
        setIsProcessing(false);

        const newParsedBooking: RitualBooking = {
          id: `bk-${Date.now().toString().slice(-4)}`,
          ritualName: 'Griha Pravesh & Maha Vastu Homa',
          clientName: 'Ramesh Sharma',
          clientPhone: '+91 98450 12849',
          gotra: 'Kashyapa Gotra',
          nakshatra: 'Shravana',
          veda: 'Rigveda (Ashvalayana Sutra)',
          address: 'Flat 1202, Tower 4, Prestige Shantiniketan',
          locality: 'Whitefield, Bengaluru',
          date: 'Tomorrow, 22 Sep 2026',
          timeSlot: '09:00 AM - 12:15 PM',
          guestCount: 15,
          dakshinaTotal: 6500,
          advancePaid: 2500,
          paymentStatus: 'advance_paid',
          samagriStatus: 'Delivered D-1',
          readiness: {
            score: 5,
            samagriVerifiedD1: true,
            muhuratConfirmed: true,
            advancePaid: true,
            venueAndDirectionsReady: true,
            homaSafetyConfirmed: true,
          },
          specialNotes: 'Prefers low-smoke camphor & organic cow dung cakes. 15 guest seating arranged near balcony.',
          samagriKitName: 'Maha Vastu & Navagraha Homa Kit (108 Herbs + Pure Cow Ghee)',
          samagriItems: [
            { id: 'sam-1', name: 'Dried Mango Firewood Sticks (Samidha)', category: 'wood', quantity: '6 kg', verified: true },
            { id: 'sam-2', name: 'Certified A2 Gir Cow Ghee (Glass Jar)', category: 'ghee', quantity: '2 kg', verified: true },
            { id: 'sam-3', name: '108 Shanti Oshadhi Ayurvedic Herbs', category: 'herb', quantity: '1 pack', verified: true },
            { id: 'sam-4', name: 'Navadhanya Grains (9 sacred grains)', category: 'grains', quantity: '1 kg', verified: true },
            { id: 'sam-5', name: 'Copper Homa Kund & Brass Spoons', category: 'vessel', quantity: '1 set', verified: true },
          ],
          createdVia: 'voice_ai',
          riderInfo: {
            name: 'Pramod Kumar (Whitefield Hub)',
            phone: '+91 98801 77652',
            currentLocation: 'Staged at Whitefield Hub - D-1 Ready',
            etaMinutes: 0,
            kitVerified: true,
          },
        };

        setExtractedData(newParsedBooking);
        onBookingCreated(newParsedBooking);

        onShowToast(
          'Voice Note Parsed Successfully! 🎙️',
          'New Griha Pravesh for Ramesh Sharma auto-scheduled & D-1 Samagri Packing List staged.',
          'success'
        );

        if (hasGoogleChat && onSendToChat) {
          onSendToChat(
            `📿 [PUROHIT OS] New Voice Booking Confirmed:\n• Ritual: Griha Pravesh & Maha Vastu Homa\n• Host: Ramesh Sharma (${newParsedBooking.gotra})\n• Time: Tomorrow 09:00 AM\n• Venue: Prestige Shantiniketan, Whitefield\n• D-1 Samagri Kit: Verified & Staged with Rider`
          );
        }
      }, 1400);
    }, 2800);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#C2341D] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Voice-to-Workflow
            </span>
            <span className="text-xs font-semibold text-stone-500 hidden sm:inline">
              Multi-Lingual Audio Parser
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 mt-1 font-display">
            Hands-Free Priest Audio Entry
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Priests speak in any Indian language. The engine extracts Gotra, Muhurat, and generates the D-1 packing list.
          </p>
        </div>

        {/* Action Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSimulateAudio(selectedPresetIndex)}
            disabled={isRecording || isProcessing}
            id="voice-simulate-btn"
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs touch-target ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : isProcessing
                ? 'bg-amber-600 text-white cursor-wait'
                : 'bg-[#C2341D] hover:bg-[#A82A16] text-white'
            }`}
          >
            {isRecording ? (
              <>
                <Mic className="w-4 h-4 animate-bounce" />
                <span>Recording ({recordingSeconds}s)...</span>
              </>
            ) : isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Parsing Vedic Entities...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Simulate Voice Entry</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Language Presets Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-semibold text-stone-500 flex items-center gap-1 shrink-0">
          <Globe className="w-3.5 h-3.5 text-stone-600" />
          Language:
        </span>
        {PRESETS.map((preset, idx) => (
          <button
            key={preset.lang}
            onClick={() => handleSimulateAudio(idx)}
            disabled={isRecording || isProcessing}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 touch-target ${
              selectedPresetIndex === idx
                ? 'bg-stone-900 text-white font-bold shadow-2xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <span>{preset.flag}</span>
            <span>{preset.lang}</span>
          </button>
        ))}
      </div>

      {/* Audio Waveform State */}
      <div className="bg-stone-900 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-stone-300 text-[11px]">
              {isRecording
                ? 'LISTENING: 48 kHz Audio Stream...'
                : isProcessing
                ? 'EXTRACTING MUHURAT, GOTRA & D-1 SAMAGRI...'
                : 'Awaiting Voice Note Simulation'}
            </span>
          </div>
          <span className="font-mono text-stone-400 text-xs">
            {isRecording ? `00:0${recordingSeconds}` : '00:04'}
          </span>
        </div>

        {/* Dynamic Animated Waveform Bars */}
        <div className="h-12 flex items-center justify-center gap-1 sm:gap-1.5 px-2 bg-stone-950 rounded-lg overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => {
            const baseH = isRecording
              ? Math.max(12, Math.sin((i + recordingSeconds * 4) * 0.7) * 45 + 50)
              : isProcessing
              ? 16 + (i % 6) * 7
              : 8 + ((i * 7) % 24);

            return (
              <div
                key={i}
                style={{ height: `${baseH}%` }}
                className={`w-1.5 sm:w-2 rounded-full transition-all duration-150 ${
                  isRecording
                    ? 'bg-amber-400'
                    : isProcessing
                    ? 'bg-indigo-400 animate-pulse'
                    : 'bg-stone-700'
                }`}
              />
            );
          })}
        </div>

        {/* Spoken Text Display */}
        <div className="mt-3 bg-stone-950 p-2.5 rounded-lg border border-stone-800">
          <p className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
            Spoken Transcript:
          </p>
          <p className="text-xs font-medium text-amber-200 mt-0.5 italic">
            "{activeTranscript || PRESETS[selectedPresetIndex].transcript}"
          </p>
        </div>
      </div>

      {/* Real-time Parsed Entities Output */}
      {extractedData && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-emerald-200">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              AI Structured Schema Generated &amp; Auto-Committed
            </span>
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Confidence: 99.4%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
              <span className="text-stone-500 font-medium block text-[11px]">Ritual &amp; Veda</span>
              <span className="font-bold text-stone-900 text-xs block">{extractedData.ritualName}</span>
              <span className="text-[11px] text-stone-600 block">{extractedData.veda}</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
              <span className="text-stone-500 font-medium block text-[11px]">Host</span>
              <span className="font-bold text-stone-900 text-xs block">{extractedData.clientName}</span>
              <span className="text-[11px] text-stone-600 block">
                {extractedData.gotra} • 15 Guests
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
              <span className="text-stone-500 font-medium block text-[11px]">Muhurat &amp; Slot</span>
              <span className="font-bold text-stone-900 text-xs block">{extractedData.timeSlot}</span>
              <span className="text-[11px] text-emerald-800 font-semibold block">{extractedData.date}</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
              <span className="text-stone-500 font-medium block text-[11px]">D-1 Logistics Kit</span>
              <span className="font-bold text-stone-900 text-xs block">Vastu Homa Kit</span>
              <span className="text-[11px] text-stone-600 block">Hub: Whitefield (5/5 Items)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
