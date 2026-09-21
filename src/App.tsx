/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  TabMode,
  RitualBooking,
  LeadInquiry,
  FamilyClient,
  InventoryItem,
  ToastMessage,
  GoogleChatSpace,
} from './types';
import {
  INITIAL_BOOKINGS,
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  INITIAL_INVENTORY,
} from './data/mockData';
import {
  initAuth,
  googleSignIn,
  logout,
  fetchChatSpaces,
  sendChatMessage,
} from './services/firebaseAuth';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { VoiceNoteWidget } from './components/VoiceNoteWidget';
import { FamilyPortal } from './components/FamilyPortal';
import { PurohitMobileOS } from './components/PurohitMobileOS';
import { AggregatorDesk } from './components/AggregatorDesk';
import { DigitalStandee } from './components/DigitalStandee';
import {
  RiderTrackingModal,
  DossierModal,
  HomaSafetyModal,
  WhatsAppModal,
  GoogleChatModal,
  ExportModal,
  ShareAppQrModal,
} from './components/Modals';
import { ToastContainer } from './components/Toast';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabMode>('purohit');
  const [bookings, setBookings] = useState<RitualBooking[]>(INITIAL_BOOKINGS);
  const [leads, setLeads] = useState<LeadInquiry[]>(INITIAL_LEADS);
  const [clients, setClients] = useState<FamilyClient[]>(INITIAL_CLIENTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Google Chat Auth & Integration State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [chatSpaces, setChatSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedChatSpace, setSelectedChatSpace] = useState<string>('');

  // Modals state
  const [activeRiderBooking, setActiveRiderBooking] = useState<RitualBooking | null>(null);
  const [activeDossierBooking, setActiveDossierBooking] = useState<RitualBooking | null>(null);
  const [activeHomaSafetyBooking, setActiveHomaSafetyBooking] = useState<RitualBooking | null>(null);
  const [whatsAppData, setWhatsAppModalData] = useState<{
    isOpen: boolean;
    clientName: string;
    phone: string;
    occasion: string;
    messageText: string;
  }>({
    isOpen: false,
    clientName: '',
    phone: '',
    occasion: '',
    messageText: '',
  });

  const [googleChatModalData, setGoogleChatModalData] = useState<{
    isOpen: boolean;
    defaultMessage: string;
  }>({
    isOpen: false,
    defaultMessage: '',
  });

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isShareQrModalOpen, setIsShareQrModalOpen] = useState(false);

  // Initialize Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        setCurrentUser(user);
        setGoogleToken(token);
        const spaces = await fetchChatSpaces(token);
        setChatSpaces(spaces);
        if (spaces.length > 0) {
          setSelectedChatSpace(spaces[0].name);
        }
      },
      () => {
        setCurrentUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      showToast('Connecting to Google...', 'Opening Google authentication popup', 'info');
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setGoogleToken(result.accessToken);
        const spaces = await fetchChatSpaces(result.accessToken);
        setChatSpaces(spaces);
        if (spaces.length > 0) {
          setSelectedChatSpace(spaces[0].name);
        }
        showToast(
          'Google Chat Connected! 💬',
          `Authorized as ${result.user.displayName || result.user.email}. Ritual updates will sync with your spaces.`,
          'success'
        );
      }
    } catch (err: unknown) {
      console.error('Google sign in error:', err);
      showToast('Sign-In Notice', 'Authentication was closed or canceled.', 'warning');
    }
  };

  const handleGoogleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setGoogleToken(null);
    setChatSpaces([]);
    showToast('Signed Out', 'Disconnected from Google Chat integration.', 'info');
  };

  const showToast = (title: string, description: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleSendToChat = async (messageText: string) => {
    if (!googleToken) {
      // Prompt user to connect Google Chat or open modal
      setGoogleChatModalData({
        isOpen: true,
        defaultMessage: messageText,
      });
      return;
    }

    const spaceToUse = selectedChatSpace || (chatSpaces[0] ? chatSpaces[0].name : 'spaces/default');
    const result = await sendChatMessage(googleToken, spaceToUse, messageText);
    if (result.success) {
      showToast('Dispatched to Google Chat! 💬', 'Notification broadcasted to ritual coordination space.', 'success');
    }
  };

  // Metrics computation
  const ceremoniesToday = bookings.length;
  const dakshinaToday = bookings.reduce((sum, b) => sum + (b.advancePaid || 0), 0);
  const stagedCount = bookings.filter((b) => b.samagriStatus === 'Delivered D-1').length;
  const samagriStagedPercent = bookings.length > 0 ? Math.round((stagedCount / bookings.length) * 100) : 100;
  const activeClientsCount = clients.length + 34; // benchmarked active households

  // Actions
  const handleBookingCreated = (newBooking: RitualBooking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Also auto-add or update client in CRM if new
    setClients((prev) => {
      const existing = prev.find((c) => c.phone === newBooking.clientPhone);
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? { ...c, pastRitualsCount: c.pastRitualsCount + 1, lastRitualDate: 'Scheduled Today' }
            : c
        );
      }
      return [
        {
          id: `crm-${Date.now().toString().slice(-4)}`,
          name: newBooking.clientName,
          phone: newBooking.clientPhone,
          gotra: newBooking.gotra,
          veda: newBooking.veda || 'Rigveda',
          address: newBooking.address,
          pastRitualsCount: 1,
          lastRitualDate: newBooking.date,
          upcomingImportantDate: '15 Oct 2026',
          upcomingEventTitle: 'Navaratri Chandi Homa & Durga Puja',
          customNotes: newBooking.specialNotes || 'Added via AI Voice Note',
          vip: true,
          needsFollowup: false,
        },
        ...prev,
      ];
    });
  };

  const handleAcceptLead = (lead: LeadInquiry) => {
    // Transform lead into booked ceremony
    const newBooking: RitualBooking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      ritualName: lead.ritualName,
      clientName: lead.clientName,
      clientPhone: '+91 99014 55192',
      gotra: 'Shandilya Gotra',
      veda: lead.tradition,
      address: `${lead.locality}, Bengaluru`,
      locality: lead.locality,
      date: lead.date,
      timeSlot: lead.muhuratTime,
      guestCount: lead.guestCount,
      dakshinaTotal: lead.estimatedDakshina,
      advancePaid: Math.round(lead.estimatedDakshina * 0.4),
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
      specialNotes: `Accepted from Verified Lead Marketplace (${lead.tradition}).`,
      samagriKitName: `${lead.ritualName} Samagri Kit (Assigned)`,
      samagriItems: [
        { id: 'l-1', name: 'Dry Mango Firewood Samidha', category: 'wood', quantity: '5 kg', verified: true },
        { id: 'l-2', name: 'Certified Gir Cow Ghee', category: 'ghee', quantity: '1.5 kg', verified: true },
        { id: 'l-3', name: 'Navadhanya Grains (9 sacred grains)', category: 'grains', quantity: '1 set', verified: true },
      ],
      createdVia: 'marketplace',
      riderInfo: {
        name: 'Girish Babu',
        phone: '+91 99010 11928',
        currentLocation: 'Staged at Regional Hub',
        etaMinutes: 0,
        kitVerified: true,
      },
    };

    setBookings((prev) => [newBooking, ...prev]);
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    showToast(
      'Slot Locked! 📿',
      `${lead.ritualName} for ${lead.clientName} added to your live calendar. ₹${newBooking.advancePaid} advance secured.`,
      'success'
    );
  };

  const handleReferLead = (lead: LeadInquiry) => {
    const commission = Math.round(lead.estimatedDakshina * 0.05);
    setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    showToast(
      'Referred to Peer Priest! 🤝',
      `Assigned to Pandit Radhakrishna Shastri. ₹${commission} network referral fee credited to your wallet.`,
      'info'
    );
  };

  const handleTriggerEmergencyBackup = (booking: RitualBooking) => {
    showToast(
      '🚨 Standby Acharya Dispatched!',
      `Backup scholar Pandit Narasimha Bhattar (Yajurveda) dispatched from Jayanagar Hub for ${booking.ritualName}.`,
      'warning'
    );
    if (googleToken) {
      handleSendToChat(
        `🚨 [EMERGENCY BACKUP ACHARYA DISPATCHED]\n• Ritual: ${booking.ritualName}\n• Devotee: ${booking.clientName} (${booking.clientPhone})\n• Venue: ${booking.address}\n• Status: Standby Pandit dispatched.`
      );
    }
  };

  const handleSaveFieldNotes = (bookingId: string, notes: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, fieldNotes: notes } : b))
    );

    setActiveDossierBooking((prev) =>
      prev && prev.id === bookingId ? { ...prev, fieldNotes: notes } : prev
    );

    // Sync to Family CRM clients table
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking && notes.trim()) {
      setClients((prev) =>
        prev.map((c) => {
          if (
            c.name.toLowerCase() === targetBooking.clientName.toLowerCase() ||
            c.phone === targetBooking.clientPhone
          ) {
            const timeTag = new Date().toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
            });
            const entryHeader = `[${targetBooking.ritualName} - ${timeTag}]`;
            const cleanNotes = c.customNotes
              ? `${c.customNotes}\n• ${entryHeader}: ${notes.trim()}`
              : `• ${entryHeader}: ${notes.trim()}`;
            return {
              ...c,
              customNotes: cleanNotes,
            };
          }
          return c;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      {/* Header with Panchang & Quick Metrics */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        metrics={{
          ceremoniesToday,
          dakshinaToday,
          samagriStagedPercent,
          activeClientsCount,
        }}
        currentUser={currentUser}
        googleToken={googleToken}
        onGoogleLogin={handleGoogleLogin}
        onGoogleLogout={handleGoogleLogout}
        chatSpaces={chatSpaces}
        selectedChatSpace={selectedChatSpace}
        onSelectChatSpace={setSelectedChatSpace}
        onOpenExportModal={() => setExportModalOpen(true)}
        onOpenShareQrModal={() => setIsShareQrModalOpen(true)}
        onShowToast={showToast}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Persona 1: Family & Devotee Portal */}
        {currentTab === 'family' && (
          <FamilyPortal
            activeBookings={bookings}
            onBookCeremony={handleBookingCreated}
            onShowToast={showToast}
            onOpenPaymentModal={(booking) => {
              setCurrentTab('standee');
              showToast('UPI Dakshina Terminal Active', `Select UPI App to fulfill ₹${booking.dakshinaTotal}.`, 'info');
            }}
            onOpenWhatsAppModal={(clientName, phone, occasion, customText) => {
              setWhatsAppModalData({
                isOpen: true,
                clientName,
                phone,
                occasion,
                messageText:
                  customText ||
                  `Namaskara ${clientName} ji, sending auspicious blessings for your upcoming ${occasion}. Purohit OS has verified the Shubh Muhurat and D-1 Samagri Kit.`,
              });
            }}
          />
        )}

        {/* Persona 2: Purohit Mobile OS - Unified 2-Column Cockpit */}
        {currentTab === 'purohit' && (
          <PurohitMobileOS
            bookings={bookings}
            leads={leads}
            clients={clients}
            onAcceptLead={handleAcceptLead}
            onReferLead={handleReferLead}
            onOpenWhatsAppModal={(clientName, phone, occasion, customText) => {
              setWhatsAppModalData({
                isOpen: true,
                clientName,
                phone,
                occasion,
                messageText:
                  customText ||
                  `Namaskara ${clientName} ji, sending auspicious blessings for your upcoming ${occasion}. Purohit OS has verified the Shubh Muhurat and D-1 Samagri Kit.`,
              });
            }}
            onOpenDossierModal={(booking) => setActiveDossierBooking(booking)}
            onOpenRiderModal={(booking) => setActiveRiderBooking(booking)}
            onOpenHomaSafetyModal={(booking) => setActiveHomaSafetyBooking(booking)}
            onOpenPaymentModal={(booking) => {
              setCurrentTab('standee');
              showToast('UPI Dakshina Terminal Active', `Ready to collect ₹${booking.dakshinaTotal} from ${booking.clientName}.`, 'info');
            }}
            onShowToast={showToast}
            onOpenShareQrModal={() => setIsShareQrModalOpen(true)}
            onTriggerEmergencyBackup={handleTriggerEmergencyBackup}
            onBookingCreated={handleBookingCreated}
            onSendToChat={handleSendToChat}
            hasGoogleChat={Boolean(googleToken)}
          />
        )}

        {/* Persona 3: Platform Aggregator Hub & Logistics Command */}
        {currentTab === 'aggregator' && (
          <AggregatorDesk
            inventory={inventory}
            bookings={bookings}
            onShowToast={showToast}
            onSendToChat={handleSendToChat}
            hasGoogleChat={Boolean(googleToken)}
          />
        )}

        {/* Hardware Counter Terminal: Digital Standee & UPI Soundbox */}
        {currentTab === 'standee' && (
          <DigitalStandee
            onShowToast={showToast}
            onSendToChat={handleSendToChat}
            hasGoogleChat={Boolean(googleToken)}
          />
        )}
      </main>

      {/* Sacred Footer */}
      <footer className="mt-12 bg-white border-t border-amber-200/80 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🕉️</span>
            <span className="font-serif font-black text-neutral-800">
              PUROHIT OS &amp; FAMILY RITUAL COMPANION
            </span>
            <span className="text-neutral-300">•</span>
            <span>Bengaluru Vedic Hub Chapter</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-600">
            <span>D-1 Samagri Guarantee</span>
            <span>•</span>
            <span>Zero-MDR UPI</span>
            <span>•</span>
            <span>Google Chat Synchronized</span>
            <span>•</span>
            <button
              onClick={() => setExportModalOpen(true)}
              className="text-[#D9381E] font-bold hover:underline"
            >
              Export Standalone HTML
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <RiderTrackingModal
        booking={activeRiderBooking}
        onClose={() => setActiveRiderBooking(null)}
        onShowToast={showToast}
      />

      <DossierModal
        booking={activeDossierBooking}
        onClose={() => setActiveDossierBooking(null)}
        onShowToast={showToast}
        onSaveFieldNotes={handleSaveFieldNotes}
      />

      <HomaSafetyModal
        booking={activeHomaSafetyBooking}
        onClose={() => setActiveHomaSafetyBooking(null)}
        onShowToast={showToast}
      />

      <WhatsAppModal
        isOpen={whatsAppData.isOpen}
        onClose={() => setWhatsAppModalData((prev) => ({ ...prev, isOpen: false }))}
        clientName={whatsAppData.clientName}
        phone={whatsAppData.phone}
        occasion={whatsAppData.occasion}
        messageText={whatsAppData.messageText}
        onShowToast={showToast}
      />

      <GoogleChatModal
        isOpen={googleChatModalData.isOpen}
        onClose={() => setGoogleChatModalData({ isOpen: false, defaultMessage: '' })}
        spaces={chatSpaces}
        selectedSpace={selectedChatSpace}
        onSelectSpace={setSelectedChatSpace}
        defaultMessage={googleChatModalData.defaultMessage}
        onSend={async (space, message) => {
          if (googleToken) {
            await sendChatMessage(googleToken, space, message);
            showToast('Google Chat Broadcasted! 💬', 'Message dispatched to selected space.', 'success');
          } else {
            showToast('Simulation Broadcasted 💬', 'Google Chat message delivered in simulation mode.', 'info');
          }
          setGoogleChatModalData({ isOpen: false, defaultMessage: '' });
        }}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onShowToast={showToast}
      />

      <ShareAppQrModal
        isOpen={isShareQrModalOpen}
        onClose={() => setIsShareQrModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
