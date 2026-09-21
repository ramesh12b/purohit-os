import React, { useState } from 'react';
import { RitualBooking, RitualItem } from '../types';
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
} from 'lucide-react';

interface FamilyCompanionViewProps {
  activeBookings: RitualBooking[];
  onBookCeremony: (newBooking: RitualBooking) => void;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  onOpenPaymentModal: (booking: RitualBooking) => void;
}

const CEREMONY_OPTIONS = [
  {
    name: 'Griha Pravesh & Vastu Homa',
    duration: '3.5 Hours',
    dakshina: 6500,
    desc: 'House warming and consecration for family prosperity, peaceful energies, and removal of Vastu doshas.',
    badge: 'Most Popular',
  },
  {
    name: 'Sri Satyanarayana Vrata Puja',
    duration: '2.5 Hours',
    dakshina: 4500,
    desc: 'Auspicious monthly or special occasion thanksgiving prayer for wellness, harmony, and Lord Vishnu’s blessings.',
    badge: 'Devotional',
  },
  {
    name: 'Maha Ganapati & Navagraha Homa',
    duration: '2 Hours',
    dakshina: 3500,
    desc: 'Obstacle removal, new venture invocation, and planetary harmony with sacred 108 herbal oblations.',
    badge: 'Essential',
  },
  {
    name: 'Ayushya & Nakshatra Shanti Homa',
    duration: '2.5 Hours',
    dakshina: 4800,
    desc: 'Birthday ritual praying for long health, vigor, and cosmic vitality based on Janma Nakshatra.',
    badge: 'Annual Health',
  },
];

export const FamilyCompanionView: React.FC<FamilyCompanionViewProps> = ({
  activeBookings,
  onBookCeremony,
  onShowToast,
  onOpenPaymentModal,
}) => {
  const [selectedCeremony, setSelectedCeremony] = useState(CEREMONY_OPTIONS[0]);
  const [hostName, setHostName] = useState('Anand Narayan');
  const [phone, setPhone] = useState('+91 98804 11293');
  const [gotra, setGotra] = useState('Harita Gotra');
  const [nakshatra, setNakshatra] = useState('Rohini (Taurus Rashi)');
  const [address, setAddress] = useState('Flat 804, Sobha Dream Acres, Panathur Road');
  const [locality, setLocality] = useState('Outer Ring Road, Bengaluru');
  const [selectedDate, setSelectedDate] = useState('Tomorrow (Shubh Muhurat)');
  const [kitType, setKitType] = useState<'standard' | 'premium_organic'>('premium_organic');
  const [guestCount, setGuestCount] = useState(15);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking: RitualBooking = {
      id: `fam-${Date.now().toString().slice(-4)}`,
      ritualName: selectedCeremony.name,
      clientName: hostName,
      clientPhone: phone,
      gotra: gotra,
      nakshatra: nakshatra,
      veda: 'Krishna Yajurveda',
      address: address,
      locality: locality,
      date: selectedDate,
      timeSlot: '09:15 AM - 12:30 PM (Shubh Muhurat)',
      guestCount: guestCount,
      dakshinaTotal: selectedCeremony.dakshina + (kitType === 'premium_organic' ? 1200 : 0),
      advancePaid: 2000,
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
      specialNotes: `Booked via Household App. ${kitType === 'premium_organic' ? 'Requested Certified Organic A2 Ghee & Copper Kund' : 'Standard Kit'}.`,
      samagriKitName: `${selectedCeremony.name} Kit (${kitType === 'premium_organic' ? 'Organic Pure A2' : 'Standard Pure'})`,
      samagriItems: [
        { id: 'f-1', name: 'Certified A2 Gir Cow Ghee', category: 'ghee', quantity: '1.5 kg', verified: true },
        { id: 'f-2', name: 'Dry Wild Mango Samidha Sticks', category: 'wood', quantity: '4 kg', verified: true },
        { id: 'f-3', name: 'Navadhanya Grains (9 sacred grains)', category: 'grains', quantity: '1 set', verified: true },
        { id: 'f-4', name: 'Low-Smoke Pure Bhimseni Camphor', category: 'herb', quantity: '1 box', verified: true },
      ],
      createdVia: 'family_app',
      riderInfo: {
        name: 'Suresh Babu',
        phone: '+91 97422 99182',
        currentLocation: 'Staged at Panathur Delivery Hub (D-1 ready)',
        etaMinutes: 0,
        kitVerified: true,
      },
    };

    onBookCeremony(newBooking);
    onShowToast(
      'Ceremony Scheduled & D-1 Staged! 🪔',
      `Your ${selectedCeremony.name} has been locked. Samagri kit delivery is assured on D-1.`,
      'success'
    );
  };

  return (
    <div className="space-y-8">
      {/* Household Top Banner */}
      <div className="bg-gradient-to-r from-[#D9381E] via-[#FF5722] to-[#D4AF37] rounded-3xl text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-15 text-9xl font-serif select-none pointer-events-none">
          🕉️
        </div>

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-200 mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            Family Ritual Companion • Household View
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif leading-tight">
            Sacred Ceremonies, Zero Stress
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Every ritual is conducted by verified Vedic scholars. We eliminate morning-of-puja panic by ensuring all 108 authentic samagri items are delivered and verified on D-1 (the evening before).
          </p>
        </div>

        {/* 3 Core Promises */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/20 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">D-1 Delivery Assurance</p>
              <p className="text-[11px] text-amber-200">No missing puja samagri</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Precise Vedic Muhurat</p>
              <p className="text-[11px] text-amber-200">Aligned with Janma Nakshatra</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Transparent Dakshina</p>
              <p className="text-[11px] text-amber-200">Zero hidden fees, instant receipt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Household Ceremonies Tracker */}
      <section className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 md:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
          <div>
            <h3 className="text-lg font-black text-neutral-900 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D9381E]" />
              Your Family's Active Ritual Tracker
            </h3>
            <p className="text-xs text-neutral-600">
              Live updates for your upcoming and ongoing ceremonies.
            </p>
          </div>
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {activeBookings.length} Active Booking(s)
          </span>
        </div>

        {activeBookings.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-xs">
            No active ceremonies currently scheduled. Pick a ritual below to book.
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.slice(0, 2).map((booking) => (
              <div
                key={booking.id}
                className="bg-[#FAF6F0] rounded-xl border border-amber-200 p-4 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono text-neutral-500 block">
                      BOOKING #{booking.id.toUpperCase()}
                    </span>
                    <h4 className="text-base font-black text-neutral-900 font-serif">
                      {booking.ritualName}
                    </h4>
                    <p className="text-xs text-neutral-600">
                      Host: <strong>{booking.clientName}</strong> ({booking.gotra}) • {booking.locality}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-[#D9381E] bg-white px-2.5 py-1 rounded border border-amber-200 inline-block">
                      {booking.timeSlot}
                    </span>
                    <p className="text-xs font-black text-emerald-700 mt-1">
                      Dakshina: ₹{booking.dakshinaTotal}
                    </p>
                  </div>
                </div>

                {/* 4 Step Visual Progress Tracker */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-300 text-xs">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      1. Priest Assigned
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">
                      Pandit V. Shastri (Rigveda)
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-emerald-300 text-xs">
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      2. D-1 Samagri Kit
                    </span>
                    <span className="text-[11px] text-blue-700 font-semibold block mt-0.5">
                      {booking.samagriStatus}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-amber-300 text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      3. Transit &amp; Arrival
                    </span>
                    <span className="text-[11px] text-neutral-600 block mt-0.5">
                      {booking.riderInfo ? `ETA ${booking.riderInfo.etaMinutes || 15} mins` : 'On Schedule'}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-purple-200 text-xs flex flex-col justify-between">
                    <span className="font-bold text-purple-900 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                      4. Dakshina Payment
                    </span>
                    <button
                      onClick={() => onOpenPaymentModal(booking)}
                      className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1 px-2 rounded text-center transition-all"
                    >
                      Pay UPI Dakshina
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Form with Muhurat Picker */}
      <section className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 md:p-6">
        <div className="mb-6 pb-4 border-b border-amber-100">
          <h3 className="text-lg sm:text-xl font-black text-neutral-900 font-serif">
            Book a Sacred Ritual &amp; Lock D-1 Samagri
          </h3>
          <p className="text-xs text-neutral-600 mt-1">
            Choose from authentic Vedic rituals. Samagri is sourced fresh, weighed accurately, and delivered the day prior.
          </p>
        </div>

        {/* Ceremony Choice Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {CEREMONY_OPTIONS.map((c) => {
            const isSelected = selectedCeremony.name === c.name;
            return (
              <div
                key={c.name}
                onClick={() => setSelectedCeremony(c)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#D9381E] bg-orange-50/50 shadow-xs'
                    : 'border-amber-200 hover:border-amber-300 bg-[#FAF6F0]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    {c.badge}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">{c.duration}</span>
                </div>

                <h4 className="font-black text-neutral-900 text-sm font-serif mt-1">
                  {c.name}
                </h4>
                <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2">
                  {c.desc}
                </p>

                <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Dakshina:</span>
                  <span className="text-sm font-black text-[#D9381E]">
                    ₹{c.dakshina.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Yajamana (Head of Household Name)
              </label>
              <input
                type="text"
                required
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#D9381E]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Phone Number (for WhatsApp coordination)
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#D9381E]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Gotra &amp; Veda / Tradition
              </label>
              <input
                type="text"
                required
                value={gotra}
                onChange={(e) => setGotra(e.target.value)}
                placeholder="e.g. Kashyapa Gotra / Rigveda"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#D9381E]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                Janma Nakshatra / Rashi (for Sankalpa)
              </label>
              <input
                type="text"
                value={nakshatra}
                onChange={(e) => setNakshatra(e.target.value)}
                placeholder="e.g. Rohini / Taurus"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#D9381E]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-neutral-700 mb-1">
                Full Address &amp; Locality (for D-1 Samagri courier delivery)
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment name, tower, flat number, street..."
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#D9381E]"
              />
            </div>
          </div>

          {/* Samagri Quality Tier Selection */}
          <div className="pt-3 border-t border-amber-100">
            <label className="block font-bold text-neutral-800 text-xs mb-2">
              Select D-1 Samagri Assurance Kit Tier:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div
                onClick={() => setKitType('premium_organic')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  kitType === 'premium_organic'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-neutral-200 bg-neutral-50'
                }`}
              >
                <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  {kitType === 'premium_organic' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>}
                </div>
                <div>
                  <p className="font-black text-neutral-900">
                    Vedic Organic Grade Kit (+₹1,200)
                  </p>
                  <p className="text-neutral-600 text-[11px] mt-0.5">
                    100% Certified A2 Gir Cow Ghee (Bilona churned), wild unpasteurized forest honey, handpicked sacred bilva patra, heavy copper havan kund, low-smoke Bhimseni camphor.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setKitType('standard')}
                className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  kitType === 'standard'
                    ? 'border-[#D9381E] bg-orange-50/50 shadow-xs'
                    : 'border-neutral-200 bg-neutral-50'
                }`}
              >
                <div className="w-5 h-5 rounded-full border-2 border-[#D9381E] flex items-center justify-center shrink-0 mt-0.5">
                  {kitType === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-[#D9381E]"></div>}
                </div>
                <div>
                  <p className="font-black text-neutral-900">
                    Standard Vedic Kit (Included)
                  </p>
                  <p className="text-neutral-600 text-[11px] mt-0.5">
                    Pure cow ghee, authentic dry mango samidha wood, Navadhanya grains, Darbha grass, supari &amp; betel leaves, brass plate sets.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-100">
            <div className="text-xs text-neutral-600">
              <span>Total Estimated Dakshina &amp; Kit: </span>
              <strong className="text-base font-black text-emerald-800">
                ₹{(selectedCeremony.dakshina + (kitType === 'premium_organic' ? 1200 : 0)).toLocaleString('en-IN')}
              </strong>
              <span className="block text-[11px] text-neutral-500">
                Lock with ₹2,000 advance; balance payable post-ritual.
              </span>
            </div>

            <button
              type="submit"
              id="confirm-household-booking-btn"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D9381E] to-[#B33018] hover:brightness-105 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Confirm Booking &amp; Stage D-1 Samagri</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
