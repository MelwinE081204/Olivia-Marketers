import React, { useState } from 'react';
import { useRewards } from '../../context/RewardsContext';
import { useAuth } from '../../context/AuthContext';
import { CashClaimVoucher } from '../../types';
import { OfflineCashClaimModal } from './OfflineCashClaimModal';
import { VoucherReceiptView } from './VoucherReceiptView';
import {
  Banknote,
  Plus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Building2,
  Lock,
} from 'lucide-react';

export const ContractorClaimsList: React.FC = () => {
  const { vouchers } = useRewards();
  const { currentUser } = useAuth();
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<CashClaimVoucher | null>(null);

  const contractorVouchers = currentUser
    ? vouchers.filter((v) => v.contractorId === currentUser.id)
    : [];

  const getStatusBadge = (status: CashClaimVoucher['status']) => {
    switch (status) {
      case 'DISBURSED':
        return {
          label: 'Cash Paid Out',
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
      case 'READY_FOR_CASH':
        return {
          label: 'Ready for Collection',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse',
        };
      case 'VERIFIED':
        return {
          label: 'Depot Verified',
          color: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        };
      case 'REJECTED':
        return {
          label: 'Voided',
          color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        };
      default:
        return {
          label: 'Pending Verification',
          color: 'bg-slate-700/50 text-slate-300 border-slate-600',
        };
    }
  };

  return (
    <div className="pb-8 pt-1 px-3 sm:px-4 w-full space-y-4">
      {/* Header & CTA */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Banknote className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Offline Cash Claims</h2>
            <p className="text-[11px] text-slate-400">Authorized cash tokens for counter pickup</p>
          </div>
        </div>

        <button
          onClick={() => setIsClaimOpen(true)}
          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> New Claim
        </button>
      </div>

      {/* Vouchers List */}
      <div className="space-y-3">
        {contractorVouchers.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
            <Banknote className="w-10 h-10 text-slate-600 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-white">No Cash Claims Generated Yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Convert your Olivia Points into physical cash vouchers to claim at any authorized merchant depot counter.
              </p>
            </div>
            <button
              onClick={() => setIsClaimOpen(true)}
              className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md"
            >
              Generate First Cash Voucher
            </button>
          </div>
        ) : (
          contractorVouchers.map((voucher) => {
            const badge = getStatusBadge(voucher.status);
            return (
              <div
                key={voucher.id}
                onClick={() => setSelectedVoucher(voucher)}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer active:scale-[0.99] space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white tracking-wide">
                        {voucher.claimToken}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" /> {voucher.depotName}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-amber-300 font-mono-nums">
                      ₹{voucher.cashAmount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {voucher.pointsRedeemed.toLocaleString()} pts
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>PIN: <strong className="text-amber-300">{voucher.securityPin}</strong></span>
                  </div>
                  <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                    View QR Slip <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <OfflineCashClaimModal isOpen={isClaimOpen} onClose={() => setIsClaimOpen(false)} />
      {selectedVoucher && (
        <VoucherReceiptView voucher={selectedVoucher} onClose={() => setSelectedVoucher(null)} />
      )}
    </div>
  );
};
