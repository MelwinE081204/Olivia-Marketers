import React, { useState } from 'react';
import { useRewards } from '../../context/RewardsContext';
import { useAuth } from '../../context/AuthContext';
import { ReceiptText, ArrowDownLeft, ArrowUpRight, Filter, Search } from 'lucide-react';

export const PassbookView: React.FC = () => {
  const { passbook } = useRewards();
  const { currentUser } = useAuth();
  const [filterType, setFilterType] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const userEntries = passbook.filter(
    (entry) => !currentUser || entry.userId === currentUser.id
  );

  const filteredEntries = userEntries.filter((entry) => {
    if (filterType !== 'ALL' && entry.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        (entry.referenceId && entry.referenceId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalCredited = userEntries
    .filter((e) => e.type === 'CREDIT')
    .reduce((sum, e) => sum + e.points, 0);

  const totalDebited = userEntries
    .filter((e) => e.type === 'DEBIT')
    .reduce((sum, e) => sum + e.points, 0);

  return (
    <div className="pb-8 pt-1 px-3 sm:px-4 w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ReceiptText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Points Passbook</h2>
            <p className="text-[11px] text-slate-400">Verified points credit & cash claim debit ledger</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
            <ArrowDownLeft className="w-3.5 h-3.5" /> Total Points Earned
          </div>
          <div className="text-xl font-black text-white font-mono-nums">
            +{totalCredited.toLocaleString()} <span className="text-xs text-emerald-400">pts</span>
          </div>
          <span className="text-[10px] text-slate-400">Stock purchases & daily streaks</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Total Points Claimed
          </div>
          <div className="text-xl font-black text-white font-mono-nums">
            -{totalDebited.toLocaleString()} <span className="text-xs text-amber-400">pts</span>
          </div>
          <span className="text-[10px] text-slate-400">Converted to ₹{totalDebited.toLocaleString()} cash</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions or token ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilterType('ALL')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'ALL' ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilterType('CREDIT')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'CREDIT' ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Credits (+)
          </button>
          <button
            onClick={() => setFilterType('DEBIT')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'DEBIT' ? 'bg-amber-500/20 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cash Claims (-)
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 text-xs">
            No transactions found matching your criteria.
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isCredit = entry.type === 'CREDIT';
            return (
              <div
                key={entry.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5 truncate">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isCredit
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div className="truncate space-y-0.5">
                    <h4 className="text-xs font-bold text-white truncate">{entry.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{entry.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-1">
                      <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {entry.referenceId && (
                        <>
                          <span>·</span>
                          <span className="text-amber-400">{entry.referenceId}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`font-mono font-black text-sm ${
                      isCredit ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isCredit ? `+${entry.points}` : `-${entry.points}`}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-nums block">
                    ₹{entry.cashEquivalent}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
