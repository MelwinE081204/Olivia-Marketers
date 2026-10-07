import React, { useState } from 'react';
import { useRewards } from '../../context/RewardsContext';
import { Barcode, Plus, CheckCircle2, Sparkles, Layers, Calendar } from 'lucide-react';

export const AdminBatchGenerator: React.FC = () => {
  const { products, createStockBatch } = useRewards();

  const [skuCode, setSkuCode] = useState(products[0]?.skuCode || '');
  const [points, setPoints] = useState(150);
  const [quantity, setQuantity] = useState(50);
  const [campaignName, setCampaignName] = useState('Festive Contractor Surge 2026');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const selectedProduct = products.find((p) => p.skuCode === skuCode) || products[0];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const batchCode = `BATCH-OLV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    createStockBatch({
      batchCode,
      skuCode,
      points,
      quantityUnits: quantity,
      expiryMonths: 12,
      notes: campaignName,
    });

    setSuccessBanner(`Generated Batch #${batchCode} with ${quantity} units (${points} pts each)!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Barcode className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">QR Batch Generator</h2>
            <p className="text-[11px] text-slate-400">Mint serialized coupon codes for new factory stock</p>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Target Product SKU
          </label>
          <select
            value={skuCode}
            onChange={(e) => {
              setSkuCode(e.target.value);
              const p = products.find((x) => x.skuCode === e.target.value);
              if (p) setPoints(p.pointsEarned);
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {products.map((p) => (
              <option key={p.id} value={p.skuCode}>
                {p.name} (Base: {p.pointsEarned} pts)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Points Per Unit
            </label>
            <input
              type="number"
              min="10"
              max="2000"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Stock Quantity (Units)
            </label>
            <input
              type="number"
              min="1"
              max="5000"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Campaign / Production Note
          </label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Calculation summary */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-850 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Total Batch Value</span>
            <span className="font-mono text-base font-black text-amber-400">
              {(points * quantity).toLocaleString()} Points
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Hard Cash Liability</span>
            <span className="font-mono text-base font-black text-emerald-400">
              ₹{(points * quantity).toLocaleString()}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" /> Mint Serialized Batch
        </button>
      </form>
    </div>
  );
};
