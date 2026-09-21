import React, { useState } from 'react';
import { RitualBooking } from '../types';
import { PANCHANG_INFO } from '../data/mockData';
import {
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Package,
  CreditCard,
  User,
  MapPin,
  Flame,
  Phone,
  MessageSquare,
  BookOpen,
  ArrowRight,
  Heart,
  CheckSquare,
  Square,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Sun,
  Award,
  AlertCircle,
  Volume2,
  Filter,
} from 'lucide-react';

interface FamilyPortalProps {
  activeBookings: RitualBooking[];
  onBookCeremony: (newBooking: RitualBooking) => void;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  onOpenPaymentModal: (booking: RitualBooking) => void;
  onOpenWhatsAppModal?: (clientName: string, phone: string, occasion: string, customText?: string) => void;
}

const CEREMONY_CATALOG = [
  {
    id: 'griha-pravesh',
    name: 'Griha Pravesh & Vastu Shanti Homa',
    duration: '3.5 Hours',
    baseDakshina: 6500,
    samagriCost: 1800,
    platformFee: 500,
    tag: 'Auspicious Milestone',
    imageEmoji: '🏡',
    description: 'Purification and consecration for a new home, harmonizing directional energies and seeking Lakshmi’s blessings.',
    recommendedMuhurat: 'Brahma Muhurat or Abhijit (09:15 AM - 12:45 PM)',
  },
  {
    id: 'satyanarayana',
    name: 'Sri Satyanarayana Swamy Vrata',
    duration: '2.5 Hours',
    baseDakshina: 4500,
    samagriCost: 1200,
    platformFee: 350,
    tag: 'Family Harmony',
    imageEmoji: '🪔',
    description: 'Thanksgiving recitation of the divine five chapters with panchamrita abhisheka and maha prasada distribution.',
    recommendedMuhurat: 'Purnima / Ekadashi or Auspicious Afternoon',
  },
  {
    id: 'ganapati-navagraha',
    name: 'Maha Ganapati & Navagraha Homa',
    duration: '2.5 Hours',
    baseDakshina: 4800,
    samagriCost: 1400,
    platformFee: 400,
    tag: 'Obstacle Removal',
    imageEmoji: '🐘',
    description: 'Invoking Vighneshwara and pacifying nine planetary spheres with sacred herbal offerings and Modaka homa.',
    recommendedMuhurat: 'Chaturthi / Amrit Siddhi Yoga (Morning)',
  },
  {
    id: 'ayushya-nakshatra',
    name: 'Ayushya & Janma Nakshatra Homa',
    duration: '2.0 Hours',
    baseDakshina: 4200,
    samagriCost: 1100,
    platformFee: 300,
    tag: 'Birthday & Longevity',
    imageEmoji: '🌟',
    description: 'Vedic birthday blessing invoking Markandeya and the Chiranjivis for robust health and mental clarity.',
    recommendedMuhurat: 'Janma Nakshatra Day',
  },
];

const DEFAULT_FAMILY_PREP_ITEMS = [
  { id: 'p1', title: '5 Fresh Coconuts with Water', category: 'Fresh Items', done: true, tip: 'Keep unpeeled with tuft for Kalasha and breaking.' },
  { id: 'p2', title: 'Fresh Mango Leaves (2 bunches)', category: 'Fresh Items', done: true, tip: 'For entrance Toran and Kalasha installation.' },
  { id: 'p3', title: 'Betel Leaves (Paan) & Supari (25 sets)', category: 'Fresh Items', done: false, tip: 'Clean fresh green leaves for Tambula and deities.' },
  { id: 'p4', title: 'Fresh Cow Milk (500 ml unboiled)', category: 'Panchamrita', done: false, tip: 'Used for milk boiling ceremony and Naivedya.' },
  { id: 'p5', title: 'Raw White Rice (Akshata) — 2 kg', category: 'Household Staples', done: true, tip: 'Clean dry grains to be mixed with turmeric.' },
  { id: 'p6', title: 'Turmeric & Kumkum (100g each)', category: 'Panchamrita', done: true, tip: 'For Rangoli, Swastik drawing, and Tilak.' },
  { id: 'p7', title: 'Clean White / Yellow Cloth (1 meter)', category: 'Altar Setup', done: false, tip: 'To spread on the wooden Peetha (stool) for deities.' },
  { id: 'p8', title: 'Traditional Brass / Silver Oil Lamps (2)', category: 'Altar Setup', done: false, tip: 'Filled with pure sesame oil or cow ghee with cotton wicks.' },
  { id: 'p9', title: 'Flowers & Garlands (2 strands + loose petals)', category: 'Fresh Items', done: false, tip: 'Marigold, Jasmine, and Rose for murti shringara.' },
];

const RITUAL_PHASE_EXPLANATIONS = [
  {
    phase: '1. Dhyana & Deepa Prajvalana',
    duration: '15 mins',
    meaning: 'Kindling of the Sacred Flame',
    explanation: 'The priest invokes the Primordial Light. The lamp represents the inner consciousness dispelling darkness from the residence.',
    familyRole: 'The host couple lits the twin oil lamps facing East while chanting Shubham Karoti.',
  },
  {
    phase: '2. Mahapuja Sankalpa',
    duration: '20 mins',
    meaning: 'The Sacred Cosmic Oath',
    explanation: 'The exact astronomical coordinates (Time, Gotra, Nakshatra, Geography) are spoken to align your family vow with cosmic order.',
    familyRole: 'Hold water, akshata, and coin in your right palm, listening to your Gotra and family names being sanctified.',
  },
  {
    phase: '3. Punyahavachanam & Kalasha Sthapana',
    duration: '25 mins',
    meaning: 'Sanctification of Space & Waters',
    explanation: 'The holy rivers (Ganga, Yamuna, Godavari) are invited into the copper Kalasha, transforming the hall into a sacred temple.',
    familyRole: 'Sprinkle consecrated holy water around each room of the house.',
  },
  {
    phase: '4. Agni Mukha & Homa Oblations',
    duration: '45 mins',
    meaning: 'Communion with the Fire of Transformation',
    explanation: 'Agni is honored as the divine messenger carrying pure A2 cow ghee and herbal oblations directly to cosmic powers.',
    familyRole: 'Sit attentively before the Homa Kund; offer Samidha sticks when the priest chants Svaha.',
  },
  {
    phase: '5. Purnahuti & Maha Mangalarati',
    duration: '25 mins',
    meaning: 'Ultimate Offering & Circle of Light',
    explanation: 'The sacred silk cloth containing dry coconut and auspicious gems is offered into the flame, symbolizing total fulfillment.',
    familyRole: 'Stand together with hands folded, receive the warm light of Aarti upon your palms and crown.',
  },
  {
    phase: '6. Ashirvada & Teertha Prasada',
    duration: '20 mins',
    meaning: 'Elder Vedic Blessings',
    explanation: 'Chanting of Vedic benedictions (Svasti Suktam) granting health, prosperity, progeny, and long lifespan.',
    familyRole: 'Touch the sacred feet of the Acharya and distribute Prasada to all assembled family and friends.',
  },
];

export const FamilyPortal: React.FC<FamilyPortalProps> = ({
  activeBookings,
  onBookCeremony,
  onShowToast,
  onOpenPaymentModal,
  onOpenWhatsAppModal,
}) => {
  const [activeTab, setActiveTab] = useState<'my_ceremonies' | 'book_ceremony' | 'family_prep' | 'mantra_guide'>('my_ceremonies');
  const [prepItems, setPrepItems] = useState(DEFAULT_FAMILY_PREP_ITEMS);
  const [prepFilter, setPrepFilter] = useState<'all' | 'Fresh Items' | 'Panchamrita' | 'Altar Setup' | 'Household Staples'>('all');

  // Booking Form State
  const [selectedRitual, setSelectedRitual] = useState(CEREMONY_CATALOG[0]);
  const [hostName, setHostName] = useState('Anand & Radhika Narayan');
  const [phone, setPhone] = useState('+91 98804 11293');
  const [gotra, setGotra] = useState('Kashyapa Gotra');
  const [nakshatra, setNakshatra] = useState('Rohini (Vrishabha)');
  const [kulaDevata, setKulaDevata] = useState('Sri Venkateshwara / Tirumala');
  const [languagePreference, setLanguagePreference] = useState('Kannada & Sanskrit');
  const [address, setAddress] = useState('Tower 4, Apt 802, Sobha Dream Acres, Outer Ring Road');
  const [locality, setLocality] = useState('Panathur, Bengaluru');
  const [selectedDate, setSelectedDate] = useState('Sunday, 27 Sep 2026');
  const [guestCount, setGuestCount] = useState(20);
  const [kitTier, setKitTier] = useState<'pure_a2' | 'standard'>('pure_a2');

  const totalCost = selectedRitual.baseDakshina + selectedRitual.samagriCost + selectedRitual.platformFee + (kitTier === 'pure_a2' ? 600 : 0);

  const togglePrepItem = (id: string) => {
    setPrepItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const playChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
      onShowToast('Auspicious Bell Resonating 🔔', 'Invoking holy presence for ritual step meditation.', 'info');
    } catch {
      // ignore
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: RitualBooking = {
      id: `fam-${Date.now().toString().slice(-4)}`,
      ritualName: selectedRitual.name,
      clientName: hostName,
      clientPhone: phone,
      gotra: gotra,
      nakshatra: nakshatra,
      veda: 'Krishna Yajurveda (Taittiriya)',
      address: address,
      locality: locality,
      date: selectedDate,
      timeSlot: '09:15 AM - 12:45 PM (Auspicious Muhurat)',
      guestCount: guestCount,
      dakshinaTotal: totalCost,
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
      specialNotes: `Language: ${languagePreference}. Kula Devata: ${kulaDevata}. Kit Tier: ${kitTier === 'pure_a2' ? 'Certified Gir Cow A2 Ghee' : 'Standard'}.`,
      samagriKitName: `${selectedRitual.name} 108 Sacred Herb Kit`,
      samagriItems: [
        { id: 'f-1', name: 'Certified A2 Gir Cow Ghee', category: 'ghee', quantity: '2 kg', verified: true },
        { id: 'f-2', name: 'Dry Wild Mango Samidha Wood', category: 'wood', quantity: '5 kg', verified: true },
        { id: 'f-3', name: 'Navadhanya 9 Sacred Grains', category: 'grains', quantity: '1 set', verified: true },
        { id: 'f-4', name: 'Pure Bhimseni Low-Smoke Camphor', category: 'herb', quantity: '1 box', verified: true },
      ],
      createdVia: 'family_app',
      riderInfo: {
        name: 'Raju Gowda (Dedicated Logistics Rider)',
        phone: '+91 99012 34102',
        currentLocation: 'Staged at Regional Hub — D-1 evening delivery scheduled',
        etaMinutes: 0,
        kitVerified: true,
      },
    };

    onBookCeremony(newBooking);
    setActiveTab('my_ceremonies');
    onShowToast(
      'Ceremony Scheduled Auspiciously! 🪔',
      `Your ${selectedRitual.name} is confirmed. Assigned Pandit will contact you for Sankalpa pre-alignment.`,
      'success'
    );
  };

  const completedPrepCount = prepItems.filter((i) => i.done).length;
  const filteredPrepItems = prepItems.filter((i) => {
    if (prepFilter === 'all') return true;
    return i.category === prepFilter;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Devotee Serenity Header */}
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F0] to-[#F5EFE6] border border-stone-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#C2341D]/10 text-[#C2341D] px-2.5 py-0.5 rounded-full text-xs font-bold border border-[#C2341D]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Devotee &amp; Family Ritual Sanctuary</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display tracking-tight">
            Sacred Ceremonies with Peace of Mind
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Conducted by verified Vedic scholars with certified D-1 Samagri Kits delivered the evening prior.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-stone-700">
            <span className="flex items-center gap-1 text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Certified Vedic Lineage
            </span>
            <span className="flex items-center gap-1 text-amber-900 font-semibold">
              <Package className="w-3.5 h-3.5 text-amber-700" />
              D-1 Evening Delivery
            </span>
            <span className="flex items-center gap-1 text-[#C2341D] font-semibold">
              <CreditCard className="w-3.5 h-3.5 text-[#C2341D]" />
              Direct Zero-MDR Dakshina
            </span>
          </div>
        </div>

        {/* Sub-Navigation Pill Bar */}
        <div className="mt-5 pt-4 border-t border-stone-200/80 flex flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('my_ceremonies')}
            id="family-tab-my-ceremonies"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all touch-target ${
              activeTab === 'my_ceremonies'
                ? 'bg-[#C2341D] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>🪔</span>
            <span>My Ceremonies</span>
            {activeBookings.length > 0 && (
              <span className="bg-white/25 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {activeBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('book_ceremony')}
            id="family-tab-book-ceremony"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all touch-target ${
              activeTab === 'book_ceremony'
                ? 'bg-[#C2341D] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>✨</span>
            <span>Book Ceremony</span>
          </button>

          <button
            onClick={() => setActiveTab('family_prep')}
            id="family-tab-prep"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all touch-target ${
              activeTab === 'family_prep'
                ? 'bg-[#C2341D] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>📋</span>
            <span>Prep Checklist</span>
            <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {completedPrepCount}/{prepItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('mantra_guide')}
            id="family-tab-mantra-guide"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all touch-target ${
              activeTab === 'mantra_guide'
                ? 'bg-[#C2341D] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>📜</span>
            <span>Ritual Meaning</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY ACTIVE CEREMONIES */}
      {activeTab === 'my_ceremonies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C2341D]" />
              Scheduled Family Ceremonies
            </h3>
            <button
              onClick={() => setActiveTab('book_ceremony')}
              className="text-xs font-bold text-[#C2341D] hover:underline flex items-center gap-1 touch-target"
            >
              <span>+ Schedule another</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto text-xl">
                🪔
              </div>
              <h4 className="font-bold text-stone-800">No active ceremonies currently scheduled</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Schedule your Griha Pravesh, Satyanarayana Vrata, or Birthday Homa with verified scholars.
              </p>
              <button
                onClick={() => setActiveTab('book_ceremony')}
                className="px-5 py-2.5 bg-[#C2341D] hover:bg-[#A82A16] text-white rounded-xl text-xs font-bold shadow-xs touch-target"
              >
                Schedule Ceremony Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-200">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-amber-100 text-[#8B1E0F] font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                          CONFIRMED #{booking.id.toUpperCase()}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Scholar Assigned
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-stone-950 font-display">
                        {booking.ritualName}
                      </h4>
                      <p className="text-xs text-stone-600 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>Host: <strong>{booking.clientName}</strong></span>
                        <span>•</span>
                        <span>{booking.gotra}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-stone-500">
                          <MapPin className="w-3 h-3 text-[#C2341D]" />
                          {booking.locality}
                        </span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl inline-block">
                        <span className="text-xs font-mono font-bold text-[#C2341D] block">
                          {booking.date}
                        </span>
                        <span className="text-[11px] text-stone-600 font-medium">
                          {booking.timeSlot}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-stone-600">
                        Total Dakshina: <strong className="text-stone-900 font-mono">₹{booking.dakshinaTotal}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Devotee Step Tracker (D-1 to Blessings) */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>1. Vedic Scholar</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        Pt. Vidyadhar Shastri (Rigveda Sakala, 14 yrs).
                      </p>
                      <button
                        onClick={() => {
                          if (onOpenWhatsAppModal) {
                            onOpenWhatsAppModal(booking.clientName, booking.clientPhone, booking.ritualName);
                          } else {
                            onShowToast('WhatsApp Concierge', `Connecting you with Pandit Vidyadhar Shastri for ${booking.ritualName}.`, 'info');
                          }
                        }}
                        className="mt-2 text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-1 touch-target"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Message Priest</span>
                      </button>
                    </div>

                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Package className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>2. Samagri Kit (D-1)</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        {booking.samagriStatus}. All 108 herbs packed.
                      </p>
                      <span className="mt-2 inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        ✓ Inspected &amp; Sealed
                      </span>
                    </div>

                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                        <Clock className="w-4 h-4 text-stone-600 shrink-0" />
                        <span>3. Shubh Muhurat</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        Calculated by Panchang: Abhijit window confirmed.
                      </p>
                      <span className="mt-2 inline-block text-[10px] font-mono text-amber-800">
                        Rohini Nakshatra Aligned
                      </span>
                    </div>

                    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                        <CreditCard className="w-4 h-4 text-stone-600 shrink-0" />
                        <span>4. Dakshina Settlement</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        Advance: ₹{booking.advancePaid} • Due: ₹{booking.dakshinaTotal - booking.advancePaid}
                      </p>
                      <button
                        onClick={() => onOpenPaymentModal(booking)}
                        className="mt-2 text-[10px] font-bold text-[#C2341D] hover:underline flex items-center gap-1 touch-target"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>Pay via UPI Soundbox</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Action Navigation */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-stone-600">
                    <button
                      onClick={() => setActiveTab('family_prep')}
                      className="text-[#C2341D] font-bold hover:underline flex items-center gap-1 touch-target"
                    >
                      <span>Check items you must keep ready at home →</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('mantra_guide')}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 touch-target"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Follow Along Live</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCHEDULE NEW RITUAL WIZARD */}
      {activeTab === 'book_ceremony' && (
        <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-6">
          {/* Step 1: Select Ritual Category */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-3">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C2341D] text-white text-xs flex items-center justify-center font-bold">1</span>
              Choose the Sacred Ceremony
            </h3>
            <p className="text-xs text-stone-600">
              Each package includes a certified Vedic scholar, authentic D-1 herbs, and full Muhurat verification.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {CEREMONY_CATALOG.map((ritual) => {
                const isSelected = selectedRitual.id === ritual.id;
                const rTotal = ritual.baseDakshina + ritual.samagriCost + ritual.platformFee;
                return (
                  <div
                    key={ritual.id}
                    onClick={() => setSelectedRitual(ritual)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C2341D] bg-[#FFFBF7] shadow-2xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{ritual.imageEmoji}</span>
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#C2341D] bg-amber-50 px-2 py-0.5 rounded">
                            {ritual.tag}
                          </span>
                          <h4 className="font-bold text-stone-900 text-sm mt-1">{ritual.name}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-stone-900">₹{rTotal}</span>
                        <span className="text-[10px] text-stone-500 block">All inclusive</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {ritual.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 mt-3 pt-2 border-t border-stone-100">
                      <span>Duration: <strong>{ritual.duration}</strong></span>
                      <span className="text-amber-900 font-medium">Muhurat: {ritual.recommendedMuhurat}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Lineage & Sankalpa Information */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C2341D] text-white text-xs flex items-center justify-center font-bold">2</span>
              Sacred Sankalpa &amp; Lineage Information
            </h3>
            <p className="text-xs text-stone-600">
              The priest will invoke these details during the Mahapuja Sankalpa to align the blessings with your family tree.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Host / Yajamana Name(s)</label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C2341D] focus:outline-hidden"
                  placeholder="e.g. Anand & Radhika Narayan"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Contact Phone (WhatsApp)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C2341D] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Family Gotra</label>
                <input
                  type="text"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C2341D] focus:outline-hidden"
                  placeholder="e.g. Kashyapa, Bharadwaja"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Janma Nakshatra</label>
                <input
                  type="text"
                  value={nakshatra}
                  onChange={(e) => setNakshatra(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C2341D] focus:outline-hidden"
                  placeholder="e.g. Rohini, Ashwini"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Kula Devata (Optional)</label>
                <input
                  type="text"
                  value={kulaDevata}
                  onChange={(e) => setKulaDevata(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C2341D] focus:outline-hidden"
                  placeholder="e.g. Sri Venkateshwara"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Language Preference</label>
                <select
                  value={languagePreference}
                  onChange={(e) => setLanguagePreference(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C2341D] focus:outline-hidden bg-white"
                >
                  <option>Kannada &amp; Sanskrit</option>
                  <option>Telugu &amp; Sanskrit</option>
                  <option>Tamil &amp; Sanskrit</option>
                  <option>Hindi &amp; Sanskrit</option>
                  <option>English &amp; Sanskrit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Venue, Date & Quality Tier */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C2341D] text-white text-xs flex items-center justify-center font-bold">3</span>
              Date, Venue &amp; Pure Ingredient Tier
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Ceremony Date (Panchang Aligned)</label>
                <input
                  type="text"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C2341D] focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Expected Guests Count</label>
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C2341D] focus:outline-hidden"
                  min="2"
                  max="500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Venue Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#C2341D] focus:outline-hidden"
                  required
                />
              </div>
            </div>

            {/* Samagri Tier Selection */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-700 mb-2">Samagri &amp; Ghee Grade Selection</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setKitTier('pure_a2')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    kitTier === 'pure_a2'
                      ? 'border-[#C2341D] bg-[#FFFBF7] ring-1 ring-[#C2341D]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#C2341D]" />
                      Organic A2 Gir Cow Ghee (+₹600)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Bilona churned pure Desi cow ghee producing fragrant smoke and positive pranic resonance.
                  </p>
                </div>

                <div
                  onClick={() => setKitTier('standard')}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    kitTier === 'standard'
                      ? 'border-[#C2341D] bg-[#FFFBF7] ring-1 ring-[#C2341D]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">Standard Pure Cow Ghee Kit</span>
                    <span className="text-[10px] text-stone-500 font-medium">Standard</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Lab-tested pure cow ghee conforming to Agmark standards, packed in leak-proof food containers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Summary */}
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
            <h4 className="font-bold text-stone-900 text-sm font-display flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C2341D]" />
              Transparent Pricing &amp; Dakshina Breakdown
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Priest Honorarium (80% Direct to Acharya):</span>
                <span className="font-mono font-semibold text-stone-900">₹{selectedRitual.baseDakshina}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>108 Sacred Herbs &amp; Ghee (Delivered D-1):</span>
                <span className="font-mono font-semibold text-stone-900">
                  ₹{selectedRitual.samagriCost + (kitTier === 'pure_a2' ? 600 : 0)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Platform Assurance &amp; D-1 Guarantee:</span>
                <span className="font-mono font-semibold text-stone-900">₹{selectedRitual.platformFee}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-950">
                <span>Total Sacred Package:</span>
                <span className="font-mono text-base text-[#C2341D]">₹{totalCost}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-stone-500">
                Advance of ₹2,500 locks scholar schedule. Remaining balance paid upon completion via UPI Soundbox.
              </p>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C2341D] hover:bg-[#A82A16] text-white font-bold text-xs shadow-sm touch-target"
              >
                Confirm &amp; Lock Muhurat Window →
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: FAMILY D-1 PREPARATION CHECKLIST */}
      {activeTab === 'family_prep' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#C2341D]" />
                What the Family Keeps Ready at Home
              </h3>
              <p className="text-xs text-stone-500">
                We deliver dry herbs, firewood, and ghee D-1. Here are the fresh household items you arrange.
              </p>
            </div>

            <div className="bg-stone-100 px-3 py-1 rounded-xl text-xs font-bold text-stone-800 shrink-0">
              {completedPrepCount} of {prepItems.length} items ready
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {(['all', 'Fresh Items', 'Panchamrita', 'Altar Setup', 'Household Staples'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setPrepFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors touch-target ${
                  prepFilter === cat
                    ? 'bg-[#C2341D] text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredPrepItems.map((item) => (
              <div
                key={item.id}
                onClick={() => togglePrepItem(item.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  item.done
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="mt-0.5">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${item.done ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                      {item.title}
                    </span>
                    <span className="text-[10px] font-medium bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Etiquette & Fasting Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
              <span className="font-bold text-[#C2341D] block">👔 Traditional Attire</span>
              <p className="text-stone-600 text-[11px] mt-0.5">
                Host wears Dhoti with Angavastram. Lady wears traditional Saree. Avoid black clothing.
              </p>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
              <span className="font-bold text-[#C2341D] block">🥛 Morning Routine</span>
              <p className="text-stone-600 text-[11px] mt-0.5">
                Head bath early in the morning and maintain light fruit/milk intake until Purnahuti is completed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE CEREMONY GUIDE & MANTRA MEANING */}
      {activeTab === 'mantra_guide' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#C2341D]" />
                Live Ceremony Companion &amp; Vedic Explanations
              </h3>
              <p className="text-xs text-stone-500">
                Follow along during the ritual to understand the deep symbolism of each step.
              </p>
            </div>

            <button
              onClick={playChime}
              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors touch-target"
              title="Play 528Hz Meditation Bell"
            >
              <Volume2 className="w-4 h-4 text-[#C2341D]" />
              <span className="hidden sm:inline">Bell Chime</span>
            </button>
          </div>

          <div className="space-y-3">
            {RITUAL_PHASE_EXPLANATIONS.map((phase, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-200 bg-[#FFFDF9] hover:border-amber-300 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#C2341D] bg-amber-100 px-2 py-0.5 rounded">
                      Step {idx + 1} • ~{phase.duration}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm mt-1">{phase.phase}</h4>
                    <span className="text-xs text-stone-600 italic">{phase.meaning}</span>
                  </div>
                  <span className="text-xl">🪔</span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {phase.explanation}
                </p>

                <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-200/60 text-[11px]">
                  <strong className="text-stone-900">Family Role: </strong>
                  <span className="text-stone-700">{phase.familyRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
