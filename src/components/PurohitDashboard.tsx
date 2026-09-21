import React, { useState } from 'react';
import { RitualBooking, LeadInquiry, FamilyClient } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  Send,
  Navigation,
  FileText,
  UserCheck,
  Share2,
  Phone,
  Calendar,
  Sparkles,
  ChevronRight,
  Flame,
  CreditCard,
  Search,
  Filter,
  Check,
  Eye,
  Info,
  QrCode,
} from 'lucide-react';

interface PurohitDashboardProps {
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
}

export const PurohitDashboard: React.FC<PurohitDashboardProps> = ({
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
}) => {
  const [crmFilter, setCrmFilter] = useState<'all' | 'active' | 'followup' | 'vip'>('all');
  const [crmSearch, setCrmSearch] = useState('');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
      c.gotra.toLowerCase().includes(crmSearch.toLowerCase()) ||
      c.address.toLowerCase().includes(crmSearch.toLowerCase());

    if (!matchesSearch) return false;
    if (crmFilter === 'active') return c.pastRitualsCount > 2;
    if (crmFilter === 'followup') return c.needsFollowup;
    if (crmFilter === 'vip') return c.vip;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* MODULE C: LIVE RITUAL PIPELINE */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#D9381E] text-white text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Module C
              </span>
              <h2 className="text-xl font-black text-neutral-900 font-serif">
                Today’s Live Ritual Pipeline &amp; Readiness Score™
              </h2>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              5-point verification matrix ensuring D-1 Samagri staging, Muhurat alignment, and ritual safety before priest departure.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenShareQrModal}
              id="dashboard-share-qr-btn"
              title="Share app with client or family via mobile QR code"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-105 text-amber-950 font-black text-xs shadow-xs transition-all border border-amber-400 hover:scale-102"
            >
              <QrCode className="w-3.5 h-3.5 text-[#8B1E0F]" />
              <span>Share via QR Code</span>
            </button>
            <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-200">
              🟢 Zero Delay Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => {
            const is5of5 = booking.readiness.score === 5;
            return (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl border transition-all shadow-sm hover:shadow-md p-5 ${
                  is5of5
                    ? 'border-emerald-200/80 bg-gradient-to-r from-white via-white to-emerald-50/30'
                    : 'border-amber-300 bg-gradient-to-r from-white via-white to-amber-50/40'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info column */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-[#D9381E]" />
                        {booking.timeSlot}
                      </span>

                      <h3 className="text-base sm:text-lg font-black text-neutral-900 font-serif">
                        {booking.ritualName}
                      </h3>

                      {is5of5 ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          5/5 Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-400 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Action Required ({booking.readiness.score}/5)
                        </span>
                      )}

                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          booking.samagriStatus === 'Delivered D-1'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-orange-50 text-orange-800 border border-orange-200'
                        }`}
                      >
                        📦 {booking.samagriStatus}
                      </span>
                    </div>

                    {/* Client & venue line */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                      <span className="font-bold text-neutral-900 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#D9381E]" />
                        {booking.clientName} ({booking.gotra})
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="flex items-center gap-1 text-neutral-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {booking.locality}
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="font-mono text-neutral-700">
                        Dakshina: <strong className="text-neutral-900">₹{booking.dakshinaTotal}</strong> (Advance Paid: ₹{booking.advancePaid})
                      </span>
                    </div>

                    {/* 5-Point Readiness Matrix Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          booking.readiness.samagriVerifiedD1
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {booking.readiness.samagriVerifiedD1 ? '✓ D-1 Kit Staged' : '⏳ Samagri with Rider'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Muhurat Confirmed
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Dakshina Advance Locked
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ GPS Route Optimized
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                          booking.readiness.homaSafetyConfirmed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {booking.readiness.homaSafetyConfirmed ? '✓ Homa Safety Clear' : '⚠️ Ventilation Check Pending'}
                      </span>
                    </div>

                    {booking.specialNotes && (
                      <p className="text-[11px] text-amber-900/80 bg-amber-50/60 px-2.5 py-1 rounded border border-amber-100 italic">
                        💡 Note: {booking.specialNotes}
                      </p>
                    )}

                    {booking.fieldNotes && (
                      <div className="text-[11px] text-emerald-900 bg-emerald-50/80 px-2.5 py-1 rounded border border-emerald-200 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold shrink-0">📝 Field Notes:</span>
                          <span className="truncate italic text-neutral-700">{booking.fieldNotes.split('\n')[0]}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-200/60 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                          CRM Synced
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                    {/* Primary actions based on status */}
                    {booking.id === 'bk-01' && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            onOpenWhatsAppModal(
                              booking.clientName,
                              booking.clientPhone,
                              booking.ritualName,
                              `Namaskara ${booking.clientName} ji, Acharya is preparing for the Griha Pravesh Muhurat (09:30 AM). D-1 Samagri Kit is staged at your apartment.`
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          <Send className="w-3 h-3" />
                          WhatsApp Reminder
                        </button>
                        <button
                          onClick={() => onOpenDossierModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <FileText className="w-3 h-3 text-[#D9381E]" />
                          View Dossier
                        </button>
                        <button
                          onClick={() => {
                            onShowToast('GPS Navigation Started', `Routing to ${booking.address} via fastest route (22 mins).`, 'info');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Navigation className="w-3 h-3 text-amber-400" />
                          Start GPS
                        </button>
                      </div>
                    )}

                    {booking.id === 'bk-02' && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onOpenRiderModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all animate-bounce"
                        >
                          <MapPin className="w-3 h-3" />
                          Track Rider ({booking.riderInfo?.etaMinutes}m ETA)
                        </button>
                        <button
                          onClick={() => onOpenDossierModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <FileText className="w-3 h-3 text-[#D9381E]" />
                          Dossier
                        </button>
                        <button
                          onClick={() => {
                            booking.readiness.samagriVerifiedD1 = true;
                            booking.readiness.homaSafetyConfirmed = true;
                            booking.readiness.score = 5;
                            booking.samagriStatus = 'Delivered D-1';
                            onShowToast('Ritual Setup Confirmed! 🟢', 'Samagri delivered & puja altar verified 5/5 ready.', 'success');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          Confirm Setup
                        </button>
                      </div>
                    )}

                    {booking.id === 'bk-03' && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onOpenDossierModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <FileText className="w-3 h-3 text-[#D9381E]" />
                          Dossier
                        </button>
                        <button
                          onClick={() => onOpenHomaSafetyModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          <Flame className="w-3 h-3" />
                          Homa Safety Checklist
                        </button>
                        <button
                          onClick={() => onOpenPaymentModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          <CreditCard className="w-3 h-3" />
                          Collect UPI Dakshina
                        </button>
                      </div>
                    )}

                    {/* Generic fallbacks for voice parsed bookings */}
                    {booking.id !== 'bk-01' && booking.id !== 'bk-02' && booking.id !== 'bk-03' && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onOpenDossierModal(booking)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <FileText className="w-3 h-3 text-[#D9381E]" />
                          View Dossier
                        </button>
                        <button
                          onClick={() =>
                            onOpenWhatsAppModal(
                              booking.clientName,
                              booking.clientPhone,
                              booking.ritualName
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                        >
                          <Send className="w-3 h-3" />
                          WhatsApp Notify
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODULE D: VERIFIED LEAD MARKETPLACE & NETWORK REFERRAL */}
      <section className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#D9381E] text-white text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Module D
              </span>
              <h2 className="text-xl font-black text-neutral-900 font-serif">
                Verified Lead Marketplace &amp; Network Referral
              </h2>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              AI-matched auspicious inquiries near your location. Accept directly or refer to an accredited peer priest for a 5% commission.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80">
            <span>Radius: 8 km (Bengaluru East &amp; Central)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-[#FAF6F0]/60 rounded-xl border border-amber-200 p-4 flex flex-col justify-between hover:border-amber-400 transition-all shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-700" />
                    Verified Client
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-900">
                    {lead.distanceKm} km away
                  </span>
                </div>

                <h4 className="font-black text-neutral-900 text-sm sm:text-base font-serif leading-tight">
                  {lead.ritualName}
                </h4>

                <div className="text-xs text-neutral-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <strong className="text-neutral-800">{lead.locality}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{lead.date} • {lead.muhuratTime}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-amber-900 font-semibold">{lead.tradition}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Est. Dakshina:</span>
                  <span className="text-base font-black text-emerald-700">
                    ₹{lead.estimatedDakshina.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-2">
                <button
                  onClick={() => onAcceptLead(lead)}
                  id={`accept-lead-${lead.id}`}
                  className="w-full bg-[#D9381E] hover:bg-[#B33018] text-white py-2 px-2 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Accept &amp; Lock
                </button>
                <button
                  onClick={() => onReferLead(lead)}
                  id={`refer-lead-${lead.id}`}
                  className="w-full bg-white hover:bg-amber-50 text-neutral-800 border border-amber-300 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                  title="Refer to peer priest for 5% network commission"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#D9381E]" />
                  Refer (5%)
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULE E: FAMILY CRM & ANNUAL RITUAL ENGINE */}
      <section className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#D9381E] text-white text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Module E
              </span>
              <h2 className="text-xl font-black text-neutral-900 font-serif">
                Family CRM &amp; Annual Ritual Engine
              </h2>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              Disintermediation prevention engine: tracks Gotra, Kula Devata, annual Shraddha &amp; Vrata Tithis with 1-click personalized WhatsApp blessings.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={crmSearch}
                onChange={(e) => setCrmSearch(e.target.value)}
                placeholder="Search Gotra, Name, Locality..."
                className="pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-[#D9381E] w-48 sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-lg border border-amber-200">
              {(['all', 'active', 'followup', 'vip'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setCrmFilter(filterType)}
                  className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                    crmFilter === filterType
                      ? 'bg-[#D9381E] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {filterType === 'all'
                    ? 'All'
                    : filterType === 'active'
                    ? 'Active'
                    : filterType === 'followup'
                    ? 'Follow-up'
                    : '⭐ VIP'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Clients list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-[#FDFBF7] rounded-xl border border-amber-200/90 p-4 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-neutral-900 text-base font-serif">
                      {client.name}
                    </h4>
                    {client.vip && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-1.5 py-0.2 rounded border border-amber-300">
                        ⭐ VIP Household
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-neutral-600">
                    {client.gotra} • {client.veda} ({client.sutra || 'Sutra'})
                  </p>
                </div>

                <span className="text-[11px] font-bold text-neutral-500 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                  {client.pastRitualsCount} Pujas Conducted
                </span>
              </div>

              <div className="mt-3 text-xs space-y-1.5 text-neutral-700 bg-white/70 p-3 rounded-lg border border-amber-100">
                <p className="flex items-center justify-between">
                  <span className="text-neutral-500">Kula Devata:</span>
                  <span className="font-bold text-neutral-900">{client.kulaDevata || 'Lord Venkateshwara'}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-neutral-500">Upcoming Tithi:</span>
                  <span className="font-bold text-[#D9381E]">{client.upcomingEventTitle}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-neutral-500">Event Date:</span>
                  <span className="font-mono text-neutral-800">{client.upcomingImportantDate}</span>
                </p>
                {client.customNotes && (
                  <p className="text-[11px] text-neutral-600 pt-1 border-t border-neutral-100 italic">
                    "{client.customNotes}"
                  </p>
                )}
              </div>

              {/* CRM Action buttons */}
              <div className="mt-3 flex items-center justify-between gap-2 pt-2">
                <span className="text-xs font-mono text-neutral-500">{client.phone}</span>
                <button
                  onClick={() =>
                    onOpenWhatsAppModal(
                      client.name,
                      client.phone,
                      client.upcomingEventTitle,
                      `Om Shanti ${client.name} ji. Wishing your family peace and prosperity. The auspicious date for your family's ${client.upcomingEventTitle} falls on ${client.upcomingImportantDate}. May we reserve the Shubh Muhurat and arrange the D-1 Samagri Kit for you?`
                    )
                  }
                  id={`nudge-client-${client.id}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Send className="w-3 h-3" />
                  Send Anniversary Blessing + Nudge
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
