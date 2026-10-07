import React, { useState } from 'react';
import { useRewards } from '../../context/RewardsContext';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Package,
} from 'lucide-react';

export const AdminStockAudit: React.FC = () => {
  const { stockScans, auditStockScan } = useRewards();
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING_AUDIT' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScans = stockScans.filter((scan) => {
    if (filterStatus !== 'ALL' && scan.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        scan.batchCode.toLowerCase().includes(q) ||
        scan.contractorName.toLowerCase().includes(q) ||
        scan.productName.toLowerCase().includes(q) ||
        scan.merchantName.toLowerCase().includes(q) ||
        (scan.invoiceNumber && scan.invoiceNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="pb-8 pt-1 px-3 sm:px-4 w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Stock Purchase Audit</h2>
            <p className="text-[11px] text-slate-400">Validate scanned batch codes & merchant tax bills</p>
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
          placeholder="Search batch code, invoice #, contractor..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Status Segmented Buttons */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
        {(['ALL', 'APPROVED', 'PENDING_AUDIT', 'REJECTED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === status
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {status === 'PENDING_AUDIT' ? 'Pending' : status}
          </button>
        ))}
      </div>

      {/* Scan Log Items */}
      <div className="space-y-3">
        {filteredScans.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 text-xs">
            No stock scans found.
          </div>
        ) : (
          filteredScans.map((scan) => {
            const isApproved = scan.status === 'APPROVED';
            const isPending = scan.status === 'PENDING_AUDIT';
            const isRejected = scan.status === 'REJECTED';

            return (
              <div
                key={scan.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white tracking-wide">
                        {scan.batchCode}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase border ${
                          isApproved
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : isPending
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {scan.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-200 mt-1">
                      {scan.productName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-black text-amber-400">
                      +{scan.pointsAwarded} pts
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      ₹{scan.pointsAwarded} Value
                    </span>
                  </div>
                </div>

                {/* Audit details */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contractor:</span>
                    <span className="font-medium text-white">{scan.contractorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Merchant Depot:</span>
                    <span className="text-emerald-400 truncate max-w-[200px]">{scan.merchantName}</span>
                  </div>
                  {scan.invoiceNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Invoice Ref:</span>
                      <span className="font-mono text-slate-200">{scan.invoiceNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-850">
                    <span>Scanned On:</span>
                    <span>{new Date(scan.scannedAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Admin Audit Actions */}
                {isPending && (
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => auditStockScan(scan.id, 'APPROVED')}
                      className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Points
                    </button>
                    <button
                      onClick={() => auditStockScan(scan.id, 'REJECTED')}
                      className="flex-1 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject Duplicate
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
