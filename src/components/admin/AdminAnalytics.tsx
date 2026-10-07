import React from 'react';
import { useRewards } from '../../context/RewardsContext';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  Trophy,
  Medal,
  Store,
  Building2,
  TrendingUp,
  Coins,
  Banknote,
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { allUsers } = useAuth();
  const { depots, totalCashClaimedOverall, totalPointsIssuedOverall } = useRewards();

  const contractors = allUsers
    .filter((u) => u.role === 'contractor')
    .sort((a, b) => b.lifetimePoints - a.lifetimePoints);

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Performance Analytics</h2>
            <p className="text-[11px] text-slate-400">Top contractors & merchant distribution leaders</p>
          </div>
        </div>
      </div>

      {/* Overview Stat Ring */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Points Minted</span>
          <div className="text-lg font-black text-amber-300 font-mono-nums mt-0.5">
            {totalPointsIssuedOverall.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-850">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cash Disbursed</span>
          <div className="text-lg font-black text-emerald-400 font-mono-nums mt-0.5">
            ₹{totalCashClaimedOverall.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Contractor Leaderboard */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" /> Contractor Master Leaderboard
          </h3>
          <span className="text-[10px] text-slate-400">Lifetime Points</span>
        </div>

        <div className="space-y-2">
          {contractors.map((contractor, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;

            return (
              <div
                key={contractor.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      isFirst
                        ? 'bg-amber-400 text-slate-950'
                        : isSecond
                        ? 'bg-slate-300 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    #{index + 1}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white truncate">{contractor.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 uppercase">
                        {contractor.tier}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {contractor.city} · {contractor.contractorLicenseId}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {contractor.lifetimePoints.toLocaleString()} pts
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Avail: {contractor.availablePoints.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Authorized Merchant Depots & Cash Status */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Store className="w-4 h-4 text-emerald-400" /> Authorized Merchant Depots
        </h3>

        <div className="space-y-2">
          {depots.map((depot) => (
            <div
              key={depot.id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-850 text-xs space-y-1.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white">{depot.name}</h4>
                  <span className="text-[10px] text-slate-400">{depot.city} · {depot.dealerCode}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Float: ₹{depot.currentCashFloatLimit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Disbursal Hours:</span>
                <span className="text-slate-300">{depot.cashDisbursalHours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
