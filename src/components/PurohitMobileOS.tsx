import React, { useState } from 'react';
import { RitualBooking, LeadInquiry, FamilyClient } from '../types';
import { VoiceNoteWidget } from './VoiceNoteWidget';
import {
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  FileText,
  CreditCard,
  AlertTriangle,
  QrCode,
  Sparkles,
  Users,
  Search,
  CheckCircle2,
  Share2,
  Flame,
  ShieldCheck,
  ChevronRight,
  Send,
  UserCheck,
  Mic,
  Calendar,
  Compass,
  ArrowRight,
  Filter,
  Check,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface PurohitMobileOSProps {
  bookings: RitualBooking[];
  leads: LeadInquiry[];
  clients: FamilyClient[];
  onAcceptLead: (lead: LeadInquiry) => void;
  onReferLead: (lead: LeadInquiry) => void;
  onOpenWhatsAppModal: (clientName: string, phone: string, occasion: string, customText?: string) => void;
  onOpenDossierModal: (booking: RitualBooking) => void;
  onOpenRiderModal: (booking: RitualBooking) => void;
  onOpenHomaSafetyModal: (booking: RitualBooking) => void;
  onOpenPaymentModal: (booking: RitualBooking) => void;
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  onOpenShareQrModal: () => void;
  onTriggerEmergencyBackup?: (booking: RitualBooking) => void;
  onBookingCreated: (booking: RitualBooking) => void;
  onSendToChat?: (text: string) => void;
  hasGoogleChat: boolean;
}

export const PurohitMobileOS: React.FC<PurohitMobileOSProps> = ({
  bookings,
  leads,
  clients,
  onAcceptLead,
  onReferLead,
  onOpenWhatsAppModal,
  onOpenDossierModal,
  onOpenRiderModal,
  onOpenHomaSafetyModal,
  onOpenPaymentModal,
  onShowToast,
  onOpenShareQrModal,
  onTriggerEmergencyBackup,
  onBookingCreated,
  onSendToChat,
  hasGoogleChat,
}) => {
  // Mobile sub-view tab: 'timeline' | 'voice' | 'leads' | 'crm'
  const [mobileSubTab, setMobileSubTab] = useState<'timeline' | 'voice' | 'leads' | 'crm'>('timeline');

  // Desktop right-panel tab: 'voice' | 'leads' | 'crm'
  const [desktopRightTab, setDesktopRightTab] = useState<'voice' | 'leads' | 'crm'>('voice');

  const [crmSearch, setCrmSearch] = useState('');
  const [crmFilter, setCrmFilter] = useState<'all' | 'vip' | 'followup'>('all');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
      c.gotra.toLowerCase().includes(crmSearch.toLowerCase()) ||
      c.address.toLowerCase().includes(crmSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (crmFilter === 'vip') return c.vip;
    if (crmFilter === 'followup') return c.needsFollowup;
    return true;
  });

  const handleOpenGoogleMaps = (address: string, clientName: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    onShowToast('Navigating to Venue 🧭', `Opening Google Maps route for ${clientName}'s residence.`, 'info');
  };

  const handleTriggerEmergencyAlert = (booking: RitualBooking) => {
    if (onTriggerEmergencyBackup) {
      onTriggerEmergencyBackup(booking);
    } else {
      onShowToast(
        '🚨 Emergency Backup Requested!',
        `Standby Acharya dispatched from Indiranagar Hub to cover ${booking.ritualName} for ${booking.clientName}.`,
        'warning'
      );
    }
  };

  const totalDakshinaToday = bookings.reduce((sum, b) => sum + b.dakshinaTotal, 0);
  const nextBooking = bookings[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Acharya Profile & Duty Header */}
      <div className="bg-[#1C140E] rounded-2xl sm:rounded-3xl text-white p-4 sm:p-5 border border-stone-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C2341D] to-[#8B1E0F] flex items-center justify-center text-2xl shadow-inner border border-amber-400/30 shrink-0">
              📿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-display tracking-wide">
                  Pt. Vidyadhar Shastri
                </h2>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Duty
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Rigveda (Sakala Sakha) • Today: <strong className="text-white">{bookings.length} Pujas</strong> • Total Dakshina: <strong className="text-amber-300">₹{totalDakshinaToday.toLocaleString('en-IN')}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenShareQrModal}
              id="priest-share-qr-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-semibold border border-stone-700 transition-colors touch-target"
            >
              <QrCode className="w-4 h-4" />
              <span>Share App</span>
            </button>
            <span className="bg-stone-800/80 text-stone-300 text-xs font-mono font-medium px-3 py-1.5 rounded-xl border border-stone-700 hidden sm:inline-block">
              Bengaluru South Zone
            </span>
          </div>
        </div>
      </div>

      {/* MOBILE ERGONOMIC SUB-NAVIGATION (Thumb-friendly tab strip on mobile) */}
      <div className="block lg:hidden sticky top-[57px] z-20 bg-[#FBF9F5]/95 backdrop-blur-md pt-1 pb-2">
        <div className="flex items-center p-1 bg-stone-200/70 rounded-xl border border-stone-300 shadow-inner">
          <button
            onClick={() => setMobileSubTab('timeline')}
            id="mobile-tab-timeline"
            className={`flex-1 py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              mobileSubTab === 'timeline'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Today's Schedule ({bookings.length})
          </button>
          <button
            onClick={() => setMobileSubTab('voice')}
            id="mobile-tab-voice"
            className={`flex-1 py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              mobileSubTab === 'voice'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-[#C2341D]" />
            <span>AI Voice</span>
          </button>
          <button
            onClick={() => setMobileSubTab('leads')}
            id="mobile-tab-leads"
            className={`flex-1 py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              mobileSubTab === 'leads'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Leads</span>
            {leads.length > 0 && (
              <span className="bg-[#C2341D] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                {leads.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileSubTab('crm')}
            id="mobile-tab-crm"
            className={`flex-1 py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
              mobileSubTab === 'crm'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            CRM ({clients.length})
          </button>
        </div>
      </div>

      {/* WORKSPACE CONTENT: RESPONSIVE TWO-COLUMN ON DESKTOP, TABBED ON MOBILE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================
            LEFT COLUMN: ACTIVE RITUAL TIMELINE (7 COLS ON DESKTOP)
           ============================================================ */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            mobileSubTab === 'timeline' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* NEXT UP / IN-PROGRESS CEREMONY HERO CARD */}
          {nextBooking && (
            <div className="bg-white rounded-2xl border-2 border-amber-500/40 shadow-sm p-4 sm:p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#C2341D] via-amber-500 to-[#8B1E0F]" />

              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-950 font-bold text-xs px-2.5 py-1 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-[#C2341D] animate-ping" />
                  IN-PROGRESS / NEXT CEREMONY
                </span>
                <span className="font-mono text-xs font-bold text-stone-500">
                  #{nextBooking.id.toUpperCase()}
                </span>
              </div>

              {/* Ceremony Name & Muhurat Slot */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-display">
                    {nextBooking.ritualName}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1">
                    Yajamana: <strong className="text-stone-900">{nextBooking.clientName}</strong> ({nextBooking.gotra}) • {nextBooking.veda || 'Rigveda Sakala'}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="inline-flex items-center gap-1.5 bg-stone-900 text-amber-200 font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{nextBooking.timeSlot}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Dakshina: <strong className="text-emerald-700">₹{nextBooking.dakshinaTotal}</strong> (Pending: <span className="text-[#C2341D] font-bold">₹{nextBooking.dakshinaTotal - nextBooking.advancePaid}</span>)
                  </p>
                </div>
              </div>

              {/* Venue & Samagri Delivery Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-3">
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    Venue Address
                  </span>
                  <p className="font-semibold text-stone-800 flex items-start gap-1.5 text-xs mt-1">
                    <MapPin className="w-4 h-4 text-[#C2341D] shrink-0 mt-0.5" />
                    <span>{nextBooking.address}</span>
                  </p>
                </div>

                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                    D-1 Samagri Kit
                  </span>
                  <p className="font-semibold text-emerald-800 flex items-center gap-1.5 text-xs mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{nextBooking.samagriStatus} • Inspected</span>
                  </p>
                </div>
              </div>

              {/* 5-Point Readiness Matrix */}
              <div className="pb-3 border-b border-stone-200">
                <span className="text-[11px] font-bold text-stone-600 block mb-1.5">
                  Pre-Ritual Readiness Checklist:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
                  <span className="bg-emerald-50 text-emerald-900 px-2 py-1 rounded-md border border-emerald-200 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> D-1 Samagri Ready
                  </span>
                  <span className="bg-emerald-50 text-emerald-900 px-2 py-1 rounded-md border border-emerald-200 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Muhurat Locked
                  </span>
                  <span className="bg-emerald-50 text-emerald-900 px-2 py-1 rounded-md border border-emerald-200 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Advance Received
                  </span>
                  <span className="bg-emerald-50 text-emerald-900 px-2 py-1 rounded-md border border-emerald-200 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Homa Safety Verified
                  </span>
                </div>
              </div>

              {/* Field Notes Preview (if already logged) */}
              {nextBooking.fieldNotes && (
                <div className="py-2.5 px-3 my-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                    Logged Field Notes &amp; Deviations:
                  </span>
                  <p className="text-stone-800 mt-0.5 line-clamp-2 italic">
                    "{nextBooking.fieldNotes}"
                  </p>
                </div>
              )}

              {/* PRIMARY ACTION: LAUNCH DOSSIER & MUHURAT TIMER */}
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => onOpenDossierModal(nextBooking)}
                  id="priest-launch-dossier-hero-btn"
                  className="w-full py-3 px-4 rounded-xl bg-[#C2341D] hover:bg-[#A82A16] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer touch-target"
                >
                  <FileText className="w-5 h-5" />
                  <span>Launch Sacred Dossier &amp; Muhurat Timer</span>
                </button>

                {/* Secondary Quick Action Bar */}
                <div className="grid grid-cols-4 gap-2">
                  <a
                    href={`tel:${nextBooking.clientPhone}`}
                    id="priest-call-host-btn"
                    className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors border border-stone-200 touch-target"
                  >
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>Call Host</span>
                  </a>

                  <button
                    onClick={() => handleOpenGoogleMaps(nextBooking.address, nextBooking.clientName)}
                    id="priest-gps-route-btn"
                    className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors border border-stone-200 touch-target"
                  >
                    <Navigation className="w-4 h-4 text-blue-700" />
                    <span>GPS Route</span>
                  </button>

                  <button
                    onClick={() => onOpenPaymentModal(nextBooking)}
                    id="priest-collect-upi-btn"
                    className="py-2 px-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors border border-amber-300 touch-target"
                  >
                    <CreditCard className="w-4 h-4 text-[#C2341D]" />
                    <span>Collect UPI</span>
                  </button>

                  <button
                    onClick={() => handleTriggerEmergencyAlert(nextBooking)}
                    id="priest-backup-emergency-btn"
                    className="py-2 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors border border-rose-200 touch-target"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Backup</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ALL SCHEDULED CEREMONIES LIST */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C2341D]" />
                <h3 className="font-bold text-sm sm:text-base text-stone-900 font-display">
                  Chronological Timeline ({bookings.length} Ceremonies)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-stone-500">
                Today, 21 Sep 2026
              </span>
            </div>

            <div className="space-y-3">
              {bookings.map((booking, index) => {
                const isNext = index === 0;
                return (
                  <div
                    key={booking.id}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                      isNext
                        ? 'border-amber-400 bg-amber-50/40'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-stone-900 text-sm">
                              {booking.ritualName}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
                              {booking.timeSlot}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">
                            Yajamana: <strong>{booking.clientName}</strong> ({booking.gotra}) • {booking.locality}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => onOpenDossierModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs flex items-center gap-1 transition-colors touch-target"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#C2341D]" />
                          <span>Dossier</span>
                        </button>
                        <button
                          onClick={() => onOpenPaymentModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-[#C2341D] hover:bg-[#A82A16] text-white font-bold text-xs flex items-center gap-1 transition-colors touch-target"
                        >
                          <span>₹{booking.dakshinaTotal}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: AI ENGINE, LEADS, & YAJAMANA CRM
           ============================================================ */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            mobileSubTab !== 'timeline' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Desktop Right Column Segmented Tab Selector */}
          <div className="hidden lg:flex items-center p-1 bg-stone-200/70 rounded-xl border border-stone-300 shadow-inner">
            <button
              onClick={() => setDesktopRightTab('voice')}
              id="desktop-subtab-voice"
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                desktopRightTab === 'voice'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-[#C2341D]" />
              <span>AI Voice Engine</span>
            </button>
            <button
              onClick={() => setDesktopRightTab('leads')}
              id="desktop-subtab-leads"
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                desktopRightTab === 'leads'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Devotee Leads ({leads.length})</span>
            </button>
            <button
              onClick={() => setDesktopRightTab('crm')}
              id="desktop-subtab-crm"
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                desktopRightTab === 'crm'
                  ? 'bg-white text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-stone-700" />
              <span>Yajamana CRM</span>
            </button>
          </div>

          {/* 1. AI VOICE ENGINE PANEL */}
          {((mobileSubTab === 'voice') || (mobileSubTab === 'timeline' && desktopRightTab === 'voice')) && (
            <div className="space-y-4">
              <VoiceNoteWidget
                onBookingCreated={onBookingCreated}
                onShowToast={onShowToast}
                onSendToChat={onSendToChat}
                hasGoogleChat={hasGoogleChat}
              />
            </div>
          )}

          {/* 2. DEVOTEE LEADS MARKETPLACE PANEL */}
          {((mobileSubTab === 'leads') || (mobileSubTab === 'timeline' && desktopRightTab === 'leads')) && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C2341D]" />
                    Panchang-Filtered Devotee Leads
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Matches your Rigvedic Sakha &amp; locality
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  {leads.length} Available
                </span>
              </div>

              {leads.length === 0 ? (
                <div className="text-center py-8 text-stone-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold">All market leads accepted or referred!</p>
                  <p className="text-[11px] text-stone-400 mt-1">New incoming inquiries will notify you via Google Chat.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-300 bg-[#FFFDF9] transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-stone-900 text-xs">{lead.ritualName}</h4>
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              Verified
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">
                            <strong>{lead.clientName}</strong> • {lead.locality} ({lead.distanceKm} km away)
                          </p>
                          <p className="text-[11px] text-amber-950 mt-0.5">
                            {lead.tradition} • {lead.language}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-mono font-bold text-stone-800 block">
                            {lead.date}
                          </span>
                          <span className="text-xs font-black text-emerald-700">
                            ₹{lead.estimatedDakshina}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                        <button
                          onClick={() => onReferLead(lead)}
                          className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs touch-target"
                        >
                          Refer (5% Fee)
                        </button>
                        <button
                          onClick={() => onAcceptLead(lead)}
                          className="px-3 py-1.5 rounded-lg bg-[#C2341D] hover:bg-[#A82A16] text-white font-bold text-xs shadow-2xs touch-target"
                        >
                          Accept &amp; Lock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. YAJAMANA CRM PANEL */}
          {((mobileSubTab === 'crm') || (mobileSubTab === 'timeline' && desktopRightTab === 'crm')) && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#C2341D]" />
                    Yajamana Gotra &amp; Family CRM
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Ancestral Gotras, past pujas, &amp; WhatsApp blessings
                  </p>
                </div>

                <select
                  value={crmFilter}
                  onChange={(e) => setCrmFilter(e.target.value as 'all' | 'vip' | 'followup')}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 font-medium"
                >
                  <option value="all">All Households ({clients.length})</option>
                  <option value="vip">VIP Devotees Only</option>
                  <option value="followup">Needs Follow-up</option>
                </select>
              </div>

              {/* CRM Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by Gotra, Name, or Locality..."
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#C2341D]/40 bg-stone-50/50"
                />
              </div>

              {/* Client List */}
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-6 text-stone-400 text-xs">
                    No family records match your search filter.
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="p-3 rounded-xl border border-stone-200 bg-white hover:border-amber-300 transition-all space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-stone-900 text-xs">{client.name}</h4>
                            {client.vip && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                                VIP
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-600">
                            Gotra: <strong>{client.gotra}</strong> • {client.veda}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                          {client.pastRitualsCount} Pujas
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{client.address}</span>
                      </p>

                      {client.upcomingImportantDate && (
                        <p className="text-[11px] text-[#C2341D] font-medium">
                          🗓️ Upcoming: {client.upcomingEventTitle} ({client.upcomingImportantDate})
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1.5 border-t border-stone-100 text-xs">
                        <span className="text-stone-500 font-mono text-[10px]">{client.phone}</span>
                        <button
                          onClick={() => onOpenWhatsAppModal(client.name, client.phone, client.upcomingEventTitle || 'Sacred Puja')}
                          className="text-[#C2341D] font-bold hover:underline flex items-center gap-1 text-[11px] touch-target"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Send Blessing</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
