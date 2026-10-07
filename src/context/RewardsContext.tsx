import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ProductSKU,
  MerchantDepot,
  CashClaimVoucher,
  StockScanRecord,
  PassbookEntry,
  VoucherStatus,
  TierLevel,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_DEPOTS,
  INITIAL_VOUCHERS,
  INITIAL_STOCK_SCANS,
  INITIAL_PASSBOOK,
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { triggerConfettiCelebration, triggerGoldBurst } from '../utils/confetti';

interface CreateClaimParams {
  pointsToRedeem: number;
  depotId: string;
}

interface NewBatchParams {
  batchCode: string;
  skuCode: string;
  points: number;
  quantityUnits: number;
  expiryMonths: number;
  notes?: string;
}

interface RewardsContextType {
  products: ProductSKU[];
  depots: MerchantDepot[];
  vouchers: CashClaimVoucher[];
  stockScans: StockScanRecord[];
  passbook: PassbookEntry[];
  // Contractor actions
  createCashClaim: (params: CreateClaimParams) => CashClaimVoucher;
  performDailyCheckIn: () => { pointsEarned: number; streak: number };
  scratchCardClaim: () => { pointsEarned: number };
  scanStockCode: (codeOrInvoice: string, merchantId: string, invoiceNum?: string) => { success: boolean; pointsAwarded: number; message: string; record?: StockScanRecord };
  // Admin actions
  verifyClaimByAdmin: (voucherId: string, remarks?: string) => void;
  disburseCashByAdmin: (voucherId: string, remarks?: string) => void;
  rejectClaimByAdmin: (voucherId: string, reason: string) => void;
  auditStockScan: (scanId: string, status: 'APPROVED' | 'REJECTED') => void;
  createStockBatch: (params: NewBatchParams) => void;
  // Merchant actions
  merchantLogStockSale: (contractorPhone: string, skuId: string, units: number, invoiceNum: string) => { success: boolean; message: string };
  // Metrics & Utilities
  getTierForPoints: (lifetimePoints: number) => { tier: TierLevel; nextTierPoints: number; progressPercent: number };
  activeContractorVouchers: CashClaimVoucher[];
  totalCashClaimedOverall: number;
  totalPointsIssuedOverall: number;
  pendingCashClaimsCount: number;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateCurrentUser } = useAuth();

  const [products] = useState<ProductSKU[]>(INITIAL_PRODUCTS);
  const [depots] = useState<MerchantDepot[]>(INITIAL_DEPOTS);

  const [vouchers, setVouchers] = useState<CashClaimVoucher[]>(() => {
    try {
      const saved = localStorage.getItem('olivia_rewards_vouchers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_VOUCHERS;
  });

  const [stockScans, setStockScans] = useState<StockScanRecord[]>(() => {
    try {
      const saved = localStorage.getItem('olivia_rewards_stock_scans');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STOCK_SCANS;
  });

  const [passbook, setPassbook] = useState<PassbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('olivia_rewards_passbook');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PASSBOOK;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('olivia_rewards_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('olivia_rewards_stock_scans', JSON.stringify(stockScans));
  }, [stockScans]);

  useEffect(() => {
    localStorage.setItem('olivia_rewards_passbook', JSON.stringify(passbook));
  }, [passbook]);

  const getTierForPoints = (lifetimePoints: number) => {
    if (lifetimePoints >= 15000) {
      return { tier: 'Platinum Elite' as TierLevel, nextTierPoints: 15000, progressPercent: 100 };
    }
    if (lifetimePoints >= 5000) {
      const currentSpan = lifetimePoints - 5000;
      const targetSpan = 15000 - 5000;
      return {
        tier: 'Gold Master' as TierLevel,
        nextTierPoints: 15000,
        progressPercent: Math.min(100, Math.round((currentSpan / targetSpan) * 100)),
      };
    }
    if (lifetimePoints >= 1500) {
      const currentSpan = lifetimePoints - 1500;
      const targetSpan = 5000 - 1500;
      return {
        tier: 'Silver Expert' as TierLevel,
        nextTierPoints: 5000,
        progressPercent: Math.min(100, Math.round((currentSpan / targetSpan) * 100)),
      };
    }
    return {
      tier: 'Bronze Pro' as TierLevel,
      nextTierPoints: 1500,
      progressPercent: Math.min(100, Math.round((lifetimePoints / 1500) * 100)),
    };
  };

  // Contractor create cash voucher
  const createCashClaim = ({ pointsToRedeem, depotId }: CreateClaimParams): CashClaimVoucher => {
    if (!currentUser) throw new Error('Must be logged in to claim points');
    if (currentUser.availablePoints < pointsToRedeem) {
      throw new Error(`Insufficient points balance. Available: ${currentUser.availablePoints}`);
    }

    const depot = depots.find((d) => d.id === depotId) || depots[0];
    const claimRandom = Math.floor(1000 + Math.random() * 9000);
    const pinRandom = Math.floor(1000 + Math.random() * 9000);
    const newVoucher: CashClaimVoucher = {
      id: `vch-${Date.now()}`,
      claimToken: `OLV-CASH-${claimRandom}`,
      contractorId: currentUser.id,
      contractorName: currentUser.name,
      contractorPhone: currentUser.phone,
      pointsRedeemed: pointsToRedeem,
      cashAmount: pointsToRedeem, // 1:1 conversion for Olivia points
      status: 'SUBMITTED',
      depotId: depot.id,
      depotName: depot.name,
      depotCity: depot.city,
      securityPin: `${pinRandom}`,
      createdAt: new Date().toISOString(),
      remarks: 'Submitted for verification at selected authorized merchant depot.',
    };

    // Update user balance
    updateCurrentUser((prev) => ({
      ...prev,
      availablePoints: prev.availablePoints - pointsToRedeem,
    }));

    // Add passbook debit
    const newPassbookEntry: PassbookEntry = {
      id: `pb-${Date.now()}`,
      userId: currentUser.id,
      type: 'DEBIT',
      source: 'CASH_REDEMPTION',
      title: `Offline Cash Claim Generated (${newVoucher.claimToken})`,
      description: `₹${pointsToRedeem} reserved for physical cash collection at ${depot.name}`,
      points: pointsToRedeem,
      cashEquivalent: pointsToRedeem,
      timestamp: new Date().toISOString(),
      referenceId: newVoucher.claimToken,
    };

    setVouchers((prev) => [newVoucher, ...prev]);
    setPassbook((prev) => [newPassbookEntry, ...prev]);
    triggerGoldBurst();

    return newVoucher;
  };

  // Contractor Daily Check-in
  const performDailyCheckIn = () => {
    if (!currentUser) return { pointsEarned: 0, streak: 0 };
    const today = new Date().toISOString().split('T')[0];

    const currentStreak = currentUser.streakDays || 0;
    const newStreak = currentStreak + 1;
    // Points scale with streak: Day 1: 15, Day 2: 25, Day 3: 35, etc. + scratch card on day 7
    const pointsEarned = 15 + Math.min(newStreak * 5, 60);
    const giveScratchCard = newStreak % 7 === 0;

    updateCurrentUser((prev) => ({
      ...prev,
      streakDays: newStreak,
      lastCheckInDate: today,
      availablePoints: prev.availablePoints + pointsEarned,
      totalPoints: prev.totalPoints + pointsEarned,
      lifetimePoints: prev.lifetimePoints + pointsEarned,
      scratchCardsAvailable: prev.scratchCardsAvailable + (giveScratchCard ? 1 : 0),
    }));

    const newPassbookEntry: PassbookEntry = {
      id: `pb-${Date.now()}`,
      userId: currentUser.id,
      type: 'CREDIT',
      source: 'DAILY_STREAK',
      title: `Daily Check-in Streak (Day ${newStreak})`,
      description: `Daily contractor activity reward${giveScratchCard ? ' + Bonus Golden Scratch Card!' : ''}`,
      points: pointsEarned,
      cashEquivalent: pointsEarned,
      timestamp: new Date().toISOString(),
    };
    setPassbook((prev) => [newPassbookEntry, ...prev]);
    triggerConfettiCelebration();

    return { pointsEarned, streak: newStreak };
  };

  // Contractor scratch card
  const scratchCardClaim = () => {
    if (!currentUser || currentUser.scratchCardsAvailable <= 0) {
      return { pointsEarned: 0 };
    }
    // Random bonus between 50 and 150 points
    const pointsEarned = Math.floor(50 + Math.random() * 100);

    updateCurrentUser((prev) => ({
      ...prev,
      scratchCardsAvailable: Math.max(0, prev.scratchCardsAvailable - 1),
      availablePoints: prev.availablePoints + pointsEarned,
      totalPoints: prev.totalPoints + pointsEarned,
      lifetimePoints: prev.lifetimePoints + pointsEarned,
    }));

    const newPassbookEntry: PassbookEntry = {
      id: `pb-${Date.now()}`,
      userId: currentUser.id,
      type: 'CREDIT',
      source: 'SCRATCH_CARD',
      title: 'Lucky Gold Scratch Card Prize',
      description: `Scratched reward bonus! Earned ${pointsEarned} Olivia Cash Points`,
      points: pointsEarned,
      cashEquivalent: pointsEarned,
      timestamp: new Date().toISOString(),
    };
    setPassbook((prev) => [newPassbookEntry, ...prev]);
    triggerGoldBurst();

    return { pointsEarned };
  };

  // Stock Scan or Batch Input
  const scanStockCode = (codeOrInvoice: string, merchantId: string, invoiceNum?: string) => {
    if (!currentUser) {
      return { success: false, pointsAwarded: 0, message: 'Please log in first' };
    }

    const trimmed = codeOrInvoice.trim().toUpperCase();
    const targetDepot = depots.find((d) => d.id === merchantId) || depots[0];

    // Check if code was already used
    const existing = stockScans.find((s) => s.batchCode === trimmed);
    if (existing) {
      return {
        success: false,
        pointsAwarded: 0,
        message: `This coupon/batch code was already redeemed on ${new Date(existing.scannedAt).toLocaleDateString()}!`,
      };
    }

    // Determine points based on matched product or generate dynamic points for test codes
    let matchedProduct = products[0];
    let points = 75;

    if (trimmed.includes('250') || trimmed.includes('2.5')) {
      matchedProduct = products[1];
      points = 110;
    } else if (trimmed.includes('400') || trimmed.includes('4.0')) {
      matchedProduct = products[2];
      points = 160;
    } else if (trimmed.includes('MCB') || trimmed.includes('32A')) {
      matchedProduct = products[3];
      points = 95;
    } else if (trimmed.includes('RCCB') || trimmed.includes('40A')) {
      matchedProduct = products[4];
      points = 140;
    } else if (trimmed.includes('SW') || trimmed.includes('MOD')) {
      matchedProduct = products[5];
      points = 120;
    } else if (trimmed.includes('ARM') || trimmed.includes('16MM')) {
      matchedProduct = products[6];
      points = 450;
    } else {
      // Dynamic random sample from catalog
      const randomIdx = Math.floor(Math.random() * products.length);
      matchedProduct = products[randomIdx];
      points = matchedProduct.pointsEarned;
    }

    // Contractor Tier multiplier bonus!
    const tierBonusMultiplier =
      currentUser.tier === 'Platinum Elite' ? 1.5 :
      currentUser.tier === 'Gold Master' ? 1.25 :
      currentUser.tier === 'Silver Expert' ? 1.1 : 1.0;

    const finalPoints = Math.round(points * tierBonusMultiplier);

    const newRecord: StockScanRecord = {
      id: `scan-${Date.now()}`,
      batchCode: trimmed.startsWith('BATCH') || trimmed.startsWith('OLV') ? trimmed : `OLV-STK-${trimmed}`,
      productName: matchedProduct.name,
      category: matchedProduct.category,
      contractorId: currentUser.id,
      contractorName: currentUser.name,
      merchantId: targetDepot.id,
      merchantName: targetDepot.name,
      pointsAwarded: finalPoints,
      scannedAt: new Date().toISOString(),
      invoiceNumber: invoiceNum || `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'APPROVED',
    };

    setStockScans((prev) => [newRecord, ...prev]);

    // Update user balance
    updateCurrentUser((prev) => {
      const newLifetime = prev.lifetimePoints + finalPoints;
      const { tier } = getTierForPoints(newLifetime);
      // Give scratch card every 500 lifetime milestone reached
      const earnedNewScratchCard = Math.floor(newLifetime / 500) > Math.floor(prev.lifetimePoints / 500);

      return {
        ...prev,
        availablePoints: prev.availablePoints + finalPoints,
        totalPoints: prev.totalPoints + finalPoints,
        lifetimePoints: newLifetime,
        tier,
        scratchCardsAvailable: prev.scratchCardsAvailable + (earnedNewScratchCard ? 1 : 0),
      };
    });

    // Add passbook record
    const newPassbookEntry: PassbookEntry = {
      id: `pb-${Date.now()}`,
      userId: currentUser.id,
      type: 'CREDIT',
      source: 'STOCK_PURCHASE',
      title: `Stock Inward: ${matchedProduct.name}`,
      description: `Verified batch code from ${targetDepot.name} (${finalPoints} pts credited)`,
      points: finalPoints,
      cashEquivalent: finalPoints,
      timestamp: new Date().toISOString(),
      referenceId: newRecord.batchCode,
    };
    setPassbook((prev) => [newPassbookEntry, ...prev]);
    triggerConfettiCelebration();

    return {
      success: true,
      pointsAwarded: finalPoints,
      message: `Verified! Credited ${finalPoints} pts for ${matchedProduct.name}`,
      record: newRecord,
    };
  };

  // Admin verifies claim voucher
  const verifyClaimByAdmin = (voucherId: string, remarks?: string) => {
    setVouchers((prev) =>
      prev.map((v) => {
        if (v.id === voucherId) {
          return {
            ...v,
            status: 'READY_FOR_CASH' as VoucherStatus,
            verifiedAt: new Date().toISOString(),
            remarks: remarks || 'Verified by Olivia Operations. Counter cash authorization issued.',
          };
        }
        return v;
      })
    );
  };

  // Admin marks cash disbursed at depot counter
  const disburseCashByAdmin = (voucherId: string, remarks?: string) => {
    setVouchers((prev) =>
      prev.map((v) => {
        if (v.id === voucherId) {
          return {
            ...v,
            status: 'DISBURSED' as VoucherStatus,
            disbursedAt: new Date().toISOString(),
            disbursedByAdminName: currentUser?.name || 'Olivia Regional Cashier',
            remarks: remarks || 'Physical cash disbursed to contractor after verifying Security PIN & identity.',
          };
        }
        return v;
      })
    );
    triggerGoldBurst();
  };

  // Admin rejects voucher
  const rejectClaimByAdmin = (voucherId: string, reason: string) => {
    const targetVoucher = vouchers.find((v) => v.id === voucherId);
    if (!targetVoucher) return;

    setVouchers((prev) =>
      prev.map((v) => {
        if (v.id === voucherId) {
          return {
            ...v,
            status: 'REJECTED' as VoucherStatus,
            remarks: `Rejected: ${reason}`,
          };
        }
        return v;
      })
    );

    // Refund points back to contractor
    if (currentUser && currentUser.id === targetVoucher.contractorId) {
      updateCurrentUser((prev) => ({
        ...prev,
        availablePoints: prev.availablePoints + targetVoucher.pointsRedeemed,
      }));
    }

    // Add passbook refund entry
    const refundPassbook: PassbookEntry = {
      id: `pb-${Date.now()}`,
      userId: targetVoucher.contractorId,
      type: 'CREDIT',
      source: 'ADMIN_ADJUSTMENT',
      title: `Claim Refund (${targetVoucher.claimToken})`,
      description: `Points restored due to rejection: ${reason}`,
      points: targetVoucher.pointsRedeemed,
      cashEquivalent: targetVoucher.pointsRedeemed,
      timestamp: new Date().toISOString(),
      referenceId: targetVoucher.claimToken,
    };
    setPassbook((prev) => [refundPassbook, ...prev]);
  };

  // Admin audit of stock scans
  const auditStockScan = (scanId: string, status: 'APPROVED' | 'REJECTED') => {
    setStockScans((prev) =>
      prev.map((s) => (s.id === scanId ? { ...s, status } : s))
    );
  };

  // Admin create batch
  const createStockBatch = (params: NewBatchParams) => {
    // Generates virtual stock batch for promotions
    const dummyRecord: StockScanRecord = {
      id: `batch-${Date.now()}`,
      batchCode: params.batchCode,
      productName: products.find((p) => p.skuCode === params.skuCode)?.name || 'Olivia Special Promotion Stock',
      category: 'Cables & Wires',
      contractorId: 'SYSTEM',
      contractorName: 'Pre-issued Stock Batch',
      merchantId: depots[0].id,
      merchantName: depots[0].name,
      pointsAwarded: params.points,
      scannedAt: new Date().toISOString(),
      status: 'APPROVED',
    };
    setStockScans((prev) => [dummyRecord, ...prev]);
  };

  // Merchant log stock sale to contractor
  const merchantLogStockSale = (contractorPhone: string, skuId: string, units: number, invoiceNum: string) => {
    const prod = products.find((p) => p.id === skuId) || products[0];
    const pointsAwarded = prod.pointsEarned * units;
    const batchCode = `OLV-MCH-${Math.floor(100000 + Math.random() * 900000)}`;

    const newScan: StockScanRecord = {
      id: `scan-${Date.now()}`,
      batchCode,
      productName: `${prod.name} (x${units})`,
      category: prod.category,
      contractorId: 'CONTRACTOR_AUTO',
      contractorName: `Contractor (${contractorPhone.slice(-4)})`,
      merchantId: currentUser?.id || depots[0].id,
      merchantName: currentUser?.merchantStoreName || depots[0].name,
      pointsAwarded,
      scannedAt: new Date().toISOString(),
      invoiceNumber: invoiceNum,
      status: 'APPROVED',
    };

    setStockScans((prev) => [newScan, ...prev]);
    return {
      success: true,
      message: `Successfully credited ${pointsAwarded} points to phone ${contractorPhone} for invoice ${invoiceNum}. Batch code: ${batchCode}`,
    };
  };

  const activeContractorVouchers = currentUser
    ? vouchers.filter((v) => v.contractorId === currentUser.id)
    : [];

  const totalCashClaimedOverall = vouchers
    .filter((v) => v.status === 'DISBURSED')
    .reduce((sum, v) => sum + v.cashAmount, 0);

  const totalPointsIssuedOverall = stockScans
    .filter((s) => s.status === 'APPROVED')
    .reduce((sum, s) => sum + s.pointsAwarded, 0);

  const pendingCashClaimsCount = vouchers.filter(
    (v) => v.status === 'SUBMITTED' || v.status === 'READY_FOR_CASH'
  ).length;

  return (
    <RewardsContext.Provider
      value={{
        products,
        depots,
        vouchers,
        stockScans,
        passbook,
        createCashClaim,
        performDailyCheckIn,
        scratchCardClaim,
        scanStockCode,
        verifyClaimByAdmin,
        disburseCashByAdmin,
        rejectClaimByAdmin,
        auditStockScan,
        createStockBatch,
        merchantLogStockSale,
        getTierForPoints,
        activeContractorVouchers,
        totalCashClaimedOverall,
        totalPointsIssuedOverall,
        pendingCashClaimsCount,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};
