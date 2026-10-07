import React, { useState } from 'react';
import { useRewards } from '../../context/RewardsContext';
import { useAuth } from '../../context/AuthContext';
import {
  QrCode,
  X,
  ScanLine,
  Keyboard,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Zap,
  Package,
} from 'lucide-react';

interface StockScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StockScannerModal: React.FC<StockScannerModalProps> = ({ isOpen, onClose }) => {
  const { products, depots, scanStockCode } = useRewards();
  const { currentUser } = useAuth();

  const [activeMode, setActiveMode] = useState<'camera' | 'manual' | 'invoice'>('camera');
  const [manualCode, setManualCode] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedDepotId, setSelectedDepotId] = useState(depots[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string; points?: number } | null>(null);

  if (!isOpen) return null;

  const handleScanSample = (sampleCode: string) => {
    setFeedback(null);
    const result = scanStockCode(sampleCode, selectedDepotId, invoiceNumber || undefined);
    if (result.success) {
      setFeedback({ type: 'success', text: result.message, points: result.pointsAwarded });
    } else {
      setFeedback({ type: 'error', text: result.message });
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    setFeedback(null);
    const result = scanStockCode(manualCode, selectedDepotId, invoiceNumber || undefined);
    if (result.success) {
      setFeedback({ type: 'success', text: result.message, points: result.pointsAwarded });
      setManualCode('');
    } else {
      setFeedback({ type: 'error', text: result.message });
    }
  };

  const currentTierMultiplier =
    currentUser?.tier === 'Platinum Elite' ? '1.5x' :
    currentUser?.tier === 'Gold Master' ? '1.25x' :
    currentUser?.tier === 'Silver Expert' ? '1.1x' : '1.0x';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Scan Olivia Stock QR</h3>
              <p className="text-[11px] text-slate-400">Scan box sticker or enter purchase voucher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tier Multiplier Callout */}
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-800/80 to-amber-950/70 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            Your Tier: <strong className="text-white font-semibold">{currentUser?.tier}</strong>
          </span>
          <span className="text-amber-300 font-mono-nums font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {currentTierMultiplier} Points Multiplier
          </span>
        </div>

        {/* Mode Selector */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-1 bg-slate-950/60">
          <button
            onClick={() => { setActiveMode('camera'); setFeedback(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeMode === 'camera' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" /> Barcode Viewfinder
          </button>
          <button
            onClick={() => { setActiveMode('manual'); setFeedback(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeMode === 'manual' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" /> Enter Code
          </button>
          <button
            onClick={() => { setActiveMode('invoice'); setFeedback(null); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              activeMode === 'invoice' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Invoice Bill
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{feedback.text}</p>
                {feedback.points && (
                  <p className="text-[11px] text-emerald-400 mt-0.5">
                    +{feedback.points} points successfully credited to your ledger balance.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Merchant Depot selection */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Purchasing Olivia Merchant
            </label>
            <select
              value={selectedDepotId}
              onChange={(e) => setSelectedDepotId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {depots.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.city})
                </option>
              ))}
            </select>
          </div>

          {/* Mode 1: Camera Viewfinder */}
          {activeMode === 'camera' && (
            <div className="space-y-3">
              <div className="relative w-full aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
                {/* Laser scan line animation */}
                <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-pulse" />

                {/* Viewfinder brackets */}
                <div className="relative w-48 h-32 border-2 border-dashed border-emerald-500/70 rounded-lg flex flex-col items-center justify-center p-2 text-center bg-emerald-950/20">
                  <ScanLine className="w-8 h-8 text-emerald-400/80 mb-1 animate-pulse" />
                  <span className="text-[10px] text-emerald-300 font-mono">ALIGN OLIVIA QR / BARCODE</span>
                </div>

                <div className="absolute bottom-2 inset-x-0 text-center">
                  <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full">
                    Camera Simulator Active
                  </span>
                </div>
              </div>

              {/* Sample QR Codes to test instantly */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Tap Any Verified Product Sticker to Scan:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleScanSample(`BATCH-OLV-2026-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors active:scale-95 group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-400">
                        FlameGuard 2.5 mm
                      </span>
                      <span className="text-[10px] font-mono-nums font-bold text-amber-400 bg-amber-500/10 px-1 rounded">
                        +110 pts
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">90m Coil Roll</span>
                  </button>

                  <button
                    onClick={() => handleScanSample(`OLV-ARM-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors active:scale-95 group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-400">
                        Armoured 16mm
                      </span>
                      <span className="text-[10px] font-mono-nums font-bold text-amber-400 bg-amber-500/10 px-1 rounded">
                        +450 pts
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">50m Heavy Drum</span>
                  </button>

                  <button
                    onClick={() => handleScanSample(`OLV-MCB-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors active:scale-95 group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-400">
                        ProShield MCB
                      </span>
                      <span className="text-[10px] font-mono-nums font-bold text-amber-400 bg-amber-500/10 px-1 rounded">
                        +95 pts
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">32A Double Pole</span>
                  </button>

                  <button
                    onClick={() => handleScanSample(`OLV-MOD-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors active:scale-95 group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white group-hover:text-emerald-400">
                        Modular Switches
                      </span>
                      <span className="text-[10px] font-mono-nums font-bold text-amber-400 bg-amber-500/10 px-1 rounded">
                        +120 pts
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Box of 20 Units</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Manual Code Input */}
          {activeMode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  12-Digit Olivia Product Coupon Code
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="e.g. OLV-9842-1109 or BATCH-2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono uppercase tracking-wider focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Found underneath the scratch foil on Olivia cable rolls or inside switch boxes.
                </p>
              </div>

              <button
                type="submit"
                disabled={!manualCode.trim()}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
              >
                Verify & Claim Points
              </button>
            </form>
          )}

          {/* Mode 3: Invoice Bill Upload */}
          {activeMode === 'invoice' && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Merchant Tax Invoice / Bill Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. INV-APEX-8891"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Select Purchased Product SKU
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.pointsEarned} pts)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  const prod = products.find((p) => p.id === selectedProductId);
                  handleScanSample(`INV-${prod?.skuCode || 'OLV'}-${Math.floor(1000 + Math.random() * 9000)}`);
                }}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
              >
                Submit Invoice for Instant Credit
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-slate-400" /> Olivia Genuine Stock Authenticator
          </span>
          <button onClick={onClose} className="text-slate-300 hover:text-white font-medium">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
