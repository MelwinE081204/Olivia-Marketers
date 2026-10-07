import React, { useState } from 'react';
import { useRewards } from '../../context/RewardsContext';
import { useAuth } from '../../context/AuthContext';
import { CashClaimVoucher } from '../../types';
import { VoucherReceiptView } from '../user/VoucherReceiptView';
import {
  ShieldCheck,
  Banknote,
  Coins,
  Users,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Store,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const {
    vouchers,
    totalCashClaimedOverall,
    totalPointsIssuedOverall,
    pendingCashClaimsCount,
    verifyClaimByAdmin,
    disburseCashByAdmin,
  } = useRewards();
  const { allUsers } = useAuth();

  const [searchToken, setSearchToken] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<CashClaimVoucher | null>(null);
  const [quickActionNotice, setQuickActionNotice] = useState<string | null>(null);

  const contractorsCount = allUsers.filter((u) => u.role === 'contractor').length;
  const merchantsCount = allUsers.filter((u) => u.role === 'merchant').length;

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchToken.trim()) return;
    const clean = searchToken.trim().toUpperCase();
    const found = vouchers.find(
      (v) => v.claimToken.toUpperCase() === clean || v.securityPin === clean
    );
    if (found) {
      setSelectedVoucher(found);
      setSearchToken('');
    } else {
      setQuickActionNotice(`No voucher found matching "${searchToken}".`);
      setTimeout(() => setQuickActionNotice(null), 3000);
    }
  };

  const pendingVouchers = vouchers.filter(
    (v) => v.status === 'SUBMITTED' || v.status === 'READY_FOR_CASH'
  );

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-4">
      {/* Admin Executive Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold block">
                ADMIN CONSOLE
              </span>
              <h2 className="text-base font-black text-white tracking-tight">
                Olivia Regional Operations
              </h2>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Live Reconciliation
          </span>
        </div>

        {/* Counter Quick Lookup Input (Scan or Token) */}
        <form onSubmit={handleQuickLookup} className="relative pt-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchToken}
            onChange={(e) => setSearchToken(e.target.value)}
            placeholder="Scan / Type Token (e.g. OLV-CASH-7842)..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-24 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
          >
            Verify
          </button>
        </form>

        {quickActionNotice && (
          <div className="text-[11px] text-amber-300 bg-amber-950/80 p-2 rounded-lg border border-amber-500/30">
            {quickActionNotice}
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Banknote className="w-4 h-4 text-emerald-400" /> Offline Cash Disbursed
          </div>
          <div className="text-xl font-black text-white font-mono-nums">
            ₹{totalCashClaimedOverall.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">100% reconciled</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="w-4 h-4 text-amber-400" /> Pending Counter Claims
          </div>
          <div className="text-xl font-black text-amber-300 font-mono-nums">
            {pendingCashClaimsCount}
          </div>
          <span className="text-[10px] text-slate-400">Awaiting cashier action</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Coins className="w-4 h-4 text-sky-400" /> Total Points Issued
          </div>
          <div className="text-xl font-black text-white font-mono-nums">
            {totalPointsIssuedOverall.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">From stock scans</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Users className="w-4 h-4 text-purple-400" /> Network Footprint
          </div>
          <div className="text-xl font-black text-white font-mono-nums">
            {contractorsCount + merchantsCount}
          </div>
          <span className="text-[10px] text-slate-400">
            {contractorsCount} Contractors · {merchantsCount} Merchants
          </span>
        </div>
      </div>

      {/* Operational Action Short-links */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onNavigateTab('claims')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Claims Queue</span>
              <span className="text-[10px] text-slate-400">{pendingCashClaimsCount} waiting</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => onNavigateTab('audit')}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Stock Audit</span>
              <span className="text-[10px] text-slate-400">Inward verification</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Pending Counter Claims Queue Snapshot */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Active Claim Approvals ({pendingVouchers.length})
          </h3>
          <button
            onClick={() => onNavigateTab('claims')}
            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            Manage All <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {pendingVouchers.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-xs bg-slate-950/60 rounded-xl">
              No pending claims. All contractor vouchers have been settled.
            </div>
          ) : (
            pendingVouchers.slice(0, 3).map((voucher) => (
              <div
                key={voucher.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {voucher.claimToken}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {voucher.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      {voucher.contractorName} ({voucher.contractorPhone})
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-amber-300 font-mono-nums">
                      ₹{voucher.cashAmount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">PIN: {voucher.securityPin}</span>
                  </div>
                </div>

                {/* Direct 1-tap actions */}
                <div className="flex items-center gap-2 pt-1">
                  {voucher.status === 'SUBMITTED' && (
                    <button
                      onClick={() => verifyClaimByAdmin(voucher.id)}
                      className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                    >
                      Authorize Depot Pickup
                    </button>
                  )}
                  {voucher.status === 'READY_FOR_CASH' && (
                    <button
                      onClick={() => disburseCashByAdmin(voucher.id)}
                      className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                    >
                      Disburse Physical Cash (₹{voucher.cashAmount})
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedVoucher(voucher)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                  >
                    View Slip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedVoucher && (
        <VoucherReceiptView
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}
    </div>
  );
};
