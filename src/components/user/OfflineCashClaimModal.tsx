import React, { useState } from 'react';
import { useRewards } from '../../context/RewardsContext';
import { useAuth } from '../../context/AuthContext';
import { CashClaimVoucher } from '../../types';
import { VoucherReceiptView } from './VoucherReceiptView';
import {
  Banknote,
  X,
  Building2,
  AlertCircle,
  Coins,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface OfflineCashClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineCashClaimModal: React.FC<OfflineCashClaimModalProps> = ({ isOpen, onClose }) => {
  const { depots, createCashClaim } = useRewards();
  const { currentUser } = useAuth();

  const [pointsToRedeem, setPointsToRedeem] = useState<number>(1000);
  const [selectedDepotId, setSelectedDepotId] = useState<string>(depots[0]?.id || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdVoucher, setCreatedVoucher] = useState<CashClaimVoucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  if (createdVoucher) {
    return (
      <VoucherReceiptView
        voucher={createdVoucher}
        onClose={() => {
          setCreatedVoucher(null);
          onClose();
        }}
      />
    );
  }

  const available = currentUser?.availablePoints || 0;
  const quickPacks = [500, 1000, 2000, 3500];

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (pointsToRedeem < 100) {
      setErrorMsg('Minimum redemption is 100 points.');
      return;
    }

    if (pointsToRedeem > available) {
      setErrorMsg(`Insufficient points. You have ${available} points available.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const voucher = createCashClaim({
        pointsToRedeem,
        depotId: selectedDepotId,
      });
      setCreatedVoucher(voucher);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate cash voucher.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDepot = depots.find((d) => d.id === selectedDepotId) || depots[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-250">
        {/* Mobile Drag Indicator Bar */}
        <div className="w-full pt-2.5 pb-1 flex justify-center bg-slate-900">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Claim Real Cash for Points</h3>
              <p className="text-[11px] text-slate-400">Offline counter voucher redemption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Status Banner */}
        <div className="px-4 py-3 bg-emerald-950/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" /> Available to Cash Out:
          </span>
          <span className="text-emerald-300 font-mono-nums font-bold">
            {available.toLocaleString()} pts <span className="text-slate-400 font-sans font-normal">(₹{available.toLocaleString()})</span>
          </span>
        </div>

        {/* Content Form */}
        <form onSubmit={handleClaim} className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Points Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              1. Choose Points to Convert to Real Cash
            </label>

            {/* Quick pack chips */}
            <div className="grid grid-cols-4 gap-1.5">
              {quickPacks.map((pack) => {
                const isSelected = pointsToRedeem === pack;
                const canAfford = available >= pack;
                return (
                  <button
                    key={pack}
                    type="button"
                    disabled={!canAfford}
                    onClick={() => setPointsToRedeem(pack)}
                    className={`py-2 rounded-lg text-xs font-mono-nums font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                        : canAfford
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        : 'bg-slate-900/60 text-slate-600 border-slate-800 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {pack} pts
                  </button>
                );
              })}
            </div>

            {/* Custom input */}
            <div className="relative mt-2">
              <input
                type="number"
                min="100"
                max={available}
                value={pointsToRedeem}
                onChange={(e) => setPointsToRedeem(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-base text-white font-mono-nums font-bold focus:outline-none focus:border-emerald-500 pr-16"
              />
              <button
                type="button"
                onClick={() => setPointsToRedeem(available)}
                className="absolute right-2 top-2 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[10px] font-semibold text-amber-300 uppercase"
              >
                Max All
              </button>
            </div>
          </div>

          {/* Real Money Conversion Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Cash Value at Counter
              </span>
              <div className="text-2xl font-black text-amber-300 font-mono-nums flex items-baseline gap-1 mt-0.5">
                ₹{pointsToRedeem.toLocaleString()} <span className="text-xs font-normal text-slate-400 font-sans">Hard Cash</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <span>Conversion Rate:</span>
              <div className="text-white font-semibold font-mono-nums">1 Pt = ₹1.00</div>
            </div>
          </div>

          {/* Depot Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              2. Select Authorized Collection Depot Counter
            </label>
            <select
              value={selectedDepotId}
              onChange={(e) => setSelectedDepotId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {depots.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.city} (Limit: ₹{d.currentCashFloatLimit.toLocaleString()})
                </option>
              ))}
            </select>

            {selectedDepot && (
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Address:</span>
                  <span className="text-right text-slate-200 truncate max-w-[220px]">
                    {selectedDepot.address}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Cash Hours:</span>
                  <span className="text-emerald-400 font-medium">{selectedDepot.cashDisbursalHours}</span>
                </div>
              </div>
            )}
          </div>

          {/* Offline Security Notice */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/80 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              No bank account required. A digital voucher token & 4-digit security PIN will be issued. Present them at the counter to receive cash in hand.
            </p>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || pointsToRedeem < 100 || pointsToRedeem > available}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Generate Offline Cash Voucher (₹{pointsToRedeem.toLocaleString()})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
