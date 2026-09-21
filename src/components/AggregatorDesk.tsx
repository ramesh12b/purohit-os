import React, { useState } from 'react';
import { RitualBooking } from '../types';
import {
  Clock,
  ShieldCheck,
  Truck,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  UserCheck,
  ChevronRight,
  Plus,
  RefreshCw,
  Send,
  Building,
  Check,
  Layers,
  MapPin,
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'herb' | 'ghee' | 'wood' | 'cloth' | 'grains';
  stockLevel: number;
  unit: string;
  hub: string;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Certified A2 Gir Cow Ghee (Bilona Churned)', category: 'ghee', stockLevel: 45, unit: 'kg', hub: 'Indiranagar Hub', status: 'In Stock' },
  { id: 'inv-2', name: 'Dry Wild Mango Samidha Wood', category: 'wood', stockLevel: 180, unit: 'kg', hub: 'Indiranagar Hub', status: 'In Stock' },
  { id: 'inv-3', name: '108 Auspicious Rare Homa Herbs Box', category: 'herb', stockLevel: 12, unit: 'kits', hub: 'Whitefield Hub', status: 'Low Stock' },
  { id: 'inv-4', name: 'Bhimseni Pure Low-Smoke Camphor', category: 'herb', stockLevel: 65, unit: 'boxes', hub: 'Koramangala Hub', status: 'In Stock' },
  { id: 'inv-5', name: 'Navadhanya Nine Sacred Grains Set', category: 'grains', stockLevel: 38, unit: 'sets', hub: 'Indiranagar Hub', status: 'In Stock' },
  { id: 'inv-6', name: 'Pure Unbleached Cotton Yajnopavita & Wicks', category: 'cloth', stockLevel: 8, unit: 'packs', hub: 'Jayanagar Hub', status: 'Low Stock' },
];

const PUROHIT_ROSTER = [
  {
    id: 'p-01',
    name: 'Pandit Vidyadhar Shastri',
    veda: 'Rigveda (Sakala Shakha)',
    experienceYears: 14,
    status: 'On Ceremony Duty',
    currentLocation: 'Sobha Dream Acres, Panathur',
    hub: 'Whitefield Hub',
    rating: 4.98,
    completedRituals: 342,
  },
  {
    id: 'p-02',
    name: 'Pt. Raghavendra Bhat',
    veda: 'Krishna Yajurveda (Taittiriya)',
    experienceYears: 18,
    status: 'Available / Standby',
    currentLocation: 'Indiranagar Vedic Patashala',
    hub: 'Indiranagar Hub',
    rating: 4.95,
    completedRituals: 512,
  },
  {
    id: 'p-03',
    name: 'Pt. Sudarshan Dikshitar',
    veda: 'Samaveda (Kauthuma Shakha)',
    experienceYears: 11,
    status: 'In Transit',
    currentLocation: 'Outer Ring Road (ETA 18 min)',
    hub: 'Koramangala Hub',
    rating: 4.92,
    completedRituals: 219,
  },
  {
    id: 'p-04',
    name: 'Pt. Ananthakrishna Somayaji',
    veda: 'Shukla Yajurveda (Kanva Shakha)',
    experienceYears: 22,
    status: 'Available / Standby',
    currentLocation: 'Jayanagar 4th Block',
    hub: 'Jayanagar Hub',
    rating: 4.99,
    completedRituals: 680,
  },
];

interface AggregatorDeskProps {
  bookings: RitualBooking[];
  inventory: InventoryItem[];
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  hasGoogleChat?: boolean;
  onSendToChat?: (message: string) => void;
}

export const AggregatorDesk: React.FC<AggregatorDeskProps> = ({
  bookings,
  inventory = DEFAULT_INVENTORY,
  onShowToast,
  hasGoogleChat,
  onSendToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'live_sla' | 'payouts' | 'samagri_hubs' | 'purohit_roster'>('live_sla');
  const [selectedHub, setSelectedHub] = useState<string>('All Hubs');
  const [items, setItems] = useState<InventoryItem[]>(inventory);
  const [settledPayouts, setSettledPayouts] = useState<Record<string, boolean>>({ 'bk-01': true });

  const totalGrossDakshina = bookings.reduce((acc, b) => acc + b.dakshinaTotal, 0);
  const priestShareTotal = Math.round(totalGrossDakshina * 0.8);
  const samagriShareTotal = Math.round(totalGrossDakshina * 0.15);
  const platformShareTotal = Math.round(totalGrossDakshina * 0.05);

  const filteredInventory = items.filter((item) => {
    if (selectedHub === 'All Hubs') return true;
    return item.hub === selectedHub;
  });

  const handleRestock = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          return {
            ...i,
            stockLevel: i.stockLevel + 25,
            status: 'In Stock',
          };
        }
        return i;
      })
    );
    onShowToast('Stock Replenished 📦', 'Fresh batch of Vedic herbs added to regional hub inventory.', 'success');
  };

  const handleDispatchEmergencyVan = (bookingId: string) => {
    onShowToast(
      'Emergency Van Dispatched 🚀',
      `Backup kit dispatched with priority courier for Booking #${bookingId}. ETA < 25 mins.`,
      'info'
    );

    if (hasGoogleChat && onSendToChat) {
      onSendToChat(
        `🚨 [AGGREGATOR EMERGENCY COURIER]\n• Action: Express Samagri Van Dispatched\n• Booking: #${bookingId}\n• Origin: Regional Hub\n• SLA Target: Within Muhurat window (< 25 min)`
      );
    }
  };

  const handleSettlePayout = (bookingId: string, priestName: string, amount: number) => {
    setSettledPayouts((prev) => ({ ...prev, [bookingId]: true }));
    onShowToast(
      'Priest Payout Settled 💸',
      `₹${amount} instantly transferred via direct IMPS/UPI to ${priestName}. Digital receipt generated.`,
      'success'
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Aggregator Command Banner */}
      <div className="bg-stone-900 rounded-2xl sm:rounded-3xl text-white p-5 sm:p-7 border border-stone-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-xl sm:text-2xl">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white">
                  Aggregator Operations Desk
                </h2>
                <span className="bg-stone-800 text-stone-300 text-[10px] font-bold px-2 py-0.5 rounded border border-stone-700 uppercase">
                  City Command
                </span>
              </div>
              <p className="text-xs text-stone-400">
                City-Wide Ritual SLA Radar • 80/15/5 Split Engine • Samagri Logistics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Muhurat SLA: 99.8%</span>
            </span>
          </div>
        </div>

        {/* 4 Financial & Operational Metric Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-stone-800">
          <div className="bg-stone-800/70 p-3 rounded-xl border border-stone-700/80">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">City Gross Dakshina</span>
            <span className="text-base sm:text-lg font-mono font-bold text-white">₹{totalGrossDakshina.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">{bookings.length} active ceremonies</span>
          </div>

          <div className="bg-stone-800/70 p-3 rounded-xl border border-stone-700/80">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Priest Share (80%)</span>
            <span className="text-base sm:text-lg font-mono font-bold text-amber-300">₹{priestShareTotal.toLocaleString()}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Direct to scholars</span>
          </div>

          <div className="bg-stone-800/70 p-3 rounded-xl border border-stone-700/80">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Samagri Hubs (15%)</span>
            <span className="text-base sm:text-lg font-mono font-bold text-emerald-300">₹{samagriShareTotal.toLocaleString()}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Herbs &amp; pure ghee</span>
          </div>

          <div className="bg-stone-800/70 p-3 rounded-xl border border-stone-700/80">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Platform Take (5%)</span>
            <span className="text-base sm:text-lg font-mono font-bold text-stone-200">₹{platformShareTotal.toLocaleString()}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">Tech &amp; SLA guarantee</span>
          </div>
        </div>

        {/* Sub-Navigation Pill Bar */}
        <div className="flex gap-1.5 sm:gap-2 pt-2 border-t border-stone-800 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('live_sla')}
            id="agg-tab-sla"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all touch-target ${
              activeTab === 'live_sla'
                ? 'bg-stone-100 text-stone-950 font-bold shadow-xs'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Muhurat SLA Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            id="agg-tab-payouts"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all touch-target ${
              activeTab === 'payouts'
                ? 'bg-stone-100 text-stone-950 font-bold shadow-xs'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>80/15/5 Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('samagri_hubs')}
            id="agg-tab-hubs"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all touch-target ${
              activeTab === 'samagri_hubs'
                ? 'bg-stone-100 text-stone-950 font-bold shadow-xs'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Samagri Hubs</span>
          </button>

          <button
            onClick={() => setActiveTab('purohit_roster')}
            id="agg-tab-roster"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all touch-target ${
              activeTab === 'purohit_roster'
                ? 'bg-stone-100 text-stone-950 font-bold shadow-xs'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Priest Roster</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MUHURAT SLA RADAR */}
      {activeTab === 'live_sla' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C2341D]" />
                Live Muhurat SLA &amp; On-Duty Priest Radar
              </h3>
              <p className="text-xs text-stone-500">
                Active tracking of priest arrival ETAs, D-1 samagri kit verification, and automated standby dispatch.
              </p>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full shrink-0">
              Zero Cancellations Guaranteed
            </span>
          </div>

          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-stone-200 text-stone-900 px-2 py-0.5 rounded">
                        #{booking.id.toUpperCase()}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm">{booking.ritualName}</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Readiness: {booking.readiness.score}/5 ★
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Devotee: <strong>{booking.clientName}</strong> ({booking.clientPhone}) • {booking.locality}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono font-bold text-stone-900 block">
                      {booking.timeSlot}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      Samagri: {booking.samagriStatus}
                    </span>
                  </div>
                </div>

                {/* 5-Point Health Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-stone-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>D-1 Samagri</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Muhurat Aligned</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Advance Paid</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Route Verified</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-stone-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Homa Safety</span>
                  </div>
                </div>

                {/* Operational Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-200 text-xs">
                  <span className="text-stone-500">
                    Rider: <strong>{booking.riderInfo?.name || 'Assigned Indiranagar Hub'}</strong>
                  </span>
                  <button
                    onClick={() => handleDispatchEmergencyVan(booking.id)}
                    className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors touch-target"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch Backup Courier</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: REVENUE & PAYOUT ENGINE (80/15/5 SPLIT) */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Automated 80 / 15 / 5 Dakshina Settlement Ledger
              </h3>
              <p className="text-xs text-stone-500">
                Real-time escrow release. Acharya honorarium (80%), Samagri hub vendor (15%), Platform guarantee (5%).
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full shrink-0">
              Instant Direct Payouts
            </span>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-3 sm:hidden">
            {bookings.map((b) => {
              const priestShare = Math.round(b.dakshinaTotal * 0.8);
              const isSettled = settledPayouts[b.id];

              return (
                <div key={b.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-stone-500">#{b.id}</span>
                      <h4 className="font-bold text-stone-900 text-xs">{b.ritualName}</h4>
                      <p className="text-xs text-stone-600 mt-0.5">{b.clientName}</p>
                    </div>
                    <span className="font-mono font-bold text-stone-900 text-sm">₹{b.dakshinaTotal}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                    <div className="p-2 bg-white rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">Priest (80%)</span>
                      <span className="font-mono font-bold text-amber-900">₹{priestShare}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">Hub (15%)</span>
                      <span className="font-mono font-semibold text-emerald-800">₹{Math.round(b.dakshinaTotal * 0.15)}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-500 block">Platform</span>
                      <span className="font-mono font-semibold text-stone-700">₹{Math.round(b.dakshinaTotal * 0.05)}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    {isSettled ? (
                      <div className="w-full py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Settled via Direct IMPS</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSettlePayout(b.id, 'Pandit Vidyadhar Shastri', priestShare)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs touch-target flex items-center justify-center gap-1"
                      >
                        <span>Release ₹{priestShare} to Priest</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3">Booking / Ritual</th>
                  <th className="p-3">Devotee</th>
                  <th className="p-3">Gross Dakshina</th>
                  <th className="p-3 text-amber-900">Priest 80%</th>
                  <th className="p-3 text-emerald-800">Samagri 15%</th>
                  <th className="p-3 text-stone-700">Platform 5%</th>
                  <th className="p-3 text-right">Settlement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bookings.map((b) => {
                  const priestShare = Math.round(b.dakshinaTotal * 0.8);
                  const samagriShare = Math.round(b.dakshinaTotal * 0.15);
                  const platformShare = Math.round(b.dakshinaTotal * 0.05);
                  const isSettled = settledPayouts[b.id];

                  return (
                    <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="p-3">
                        <span className="font-mono text-[10px] text-stone-500 block">#{b.id}</span>
                        <strong className="text-stone-900">{b.ritualName}</strong>
                      </td>
                      <td className="p-3 text-stone-700">{b.clientName}</td>
                      <td className="p-3 font-mono font-bold text-stone-900">₹{b.dakshinaTotal}</td>
                      <td className="p-3 font-mono font-bold text-amber-900">₹{priestShare}</td>
                      <td className="p-3 font-mono font-semibold text-emerald-800">₹{samagriShare}</td>
                      <td className="p-3 font-mono font-semibold text-stone-700">₹{platformShare}</td>
                      <td className="p-3 text-right">
                        {isSettled ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <Check className="w-3 h-3" />
                            Settled via IMPS
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSettlePayout(b.id, 'Pandit Vidyadhar Shastri', priestShare)}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-2xs touch-target"
                          >
                            Release ₹{priestShare}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGIONAL SAMAGRI HUBS */}
      {activeTab === 'samagri_hubs' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C2341D]" />
                Regional Vedic Herbs &amp; Ghee Fulfillment Hubs
              </h3>
              <p className="text-xs text-stone-500">
                Staged inventory ensuring no missing items on ceremony morning.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-stone-300 bg-white"
              >
                <option>All Hubs</option>
                <option>Indiranagar Hub</option>
                <option>Whitefield Hub</option>
                <option>Koramangala Hub</option>
                <option>Jayanagar Hub</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-stone-900 text-xs">{item.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        item.status === 'In Stock'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Hub: <strong>{item.hub}</strong> • Category: {item.category}
                  </p>
                  <p className="text-xs font-mono font-bold text-stone-800 mt-1">
                    Available: {item.stockLevel} {item.unit}
                  </p>
                </div>

                <button
                  onClick={() => handleRestock(item.id)}
                  className="px-3 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-xs font-bold text-stone-700 shadow-2xs flex items-center gap-1 shrink-0 touch-target"
                >
                  <Plus className="w-3 h-3" />
                  <span>Restock</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PUROHIT ROSTER & LINEAGE */}
      {activeTab === 'purohit_roster' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#C2341D]" />
                Verified Vedic Scholar Directory &amp; Lineage
              </h3>
              <p className="text-xs text-stone-500">
                Patashala certifications, tradition specialization, and active duty radar.
              </p>
            </div>
            <span className="text-xs font-bold bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full">
              {PUROHIT_ROSTER.length} Certified Scholars
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PUROHIT_ROSTER.map((priest) => (
              <div
                key={priest.id}
                className="p-4 rounded-xl border border-stone-200 bg-[#FFFDF9] hover:border-amber-300 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <span>{priest.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        ★ {priest.rating}
                      </span>
                    </h4>
                    <p className="text-xs text-[#C2341D] font-medium">
                      {priest.veda} • {priest.experienceYears} Years Exp
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      priest.status === 'On Ceremony Duty'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {priest.status}
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-0.5 pt-1">
                  <p>📍 Location: {priest.currentLocation}</p>
                  <p>🏛️ Base Hub: {priest.hub}</p>
                  <p className="font-mono text-[11px] text-stone-500">
                    Completed Ceremonies: <strong>{priest.completedRituals}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
