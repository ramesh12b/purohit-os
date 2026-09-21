import React, { useState } from 'react';
import { InventoryItem, RitualBooking } from '../types';
import {
  Truck,
  Package,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  MapPin,
  Clock,
  Send,
  Sparkles,
  Phone,
  Plus,
} from 'lucide-react';

interface SuperAdminLogisticsProps {
  inventory: InventoryItem[];
  bookings: RitualBooking[];
  onShowToast: (title: string, description: string, type?: 'success' | 'info' | 'warning') => void;
  onSendToChat?: (text: string) => void;
  hasGoogleChat: boolean;
}

export const SuperAdminLogistics: React.FC<SuperAdminLogisticsProps> = ({
  inventory,
  bookings,
  onShowToast,
  onSendToChat,
  hasGoogleChat,
}) => {
  const [selectedHub, setSelectedHub] = useState<string>('All Hubs');
  const [items, setItems] = useState<InventoryItem[]>(inventory);

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

    onShowToast('Inventory Replenished! 📦', 'Fresh batch added to regional hub stock.', 'success');
  };

  const handleTriggerEmergencyCourier = (bookingId: string) => {
    onShowToast(
      'Express Samagri Van Dispatched! 🚀',
      `Emergency backup kit dispatched for booking #${bookingId}. Priority siren route.`,
      'info'
    );

    if (hasGoogleChat && onSendToChat) {
      onSendToChat(
        `🚨 [SAMAGRI EMERGENCY DISPATCH]\n• Incident: Missing item replacement\n• Target Booking: #${bookingId}\n• Status: Express Courier assigned (Indiranagar Hub)\n• Target Delivery: < 20 mins`
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#D9381E] text-white text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Module 4
              </span>
              <h2 className="text-xl font-black text-neutral-900 font-serif">
                SuperAdmin &amp; D-1 Samagri Logistics Command
              </h2>
            </div>
            <p className="text-xs text-neutral-600 mt-0.5">
              The anti-failure logistics engine: zero same-day ritual cancellations. 100% of samagri kits verified, barcoded, and staged on D-1.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-lg border border-emerald-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              D-1 Assurance SLA: 99.8%
            </span>
          </div>
        </div>

        {/* Hub Selector */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <span className="text-neutral-500 shrink-0">Warehouse Hubs:</span>
          {['All Hubs', 'Whitefield Hub', 'Indiranagar Hub', 'Koramangala Hub', 'Jayanagar Hub'].map((hub) => (
            <button
              key={hub}
              onClick={() => setSelectedHub(hub)}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                selectedHub === hub
                  ? 'bg-[#D9381E] text-white shadow-xs font-black'
                  : 'bg-amber-50 hover:bg-amber-100 text-neutral-700'
              }`}
            >
              {hub}
            </button>
          ))}
        </div>
      </div>

      {/* D-1 Dispatch Staging Board */}
      <section className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 md:p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
          <div>
            <h3 className="text-lg font-black text-neutral-900 font-serif flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#D9381E]" />
              D-1 Samagri Dispatch Tracking (Today's Staged Batches)
            </h3>
            <p className="text-xs text-neutral-600">
              Live transit status of verified ritual kits across Bengaluru corridors.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-neutral-500">
            Auto-Sync: Every 30s
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#FAF6F0] rounded-xl border border-amber-200 p-4 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-200 text-neutral-600">
                    {b.id}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      b.samagriStatus === 'Delivered D-1'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-orange-100 text-orange-900 animate-pulse'
                    }`}
                  >
                    {b.samagriStatus}
                  </span>
                </div>

                <h4 className="text-sm font-black text-neutral-900 font-serif leading-snug">
                  {b.ritualName}
                </h4>

                <p className="text-xs text-neutral-600">
                  <strong>{b.clientName}</strong> • {b.locality}
                </p>

                <div className="text-[11px] text-neutral-600 bg-white p-2 rounded border border-amber-100 space-y-1">
                  <p className="font-bold text-neutral-900">{b.samagriKitName}</p>
                  <p className="flex items-center gap-1 text-neutral-500">
                    <Clock className="w-3 h-3 text-[#D9381E]" />
                    Ritual: {b.timeSlot}
                  </p>
                  {b.riderInfo && (
                    <p className="text-blue-800 font-semibold flex items-center justify-between">
                      <span>Rider: {b.riderInfo.name}</span>
                      <span>ETA: {b.riderInfo.etaMinutes === 0 ? 'Delivered' : `${b.riderInfo.etaMinutes}m`}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200/60">
                {b.samagriStatus !== 'Delivered D-1' ? (
                  <button
                    onClick={() => handleTriggerEmergencyCourier(b.id)}
                    className="w-full py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Dispatch Backup Van
                  </button>
                ) : (
                  <div className="text-center text-[11px] font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded border border-emerald-200 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    D-1 Verified &amp; Signed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regional Warehouse Raw Inventory Levels */}
      <section className="bg-white rounded-2xl border border-amber-200/80 shadow-sm p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-100">
          <div>
            <h3 className="text-lg font-black text-neutral-900 font-serif flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D9381E]" />
              Sacred Samagri Live Stock &amp; Batch Traceability
            </h3>
            <p className="text-xs text-neutral-600">
              Grade-A verified holy materials (Cow Ghee, Samidha, 108 herbs, Navadhanya).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Item Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Warehouse Hub</th>
                <th className="pb-3">Current Stock</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-3 pl-2 font-bold text-neutral-900">{item.name}</td>
                  <td className="py-3 text-neutral-600">{item.category}</td>
                  <td className="py-3 text-neutral-700">{item.hub}</td>
                  <td className="py-3 font-mono font-bold text-neutral-900">
                    {item.stockLevel} {item.unit}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.status === 'In Stock'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Low Stock'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800 animate-pulse'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <button
                      onClick={() => handleRestock(item.id)}
                      className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold inline-flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3 text-[#D9381E]" />
                      Restock +25
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
