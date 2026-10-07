import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  QrCode,
  Banknote,
  ReceiptText,
  PackageSearch,
  LayoutDashboard,
  ClipboardCheck,
  FileCheck2,
  Barcode,
  BarChart3,
  Store,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pendingClaimsBadge?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingClaimsBadge = 0,
}) => {
  const { role } = useAuth();

  const getTabs = () => {
    if (role === 'admin') {
      return [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'claims', label: 'Claims Queue', icon: ClipboardCheck, badge: pendingClaimsBadge },
        { id: 'audit', label: 'Stock Audit', icon: FileCheck2 },
        { id: 'batches', label: 'QR Batches', icon: Barcode },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ];
    }
    if (role === 'merchant') {
      return [
        { id: 'merchant_home', label: 'Counter', icon: Store },
        { id: 'merchant_issue', label: 'Issue Points', icon: UserPlus },
        { id: 'merchant_verify', label: 'Verify Voucher', icon: ShieldAlert },
        { id: 'merchant_history', label: 'History', icon: ReceiptText },
      ];
    }
    // Contractor
    return [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'scan', label: 'Scan & Earn', icon: QrCode, highlight: true },
      { id: 'claims', label: 'Cash Claims', icon: Banknote },
      { id: 'passbook', label: 'Passbook', icon: ReceiptText },
      { id: 'catalog', label: 'Products', icon: PackageSearch },
    ];
  };

  const tabs = getTabs();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
      <div className="max-w-md mx-auto grid grid-flow-col auto-cols-fr items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isHighlight = (tab as any).highlight;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative min-h-[48px] flex flex-col items-center justify-center rounded-lg transition-all active:scale-95 ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {isHighlight ? (
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                        : 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                ) : (
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                )}

                {/* Badge if any */}
                {(tab as any).badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-md">
                    {(tab as any).badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] tracking-tight mt-1 whitespace-nowrap truncate max-w-[64px] ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {tab.label}
              </span>

              {isActive && !isHighlight && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
