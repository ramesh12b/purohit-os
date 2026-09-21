import React from 'react';
import { TabMode } from '../types';
import { Sparkles, QrCode, Truck, UserCheck, Calendar } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
  ceremoniesToday: number;
  activeLeadsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  ceremoniesToday,
  activeLeadsCount,
}) => {
  const navItems = [
    {
      id: 'purohit' as TabMode,
      label: 'Priest OS',
      sublabel: 'Cockpit',
      icon: (
        <span className="text-lg leading-none select-none">📿</span>
      ),
      badge: ceremoniesToday > 0 ? ceremoniesToday : undefined,
      badgeColor: 'bg-[#C2341D] text-white',
    },
    {
      id: 'family' as TabMode,
      label: 'Devotee',
      sublabel: 'Rituals',
      icon: (
        <span className="text-lg leading-none select-none">🪔</span>
      ),
      badge: undefined,
    },
    {
      id: 'aggregator' as TabMode,
      label: 'Logistics',
      sublabel: 'D-1 SLA',
      icon: <Truck className="w-5 h-5" />,
      badge: undefined,
    },
    {
      id: 'standee' as TabMode,
      label: 'UPI Desk',
      sublabel: 'Soundbox',
      icon: <QrCode className="w-5 h-5" />,
      badge: undefined,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-safe"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              id={`mobile-nav-${item.id}`}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl touch-target transition-all active:scale-95 ${
                isActive
                  ? 'text-[#C2341D] font-bold'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50/80 font-medium'
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute -top-1.5 w-8 h-1 rounded-full bg-[#C2341D]" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center w-7 h-7 mb-1">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 min-w-[18px] text-[10px] font-black rounded-full flex items-center justify-center bg-[#C2341D] text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[11px] leading-tight tracking-tight whitespace-nowrap">
                {item.label}
              </span>
              <span className={`text-[9px] leading-none ${isActive ? 'text-[#C2341D]/80' : 'text-stone-400'}`}>
                {item.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
