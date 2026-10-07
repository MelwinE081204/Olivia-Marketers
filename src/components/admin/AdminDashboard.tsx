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
    <div className="pb-8 pt-1 px-3 sm:px-4 w-full space-y-5">
      {/* SECTION 1: RAPID VERIFICATION BAR */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Admin Cash Register
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Offline Payout Window
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 shadow-xl space-y-3">
          <div>
            <h2 className="text-base font-black text-white tracking-tight">
              Counter Token Validator
            </h2>
            <p className="text-[11px] text-slate-400">
              Enter contractor voucher token or scan barcode to verify cash release.
            </p>
          </div>

          <form onSubmit={handleQuickLookup} className="relative pt-0.5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              placeholder="e.g. OLV-CASH-7842..."
              className="w-full bg-slate-950 border border-slate-750 rounded-2xl pl-10 pr-24 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono tracking-wider"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
            >
              Verify
            </button>
          </form>

          {quickActionNotice && (
            <div className="text-[11px] text-amber-300 bg-amber-950/80 p-2.5 rounded-xl border border-amber-500/30">
              {quickActionNotice}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: EXECUTIVE RECONCILIATION METRICS */}
      <section className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 block">
          Reconciliation Overview
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Banknote className="w-4 h-4 text-emerald-400" /> Cash Disbursed
            </div>
            <div className="text-xl font-black text-white font-mono-nums">
              ₹{totalCashClaimedOverall.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold block">
              Audited & settled
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Clock className="w-4 h-4 text-amber-400" /> Pending Claims
            </div>
            <div className="text-xl font-black text-amber-300 font-mono-nums">
              {pendingCashClaimsCount}
            </div>
            <span className="text-[10px] text-slate-400 block">
              Waiting cashier action
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Coins className="w-4 h-4 text-sky-400" /> Points Minted
            </div>
            <div className="text-xl font-black text-white font-mono-nums">
              {totalPointsIssuedOverall.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 block">
              From stock purchases
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Users className="w-4 h-4 text-purple-400" /> Active Network
            </div>
            <div className="text-xl font-black text-white font-mono-nums">
              {contractorsCount + merchantsCount}
            </div>
            <span className="text-[10px] text-slate-400 block truncate">
              {contractorsCount} Cont · {merchantsCount} Merch
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3: OPERATIONAL WORKFLOWS */}
      <section className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 block">
          Operations Shortcuts
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigateTab('claims')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-all active:scale-98 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Claims Queue</span>
                <span className="text-[10px] text-slate-400">{pendingCashClaimsCount} pending</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => onNavigateTab('audit')}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left transition-all active:scale-98 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Stock Audit</span>
                <span className="text-[10px] text-slate-400">Inward review</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </section>

      {/* SECTION 4: PENDING COUNTER CLAIMS QUEUE */}
      <section className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Claims Awaiting Cashier Action
          </span>
          <button
            onClick={() => onNavigateTab('claims')}
            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5 font-semibold"
          >
            All Queue <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {pendingVouchers.length === 0 ? (
            <div className="p-5 text-center text-slate-500 text-xs bg-slate-950/60 rounded-2xl">
              All contractor cash claim vouchers have been disbursed.
            </div>
          ) : (
            pendingVouchers.slice(0, 3).map((voucher) => (
              <div
                key={voucher.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-850 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">
                        {voucher.claimToken}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {voucher.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-300 mt-1 block font-medium">
                      {voucher.contractorName} ({voucher.contractorPhone})
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-amber-300 font-mono-nums">
                      ₹{voucher.cashAmount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">PIN: {voucher.securityPin}</span>
                  </div>
                </div>

                {/* Direct 1-tap actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-850">
                  {voucher.status === 'SUBMITTED' && (
                    <button
                      onClick={() => verifyClaimByAdmin(voucher.id)}
                      className="flex-1 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      Authorize Pickup
                    </button>
                  )}
                  {voucher.status === 'READY_FOR_CASH' && (
                    <button
                      onClick={() => disburseCashByAdmin(voucher.id)}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      Hand Over ₹{voucher.cashAmount} Cash
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedVoucher(voucher)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
                  >
                    Slip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {selectedVoucher && (
        <VoucherReceiptView
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}
    </div>
  );
};
