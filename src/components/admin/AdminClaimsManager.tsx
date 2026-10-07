import React, { useState } from 'react';
import { useRewards } from '../../context/RewardsContext';
import { CashClaimVoucher, VoucherStatus } from '../../types';
import { VoucherReceiptView } from '../user/VoucherReceiptView';
import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Banknote,
  Building2,
  Lock,
  XCircle,
  ExternalLink,
} from 'lucide-react';

export const AdminClaimsManager: React.FC = () => {
  const {
    vouchers,
    verifyClaimByAdmin,
    disburseCashByAdmin,
    rejectClaimByAdmin,
  } = useRewards();

  const [activeTab, setActiveTab] = useState<'ALL' | 'SUBMITTED' | 'READY_FOR_CASH' | 'DISBURSED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<CashClaimVoucher | null>(null);

  // Rejection modal state
  const [rejectingVoucherId, setRejectingVoucherId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Disbursal modal state
  const [disbursingVoucher, setDisbursingVoucher] = useState<CashClaimVoucher | null>(null);
  const [cashierStaffNote, setCashierStaffNote] = useState('');

  const filteredVouchers = vouchers.filter((v) => {
    if (activeTab !== 'ALL' && v.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.claimToken.toLowerCase().includes(q) ||
        v.contractorName.toLowerCase().includes(q) ||
        v.contractorPhone.includes(q) ||
        v.depotName.toLowerCase().includes(q) ||
        v.securityPin.includes(q)
      );
    }
    return true;
  });

  const getStatusStyle = (status: VoucherStatus) => {
    switch (status) {
      case 'DISBURSED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'READY_FOR_CASH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'VERIFIED':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
      case 'REJECTED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-700/60 text-slate-300 border-slate-600';
    }
  };

  const handleConfirmDisbursal = () => {
    if (!disbursingVoucher) return;
    disburseCashByAdmin(disbursingVoucher.id, cashierStaffNote || 'Cash delivered at counter against photo ID verification.');
    setDisbursingVoucher(null);
    setCashierStaffNote('');
  };

  const handleConfirmReject = () => {
    if (!rejectingVoucherId) return;
    rejectClaimByAdmin(rejectingVoucherId, rejectReason || 'Security validation mismatch or cancelled by depot manager.');
    setRejectingVoucherId(null);
    setRejectReason('');
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Offline Claims Queue</h2>
            <p className="text-[11px] text-slate-400">Verify tokens & record physical cash disbursements</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by token (e.g. 7842), contractor, PIN..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
        {(['ALL', 'SUBMITTED', 'READY_FOR_CASH', 'DISBURSED', 'REJECTED'] as const).map((tab) => {
          const count = vouchers.filter((v) => tab === 'ALL' || v.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeTab === tab
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.replace(/_/g, ' ')}</span>
              <span className={`text-[10px] px-1 rounded-full ${activeTab === tab ? 'bg-amber-600/40 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Vouchers List */}
      <div className="space-y-3">
        {filteredVouchers.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 text-xs">
            No claims found matching the filter.
          </div>
        ) : (
          filteredVouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white tracking-wide">
                      {voucher.claimToken}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusStyle(voucher.status)}`}>
                      {voucher.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-xs font-semibold text-slate-200">
                      {voucher.contractorName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      {voucher.contractorPhone}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-amber-300 font-mono-nums">
                    ₹{voucher.cashAmount.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {voucher.pointsRedeemed.toLocaleString()} points
                  </span>
                </div>
              </div>

              {/* Depot and PIN info */}
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Collection Depot
                  </span>
                  <span className="text-slate-200 truncate block">{voucher.depotName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Security PIN
                  </span>
                  <span className="font-mono text-amber-400 font-bold tracking-widest">
                    {voucher.securityPin}
                  </span>
                </div>
              </div>

              {voucher.remarks && (
                <p className="text-[11px] text-slate-400 italic">"{voucher.remarks}"</p>
              )}

              {/* Action Buttons for Admin */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                {voucher.status === 'SUBMITTED' && (
                  <button
                    onClick={() => verifyClaimByAdmin(voucher.id)}
                    className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Authorize Pickup
                  </button>
                )}

                {voucher.status === 'READY_FOR_CASH' && (
                  <button
                    onClick={() => setDisbursingVoucher(voucher)}
                    className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Banknote className="w-3.5 h-3.5" /> Hand Over Cash (₹{voucher.cashAmount})
                  </button>
                )}

                {(voucher.status === 'SUBMITTED' || voucher.status === 'READY_FOR_CASH') && (
                  <button
                    onClick={() => setRejectingVoucherId(voucher.id)}
                    className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs"
                    title="Reject and refund points"
                  >
                    Void Claim
                  </button>
                )}

                <button
                  onClick={() => setSelectedVoucher(voucher)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Slip
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Disbursal Confirmation Modal */}
      {disbursingVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                <Banknote className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Confirm Cash Payout</h3>
              <p className="text-xs text-slate-400 mt-1">
                Handing over <strong className="text-emerald-400 font-mono">₹{disbursingVoucher.cashAmount}</strong> hard cash to{' '}
                <strong className="text-white">{disbursingVoucher.contractorName}</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Token:</span>
                <span className="font-mono text-white font-bold">{disbursingVoucher.claimToken}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Expected PIN:</span>
                <span className="font-mono text-amber-400 font-bold">{disbursingVoucher.securityPin}</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Cashier Notes / Receipt Voucher No.
              </label>
              <input
                type="text"
                value={cashierStaffNote}
                onChange={(e) => setCashierStaffNote(e.target.value)}
                placeholder="e.g. Paid in 5x ₹500 notes. Contractor ID checked."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setDisbursingVoucher(null)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDisbursal}
                className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20"
              >
                Confirm Cash Disbursed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectingVoucherId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-2xl p-5 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto mb-2 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Void / Reject Claim</h3>
              <p className="text-xs text-slate-400 mt-1">
                The points will be instantly refunded to the contractor's passbook.
              </p>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Reason for Rejection
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Identity verification mismatch / Inactive Depot"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setRejectingVoucherId(null)}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Keep Claim
              </button>
              <button
                onClick={handleConfirmReject}
                className="py-2.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl text-xs font-bold"
              >
                Reject & Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail slip viewer */}
      {selectedVoucher && (
        <VoucherReceiptView
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}
    </div>
  );
};
