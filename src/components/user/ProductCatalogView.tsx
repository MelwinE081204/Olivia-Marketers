import React, { useState } from 'react';
import { useRewards } from '../../context/RewardsContext';
import { StockScannerModal } from './StockScannerModal';
import {
  PackageSearch,
  Building2,
  Phone,
  Clock,
  Sparkles,
  QrCode,
  Tag,
  ShieldCheck,
  Search,
} from 'lucide-react';

export const ProductCatalogView: React.FC = () => {
  const { products, depots } = useRewards();
  const [activeSection, setActiveSection] = useState<'PRODUCTS' | 'DEPOTS'>('PRODUCTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isScanOpen, setIsScanOpen] = useState(false);

  const categories = ['ALL', 'Cables & Wires', 'Switchgear & MCBs', 'Conduits & Fittings', 'LED & Lighting'];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.skuCode.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredDepots = depots.filter((d) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q) || d.address.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-lg mx-auto space-y-4">
      {/* Navigation Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveSection('PRODUCTS')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'PRODUCTS'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PackageSearch className="w-3.5 h-3.5" /> Product Points Matrix
        </button>
        <button
          onClick={() => setActiveSection('DEPOTS')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSection === 'DEPOTS'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Payout Depot Locator
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={activeSection === 'PRODUCTS' ? 'Search wire gauges, MCBs, or switches...' : 'Search depot name or city...'}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Product View */}
      {activeSection === 'PRODUCTS' && (
        <div className="space-y-3">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-emerald-400 font-semibold border border-emerald-500/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Items Grid */}
          <div className="space-y-2.5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        {product.skuCode}
                      </span>
                      <span className="text-[10px] text-slate-400">· {product.packaging}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white tracking-tight">{product.name}</h3>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg text-amber-300 font-mono-nums font-bold text-xs">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      +{product.pointsEarned} pts
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      MRP ₹{product.mrp.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">{product.description}</p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-emerald-400" /> Offline Cash Value: <strong className="text-white">₹{product.pointsEarned}</strong>
                  </span>
                  <button
                    onClick={() => setIsScanOpen(true)}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Scan Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Depots View */}
      {activeSection === 'DEPOTS' && (
        <div className="space-y-2.5">
          {filteredDepots.map((depot) => (
            <div
              key={depot.id}
              className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {depot.dealerCode}
                  </span>
                  <h3 className="text-xs font-bold text-white mt-1">{depot.name}</h3>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  Cash Ready
                </span>
              </div>

              <p className="text-[11px] text-slate-400">{depot.address}, {depot.city}</p>

              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`tel:${depot.phone}`} className="hover:underline text-emerald-400 truncate">
                    {depot.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 truncate text-slate-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{depot.cashDisbursalHours}</span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Current Cash Reserve:</span>
                <span className="text-amber-400 font-bold">₹{depot.currentCashFloatLimit.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scanner modal */}
      <StockScannerModal isOpen={isScanOpen} onClose={() => setIsScanOpen(false)} />
    </div>
  );
};
