import React, { useRef } from 'react';
import { CashClaimVoucher } from '../../types';
import {
  Banknote,
  ShieldCheck,
  Building2,
  Calendar,
  Lock,
  Download,
  Share2,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface VoucherReceiptViewProps {
  voucher: CashClaimVoucher;
  onClose: () => void;
}

export const VoucherReceiptView: React.FC<VoucherReceiptViewProps> = ({ voucher, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const getStatusBadge = (status: CashClaimVoucher['status']) => {
    switch (status) {
      case 'DISBURSED':
        return {
          label: 'Cash Disbursed',
          icon: CheckCircle2,
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
        };
      case 'READY_FOR_CASH':
        return {
          label: 'Ready for Collection',
          icon: ShieldCheck,
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
        };
      case 'VERIFIED':
        return {
          label: 'Depot Verified',
          icon: Clock,
          color: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
        };
      case 'REJECTED':
        return {
          label: 'Claim Voided',
          icon: AlertTriangle,
          color: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
        };
      default:
        return {
          label: 'Submitted for Verification',
          icon: Clock,
          color: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
        };
    }
  };

  const statusInfo = getStatusBadge(voucher.status);
  const StatusIcon = statusInfo.icon;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border-t sm:border border-slate-700 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col animate-in slide-in-from-bottom duration-250">
        {/* Mobile Drag Indicator Bar */}
        <div className="w-full pt-2.5 pb-1 flex justify-center bg-slate-900">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full" />
        </div>

        {/* Top Action Bar */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Official Offline Cash Voucher
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Voucher Printable Container */}
        <div ref={receiptRef} className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* Guilloche / Security Card Outer */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 p-5 shadow-2xl overflow-hidden">
            {/* Watermark brand emblem */}
            <div className="absolute top-2 right-2 text-[10px] text-amber-400/80 font-mono tracking-widest uppercase border border-amber-500/30 px-2 py-0.5 rounded">
              NON-BANK VOUCHER
            </div>

            {/* Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-700">
              <div className="text-xs tracking-widest text-slate-400 uppercase font-semibold">
                Olivia Marketers Pvt. Ltd.
              </div>
              <h2 className="text-lg font-black text-white tracking-tight mt-0.5">
                CASH CLAIM TOKEN
              </h2>
              <div className="font-mono text-sm font-extrabold text-amber-400 mt-1 tracking-wider">
                {voucher.claimToken}
              </div>
            </div>

            {/* Payout Amount Hero */}
            <div className="py-4 text-center bg-emerald-950/40 rounded-xl my-3 border border-emerald-500/20">
              <span className="text-[11px] text-slate-300 uppercase tracking-wider font-medium">
                Authorized Cash Payout Amount
              </span>
              <div className="text-3xl font-black text-white font-mono-nums flex items-center justify-center gap-1 mt-1">
                <span className="text-emerald-400 font-sans">₹</span>
                <span>{voucher.cashAmount.toLocaleString()}</span>
              </div>
              <span className="text-[11px] text-emerald-300/90 font-medium">
                Exchanged for {voucher.pointsRedeemed.toLocaleString()} Olivia Points
              </span>
            </div>

            {/* Simulated High-Res QR Code Canvas with Token */}
            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl my-3 text-slate-950 shadow-inner">
              {/* SVG QR Code Simulation */}
              <div className="w-36 h-36 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Outer Frame */}
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Position detection squares */}
                  <rect x="5" y="5" width="26" height="26" fill="#0f172a" />
                  <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
                  <rect x="13" y="13" width="10" height="10" fill="#0f172a" />

                  <rect x="69" y="5" width="26" height="26" fill="#0f172a" />
                  <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
                  <rect x="77" y="13" width="10" height="10" fill="#0f172a" />

                  <rect x="5" y="69" width="26" height="26" fill="#0f172a" />
                  <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
                  <rect x="13" y="77" width="10" height="10" fill="#0f172a" />

                  {/* QR Data Matrix Patterns */}
                  <rect x="36" y="8" width="5" height="5" fill="#0f172a" />
                  <rect x="45" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="55" y="6" width="7" height="7" fill="#0f172a" />
                  <rect x="36" y="24" width="7" height="6" fill="#0f172a" />
                  <rect x="48" y="22" width="6" height="8" fill="#0f172a" />

                  {/* Center Olivia Logo in QR */}
                  <rect x="38" y="38" width="24" height="24" rx="4" fill="#047857" />
                  <text x="50" y="53" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    OR
                  </text>

                  {/* Bottom matrix patterns */}
                  <rect x="36" y="68" width="6" height="8" fill="#0f172a" />
                  <rect x="46" y="72" width="8" height="5" fill="#0f172a" />
                  <rect x="68" y="68" width="8" height="7" fill="#0f172a" />
                  <rect x="80" y="78" width="10" height="10" fill="#0f172a" />
                  <rect x="68" y="82" width="6" height="6" fill="#0f172a" />
                  <rect x="8" y="42" width="6" height="6" fill="#0f172a" />
                  <rect x="20" y="46" width="6" height="6" fill="#0f172a" />
                  <rect x="82" y="42" width="6" height="6" fill="#0f172a" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-600 font-mono tracking-tight mt-1">
                SCAN AT DEPOT COUNTER FOR CASH
              </span>
            </div>

            {/* Security PIN Box */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Counter Verification PIN
                  </span>
                  <span className="text-xs text-slate-300">Share only with depot cashier</span>
                </div>
              </div>
              <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg font-mono text-base font-extrabold text-amber-300 tracking-widest">
                {voucher.securityPin}
              </div>
            </div>

            {/* Voucher Details */}
            <div className="mt-4 pt-3 border-t border-dashed border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Claimant:</span>
                <span className="font-semibold text-white">{voucher.contractorName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Phone:</span>
                <span className="font-mono text-slate-200">{voucher.contractorPhone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Authorized Depot:</span>
                <span className="font-semibold text-emerald-400 text-right truncate max-w-[200px]">
                  {voucher.depotName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Depot City:</span>
                <span className="text-slate-200">{voucher.depotCity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Claim Generated:</span>
                <span className="text-slate-300 font-mono">
                  {new Date(voucher.createdAt).toLocaleDateString()} {new Date(voucher.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {voucher.disbursedAt && (
                <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-emerald-400 font-medium">
                  <span>Disbursed By:</span>
                  <span>{voucher.disbursedByAdminName}</span>
                </div>
              )}
            </div>

            {/* Status Footer Banner */}
            <div className={`mt-4 p-2.5 rounded-xl border flex items-center justify-center gap-2 ${statusInfo.color}`}>
              <StatusIcon className="w-4 h-4" />
              <span className="text-xs font-bold tracking-wide">{statusInfo.label}</span>
            </div>
          </div>

          {/* Offline Counter Collection Instructions */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1.5 text-xs text-slate-300">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-amber-400" /> Offline Cash Collection Steps
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Visit the selected Olivia authorized merchant depot counter.</li>
              <li>Show this QR code and mention token <strong className="text-white font-mono">{voucher.claimToken}</strong>.</li>
              <li>Provide your 4-digit Security PIN (<strong className="text-amber-300 font-mono">{voucher.securityPin}</strong>) to the cashier.</li>
              <li>Collect physical hard currency note count & sign the depot acknowledgement register.</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handlePrint}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 active:scale-98 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Save / Print Voucher
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Olivia Rewards Cash Voucher ${voucher.claimToken}`,
                    text: `Cash Token ${voucher.claimToken} for ₹${voucher.cashAmount} at ${voucher.depotName}`,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(`Olivia Cash Token: ${voucher.claimToken} | Amount: ₹${voucher.cashAmount} | PIN: ${voucher.securityPin}`);
                  alert('Token and PIN copied to clipboard!');
                }
              }}
              className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
