import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RewardsProvider, useRewards } from './context/RewardsContext';
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

const MainApp: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const { pendingCashClaimsCount } = useRewards();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);

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

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleTabChange = (tabId: string) => {
    if (tabId === 'scan') {
      setIsScannerModalOpen(true);
      return;
    }
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none sm:select-auto antialiased">
      {/* Top Navbar adhering to 3-zone contract */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-lg mx-auto px-2 sm:px-4 py-3">
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

      {/* Ergonomic Mobile Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingClaimsBadge={role === 'admin' ? pendingCashClaimsCount : 0}
      />

      {/* Global Quick Scanner Trigger Modal for Contractors */}
      <StockScannerModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
      />
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
