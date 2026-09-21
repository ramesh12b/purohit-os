export interface RitualItem {
  id: string;
  name: string;
  category: 'herb' | 'wood' | 'ghee' | 'cloth' | 'flower' | 'vessel' | 'grains';
  quantity: string;
  verified: boolean;
}

export interface RitualReadinessScore {
  score: number; // out of 5
  samagriVerifiedD1: boolean;
  muhuratConfirmed: boolean;
  advancePaid: boolean;
  venueAndDirectionsReady: boolean;
  homaSafetyConfirmed: boolean;
}

export interface RitualBooking {
  id: string;
  ritualName: string;
  clientName: string;
  clientPhone: string;
  gotra: string;
  nakshatra?: string;
  veda?: string;
  address: string;
  locality: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  dakshinaTotal: number;
  advancePaid: number;
  paymentStatus: 'paid' | 'advance_paid' | 'pending';
  samagriStatus: 'Delivered D-1' | 'Staged with Priest' | 'Express Courier' | 'Assigned to Rider';
  readiness: RitualReadinessScore;
  specialNotes?: string;
  fieldNotes?: string;
  samagriKitName: string;
  samagriItems: RitualItem[];
  createdVia?: 'voice_ai' | 'family_app' | 'marketplace' | 'manual';
  riderInfo?: {
    name: string;
    phone: string;
    currentLocation: string;
    etaMinutes: number;
    kitVerified: boolean;
  };
}

export interface LeadInquiry {
  id: string;
  clientName: string;
  ritualName: string;
  date: string;
  muhuratTime: string;
  locality: string;
  tradition: string; // e.g., 'Smartha Vedic', 'Madhva Tradition', 'Vaishnava', 'North Indian Vedic'
  language: string;
  guestCount: number;
  estimatedDakshina: number;
  distanceKm: number;
  isVerifiedCustomer: boolean;
  urgency: 'high' | 'normal';
}

export interface FamilyClient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gotra: string;
  veda: string;
  sutra?: string;
  kulaDevata?: string;
  address: string;
  pastRitualsCount: number;
  lastRitualDate: string;
  upcomingImportantDate: string;
  upcomingEventTitle: string;
  customNotes: string;
  vip: boolean;
  needsFollowup: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  unit: string;
  hub: 'Indiranagar Hub' | 'Whitefield Hub' | 'Koramangala Hub' | 'Jayanagar Hub';
  status: 'In Stock' | 'Low Stock' | 'Critical';
  expiryDate?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'info' | 'warning';
}

export type PersonaRole = 'family' | 'purohit' | 'aggregator';
export type FamilySubView = 'my_ceremonies' | 'book_ceremony' | 'family_prep_guide' | 'live_mantra_guide';
export type PurohitSubView = 'today_agenda' | 'leads_pipeline' | 'family_crm' | 'dakshina_terminal';
export type AggregatorSubView = 'live_sla_radar' | 'dispatch_purohits' | 'samagri_hubs' | 'revenue_payouts';

export type TabMode = 'family' | 'purohit' | 'aggregator' | 'standee';

export interface GoogleChatSpace {
  name: string;
  displayName: string;
  type: string;
}
