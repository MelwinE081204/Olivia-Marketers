import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRewards } from '../../context/RewardsContext';
import { ScratchCardModal } from './ScratchCardModal';
import { StockScannerModal } from './StockScannerModal';
import { OfflineCashClaimModal } from './OfflineCashClaimModal';
import { VoucherReceiptView } from './VoucherReceiptView';
import { CashClaimVoucher } from '../../types';
import {
  QrCode,
  Banknote,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface UserDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser } = useAuth();
  const {
    activeContractorVouchers,
    passbook,
    performDailyCheckIn,
    getTierForPoints,
  } = useRewards();

  const [isScratchOpen, setIsScratchOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<CashClaimVoucher | null>(null);

  if (!currentUser) return null;

  const tierStats = getTierForPoints(currentUser.lifetimePoints);
  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = currentUser.lastCheckInDate === today;

  const handleDailyStreakClick = () => {
    if (!hasCheckedInToday) {
      performDailyCheckIn();
    }
  };

  // Tier Card Styling based on user tier
  const getTierCardTheme = () => {
    switch (currentUser.tier) {
      case 'Platinum Elite':
        return {
          gradient: 'from-slate-900 via-emerald-950 to-slate-900 border-amber-400/50',
          badgeColor: 'bg-amber-400 text-slate-950',
          accent: 'text-amber-400',
        };
      case 'Gold Master':
        return {
          gradient: 'from-amber-950/90 via-slate-900 to-amber-950/80 border-amber-500/40',
          badgeColor: 'bg-amber-500 text-slate-950',
          accent: 'text-amber-400',
        };
      case 'Silver Expert':
        return {
          gradient: 'from-slate-800 via-slate-900 to-slate-800 border-slate-600',
          badgeColor: 'bg-slate-300 text-slate-900',
          accent: 'text-slate-300',
        };
      default:
        return {
          gradient: 'from-emerald-950 via-slate-900 to-slate-900 border-emerald-600/40',
          badgeColor: 'bg-emerald-500 text-slate-950',
          accent: 'text-emerald-400',
        };
    }
  };

  const theme = getTierCardTheme();

  return (
    <div className="pb-8 pt-1 px-3 sm:px-4 w-full space-y-5">
      {/* SECTION 1: CONTRACTOR VIP MEMBERSHIP CARD */}
      <section className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Digital Membership Pass
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-medium">
            Verified Contractor
          </span>
        </div>

        <div
          className={`relative w-full rounded-3xl bg-gradient-to-br ${theme.gradient} border p-5 shadow-2xl overflow-hidden transition-all`}
        >
          {/* Holographic metallic decorative lighting */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Row: Club name + Tier Pill + EMV Chip */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-widest text-white">
                OLIVIA CLUB
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${theme.badgeColor}`}>
                {currentUser.tier}
              </span>
            </div>

            {/* Simulated Smart Chip */}
            <div className="w-8 h-6 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-200/40 shadow-inner flex items-center justify-center">
              <div className="w-5 h-3.5 border border-amber-800/40 rounded-xs grid grid-cols-2 gap-0.5 opacity-60">
                <div className="bg-amber-700/30" />
                <div className="bg-amber-700/30" />
              </div>
            </div>
          </div>

          {/* Member Name & License */}
          <div className="space-y-0.5 my-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">
              Registered Contractor
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              {currentUser.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>{currentUser.contractorLicenseId || 'MH-LIC-2026'}</span>
              <span>·</span>
              <span>{currentUser.city}</span>
            </div>
          </div>

          {/* Points & Real Cash Balance Box */}
          <div className="mt-4 pt-3.5 border-t border-slate-700/60 grid grid-cols-2 gap-3 items-end bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                Current Points
              </span>
              <div className="text-2xl font-black text-white font-mono-nums flex items-baseline gap-1 mt-0.5">
                {currentUser.availablePoints.toLocaleString()} <span className="text-xs font-bold text-emerald-400">PTS</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-semibold">
                Offline Cash Value
              </span>
              <div className="text-2xl font-black text-amber-300 font-mono-nums flex items-baseline justify-end gap-1 mt-0.5">
                ₹{currentUser.availablePoints.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">INR</span>
              </div>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="mt-3.5 pt-1">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Next Tier Milestone ({currentUser.lifetimePoints.toLocaleString()} pts)</span>
              <span className="text-amber-400 font-semibold font-mono-nums">
                {tierStats.progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${tierStats.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DAILY REWARDS ZONE (Streak & Golden Scratch Card) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Daily Engagement Rewards
          </span>
          <span className="text-[10px] text-amber-400 font-medium">Instant Points</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Streak Check-In Widget */}
          <button
            onClick={handleDailyStreakClick}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.98] ${
              hasCheckedInToday
                ? 'bg-slate-900/90 border-slate-800 text-slate-300'
                : 'bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/10'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-1.5">
                <Flame className={`w-4 h-4 ${hasCheckedInToday ? 'text-amber-500' : 'text-amber-400 fill-amber-400 animate-bounce'}`} />
                <span className="text-xs font-bold text-white">Daily Streak</span>
              </div>
              <span className="text-xs font-mono-nums font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                {currentUser.streakDays}d
              </span>
            </div>

            <div className="text-[11px] text-slate-400 mt-2">
              {hasCheckedInToday ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Checked In Today!
                </span>
              ) : (
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  Claim +{15 + Math.min(currentUser.streakDays * 5, 60)} pts!
                </span>
              )}
            </div>
          </button>

          {/* Scratch Card Trigger */}
          <button
            onClick={() => setIsScratchOpen(true)}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-[0.98] ${
              currentUser.scratchCardsAvailable > 0
                ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/90 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">Lucky Card</span>
              </div>
              <span className="text-xs font-mono-nums font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                {currentUser.scratchCardsAvailable} Left
              </span>
            </div>

            <div className="text-[11px] text-slate-400 mt-2">
              {currentUser.scratchCardsAvailable > 0 ? (
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  Scratch & Win <ChevronRight className="w-3 h-3" />
                </span>
              ) : (
                <span>Earn 500 pts for card</span>
              )}
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 3: PRIMARY TOUCH ACTIONS (Scan Stock & Claim Cash) */}
      <section className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 block">
          Primary Contractor Actions
        </span>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsScanOpen(true)}
            className="p-4 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex flex-col items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all min-h-[105px]"
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-950/15 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-slate-950" />
            </div>
            <div className="text-center">
              <span className="text-sm font-black tracking-tight block leading-tight">
                Scan Stock QR
              </span>
              <span className="text-[10px] text-slate-900/80 font-medium">
                Cables & MCB Boxes
              </span>
            </div>
          </button>

          <button
            onClick={() => setIsClaimOpen(true)}
            className="p-4 rounded-3xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-white font-bold flex flex-col items-center justify-center gap-2 shadow-xl active:scale-95 transition-all min-h-[105px]"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <Banknote className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-center">
              <span className="text-sm font-black tracking-tight block leading-tight">
                Claim Real Cash
              </span>
              <span className="text-[10px] text-amber-300/80 font-medium">
                Offline Depot Voucher
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 4: ACTIVE CASH CLAIM VOUCHERS */}
      {activeContractorVouchers.length > 0 && (
        <section className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Active Offline Cash Slips
            </span>
            <button
              onClick={() => onNavigateTab('claims')}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5 font-semibold"
            >
              All ({activeContractorVouchers.length}) <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeContractorVouchers.slice(0, 2).map((voucher) => {
              const isReady = voucher.status === 'READY_FOR_CASH';
              const isDisbursed = voucher.status === 'DISBURSED';

              return (
                <div
                  key={voucher.id}
                  onClick={() => setSelectedVoucher(voucher)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between ${
                    isReady
                      ? 'bg-amber-950/30 border-amber-500/40 hover:bg-amber-950/50'
                      : isDisbursed
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white tracking-wide">
                        {voucher.claimToken}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isReady
                            ? 'bg-amber-400 text-slate-950'
                            : isDisbursed
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {voucher.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[190px]">
                      {voucher.depotName}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-amber-300 font-mono-nums">
                      ₹{voucher.cashAmount.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center justify-end gap-0.5">
                      View QR Slip <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 5: RECENT PASSBOOK ACTIVITY */}
      <section className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Recent Points Ledger
          </span>
          <button
            onClick={() => onNavigateTab('passbook')}
            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5 font-semibold"
          >
            Full Statement <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {passbook.slice(0, 3).map((entry) => {
            const isCredit = entry.type === 'CREDIT';
            return (
              <div
                key={entry.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-850 flex items-center justify-between text-xs"
              >
                <div className="truncate pr-2">
                  <p className="font-bold text-white truncate">{entry.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">{entry.description}</p>
                </div>
                <div
                  className={`font-mono font-bold whitespace-nowrap text-right ${
                    isCredit ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isCredit ? `+${entry.points}` : `-${entry.points}`} pts
                  <span className="block text-[9px] text-slate-400 font-sans font-normal">
                    {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Slide-Up Modals */}
      <ScratchCardModal isOpen={isScratchOpen} onClose={() => setIsScratchOpen(false)} />
      <StockScannerModal isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
      <OfflineCashClaimModal isOpen={isClaimOpen} onClose={() => setIsClaimOpen(false)} />
      {selectedVoucher && (
        <VoucherReceiptView voucher={selectedVoucher} onClose={() => setSelectedVoucher(null)} />
      )}
    </div>
  );
};
