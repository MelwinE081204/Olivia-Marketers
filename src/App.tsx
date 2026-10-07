import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RewardsProvider, useRewards } from './context/RewardsContext';
import { MobileStatusBar } from './components/common/MobileStatusBar';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { LoginView } from './components/auth/LoginView';
import { UserDashboard } from './components/user/UserDashboard';
import { PassbookView } from './components/user/PassbookView';
import { ProductCatalogView } from './components/user/ProductCatalogView';
import { ContractorClaimsList } from './components/user/ContractorClaimsList';
import { StockScannerModal } from './components/user/StockScannerModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminClaimsManager } from './components/admin/AdminClaimsManager';
import { AdminStockAudit } from './components/admin/AdminStockAudit';
import { AdminBatchGenerator } from './components/admin/AdminBatchGenerator';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { Smartphone, Monitor, ShieldCheck, UserCheck, Store } from 'lucide-react';

const MainApp: React.FC = () => {
  const { isAuthenticated, role, loginAsDemoUser, allUsers } = useAuth();
  const { pendingCashClaimsCount } = useRewards();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [frameMode, setFrameMode] = useState<'iphone' | 'compact' | 'fluid'>('iphone');

  // Sync default tab when role switches
  useEffect(() => {
    if (role === 'admin') {
      setActiveTab('overview');
    } else if (role === 'merchant') {
      setActiveTab('merchant_home');
    } else {
      setActiveTab('home');
    }
  }, [role]);

  const handleTabChange = (tabId: string) => {
    if (tabId === 'scan') {
      setIsScannerModalOpen(true);
      return;
    }
    setActiveTab(tabId);
    // Smooth scroll inside mobile frame
    const scrollContainer = document.getElementById('mobile-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const demoContractor = allUsers.find((u) => u.role === 'contractor');
  const demoAdmin = allUsers.find((u) => u.role === 'admin');
  const demoMerchant = allUsers.find((u) => u.role === 'merchant');

  // Determine width based on frameMode
  const getFrameWidthClass = () => {
    if (frameMode === 'fluid') return 'w-full max-w-lg min-h-screen border-0 rounded-none shadow-none';
    if (frameMode === 'compact') return 'w-full max-w-[375px] h-[780px] max-h-[92vh] rounded-[44px] border-[8px] border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]';
    return 'w-full max-w-[414px] h-[860px] max-h-[94vh] rounded-[48px] border-[8px] border-slate-750 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)]';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans select-none antialiased sm:p-4">
      {/* Top Mobile App Switcher Bar (Visible on desktop/larger viewports) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-2xl mb-3 px-3 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Smartphone className="w-4 h-4" />
            <span>Mobile App Mode</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setFrameMode('iphone')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                frameMode === 'iphone' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pro Max (414px)
            </button>
            <button
              onClick={() => setFrameMode('compact')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                frameMode === 'compact' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Compact (375px)
            </button>
            <button
              onClick={() => setFrameMode('fluid')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                frameMode === 'fluid' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fluid
            </button>
          </div>
        </div>

        {/* Quick Role Switcher pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Role:</span>
          {demoContractor && (
            <button
              onClick={() => loginAsDemoUser(demoContractor.id)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                role === 'contractor' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <UserCheck className="w-3 h-3" /> Contractor
            </button>
          )}
          {demoAdmin && (
            <button
              onClick={() => loginAsDemoUser(demoAdmin.id)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                role === 'admin' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Admin
            </button>
          )}
          {demoMerchant && (
            <button
              onClick={() => loginAsDemoUser(demoMerchant.id)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
                role === 'merchant' ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Store className="w-3 h-3" /> Merchant
            </button>
          )}
        </div>
      </div>

      {/* THE MOBILE PHONE CHASSIS */}
      <div
        className={`relative bg-slate-950 overflow-hidden flex flex-col transition-all duration-300 ${getFrameWidthClass()}`}
      >
        {/* Top iOS / Flagship Status Bar */}
        <MobileStatusBar />

        {!isAuthenticated ? (
          <LoginView />
        ) : (
          <>
            {/* Top Compact Mobile App Bar */}
            <Navbar />

            {/* Scrollable Mobile Viewport Body */}
            <main
              id="mobile-scroll-container"
              className="flex-1 w-full overflow-y-auto no-scrollbar py-2"
            >
              {/* Contractor Views */}
              {role === 'contractor' && (
                <>
                  {activeTab === 'home' && <UserDashboard onNavigateTab={handleTabChange} />}
                  {activeTab === 'claims' && <ContractorClaimsList />}
                  {activeTab === 'passbook' && <PassbookView />}
                  {activeTab === 'catalog' && <ProductCatalogView />}
                </>
              )}

              {/* Admin Views */}
              {role === 'admin' && (
                <>
                  {activeTab === 'overview' && <AdminDashboard onNavigateTab={handleTabChange} />}
                  {activeTab === 'claims' && <AdminClaimsManager />}
                  {activeTab === 'audit' && <AdminStockAudit />}
                  {activeTab === 'batches' && <AdminBatchGenerator />}
                  {activeTab === 'analytics' && <AdminAnalytics />}
                </>
              )}

              {/* Merchant Views */}
              {role === 'merchant' && (
                <MerchantDashboard onNavigateTab={handleTabChange} />
              )}
            </main>

            {/* Mobile Bottom Navigation Bar (pinned at base of phone) */}
            <BottomNav
              activeTab={activeTab}
              onTabChange={handleTabChange}
              pendingClaimsBadge={role === 'admin' ? pendingCashClaimsCount : 0}
            />

            {/* Mobile Quick Scanner Drawer */}
            <StockScannerModal
              isOpen={isScannerModalOpen}
              onClose={() => setIsScannerModalOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RewardsProvider>
        <MainApp />
      </RewardsProvider>
    </AuthProvider>
  );
}
