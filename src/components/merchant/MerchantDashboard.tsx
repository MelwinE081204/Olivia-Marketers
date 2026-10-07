import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRewards } from '../../context/RewardsContext';
import { CashClaimVoucher } from '../../types';
import { VoucherReceiptView } from '../user/VoucherReceiptView';
import {
  Store,
  UserPlus,
  ShieldCheck,
  Search,
  CheckCircle2,
  Banknote,
  Receipt,
  Sparkles,
} from 'lucide-react';

interface MerchantDashboardProps {
  onNavigateTab: (tabId: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = () => {
  const { currentUser } = useAuth();
  const { products, vouchers, merchantLogStockSale, disburseCashByAdmin } = useRewards();

  const [activeTab, setActiveTab] = useState<'ISSUE_POINTS' | 'VERIFY_VOUCHER' | 'HISTORY'>('ISSUE_POINTS');

  // Issue points state
  const [contractorPhone, setContractorPhone] = useState('+91 98210 55432');
  const [selectedSkuId, setSelectedSkuId] = useState(products[0]?.id || '');
  const [units, setUnits] = useState(2);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-MCH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueNotice, setIssueNotice] = useState<string | null>(null);

  // Voucher verification state
  const [lookupToken, setLookupToken] = useState('');
  const [matchedVoucher, setMatchedVoucher] = useState<CashClaimVoucher | null>(null);
  const [securityPinInput, setSecurityPinInput] = useState('');
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);
  const [showSlip, setShowSlip] = useState<CashClaimVoucher | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedSkuId) || products[0];
  const pointsToCredit = selectedProduct.pointsEarned * units;

  const handleIssueSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractorPhone.trim()) return;

    const res = merchantLogStockSale(contractorPhone, selectedSkuId, units, invoiceNumber);
    if (res.success) {
      setIssueNotice(`Issued ${pointsToCredit} Olivia Points to ${contractorPhone} for ${selectedProduct.name}!`);
      setInvoiceNumber(`INV-MCH-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleSearchVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyNotice(null);
    const clean = lookupToken.trim().toUpperCase();
    const found = vouchers.find(
      (v) => v.claimToken.toUpperCase() === clean || v.securityPin === clean
    );
    if (found) {
      setMatchedVoucher(found);
    } else {
      setVerifyNotice(`No voucher found matching "${lookupToken}". Check token code.`);
      setMatchedVoucher(null);
    }
  };

  const handleDisburseAtMerchant = () => {
    if (!matchedVoucher) return;
    if (securityPinInput.trim() !== matchedVoucher.securityPin) {
      setVerifyNotice('Invalid Security PIN! Please ask contractor for the 4-digit PIN on their voucher.');
      return;
    }
    disburseCashByAdmin(matchedVoucher.id, `Counter cash ₹${matchedVoucher.cashAmount} disbursed at ${currentUser?.merchantStoreName}`);
    setMatchedVoucher({ ...matchedVoucher, status: 'DISBURSED' });
    setVerifyNotice(`Successfully disbursed ₹${matchedVoucher.cashAmount} to ${matchedVoucher.contractorName}!`);
  };

  return (
    <div className="pb-8 pt-1 px-3 sm:px-4 w-full space-y-4">
      {/* Merchant Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block">
                MERCHANT COUNTER PORTAL
              </span>
              <h2 className="text-base font-black text-white tracking-tight">
                {currentUser?.merchantStoreName || 'Apex Electricals Depot'}
              </h2>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {currentUser?.city}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          onClick={() => { setActiveTab('ISSUE_POINTS'); setIssueNotice(null); }}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'ISSUE_POINTS'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" /> Credit Points
        </button>
        <button
          onClick={() => { setActiveTab('VERIFY_VOUCHER'); setVerifyNotice(null); }}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'VERIFY_VOUCHER'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Cash Out Voucher
        </button>
      </div>

      {/* Tab 1: Credit Points for Contractor Purchase */}
      {activeTab === 'ISSUE_POINTS' && (
        <form onSubmit={handleIssueSale} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-emerald-400" /> Log Contractor Stock Purchase
          </h3>

          {issueNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{issueNotice}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Contractor Mobile Number
            </label>
            <input
              type="text"
              value={contractorPhone}
              onChange={(e) => setContractorPhone(e.target.value)}
              placeholder="+91 98210 55432"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Select Purchased Olivia SKU
            </label>
            <select
              value={selectedSkuId}
              onChange={(e) => setSelectedSkuId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.pointsEarned} pts / unit)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Units Purchased
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={units}
                onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Bill / Invoice Ref
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value.toUpperCase())}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-850 flex items-center justify-between text-xs">
            <span className="text-slate-400">Points to be Credited:</span>
            <span className="font-mono text-base font-black text-amber-400">
              +{pointsToCredit} Points (₹{pointsToCredit} Cash Value)
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Credit Points to Contractor
          </button>
        </form>
      )}

      {/* Tab 2: Verify & Disburse Offline Cash */}
      {activeTab === 'VERIFY_VOUCHER' && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-amber-400" /> Counter Cash Claim Verification
          </h3>

          <form onSubmit={handleSearchVoucher} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={lookupToken}
              onChange={(e) => setLookupToken(e.target.value)}
              placeholder="Enter Voucher Token (e.g. OLV-CASH-7842)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-20 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {verifyNotice && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 text-xs">
              {verifyNotice}
            </div>
          )}

          {matchedVoucher && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{matchedVoucher.claimToken}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-500/20 text-amber-300">
                      {matchedVoucher.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-slate-300 mt-1 block">
                    Contractor: <strong>{matchedVoucher.contractorName}</strong> ({matchedVoucher.contractorPhone})
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-amber-300 font-mono-nums">
                    ₹{matchedVoucher.cashAmount}
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans">Cash in hand</span>
                </div>
              </div>

              {matchedVoucher.status !== 'DISBURSED' ? (
                <div className="space-y-3 pt-2 border-t border-slate-850">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Enter Contractor's 4-Digit Security PIN
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={securityPinInput}
                      onChange={(e) => setSecurityPinInput(e.target.value)}
                      placeholder="e.g. 4829"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-lg font-mono font-bold text-amber-300 tracking-widest focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDisburseAtMerchant}
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
                    >
                      Hand Over ₹{matchedVoucher.cashAmount} Cash
                    </button>
                    <button
                      onClick={() => setShowSlip(matchedVoucher)}
                      className="px-3 py-2.5 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700"
                    >
                      View Slip
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cash Already Disbursed
                  </span>
                  <button
                    onClick={() => setShowSlip(matchedVoucher)}
                    className="text-xs text-emerald-400 underline font-medium"
                  >
                    View Voucher
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showSlip && (
        <VoucherReceiptView voucher={showSlip} onClose={() => setShowSlip(null)} />
      )}
    </div>
  );
};
