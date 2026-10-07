export type UserRole = 'contractor' | 'admin' | 'merchant';

export type TierLevel = 'Bronze Pro' | 'Silver Expert' | 'Gold Master' | 'Platinum Elite';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  tier: TierLevel;
  totalPoints: number;
  availablePoints: number;
  lifetimePoints: number;
  contractorLicenseId?: string;
  merchantStoreName?: string;
  city: string;
  state: string;
  streakDays: number;
  lastCheckInDate?: string;
  scratchCardsAvailable: number;
}

export interface ProductSKU {
  id: string;
  skuCode: string;
  name: string;
  category: 'Cables & Wires' | 'Switchgear & MCBs' | 'Conduits & Fittings' | 'LED & Lighting' | 'Industrial Panels';
  packaging: string;
  mrp: number;
  pointsEarned: number;
  description: string;
  imageUrl?: string;
}

export type VoucherStatus = 'SUBMITTED' | 'VERIFIED' | 'READY_FOR_CASH' | 'DISBURSED' | 'REJECTED';

export interface CashClaimVoucher {
  id: string;
  claimToken: string;
  contractorId: string;
  contractorName: string;
  contractorPhone: string;
  pointsRedeemed: number;
  cashAmount: number; // 1 pt = 1 currency unit
  status: VoucherStatus;
  depotId: string;
  depotName: string;
  depotCity: string;
  securityPin: string;
  createdAt: string;
  verifiedAt?: string;
  disbursedAt?: string;
  disbursedByAdminName?: string;
  remarks?: string;
}

export interface StockScanRecord {
  id: string;
  batchCode: string;
  productName: string;
  category: string;
  contractorId: string;
  contractorName: string;
  merchantId: string;
  merchantName: string;
  pointsAwarded: number;
  scannedAt: string;
  invoiceNumber?: string;
  status: 'APPROVED' | 'PENDING_AUDIT' | 'REJECTED';
}

export interface PassbookEntry {
  id: string;
  userId: string;
  type: 'CREDIT' | 'DEBIT';
  source: 'STOCK_PURCHASE' | 'CASH_REDEMPTION' | 'DAILY_STREAK' | 'SCRATCH_CARD' | 'ADMIN_ADJUSTMENT' | 'REFERRAL';
  title: string;
  description: string;
  points: number;
  cashEquivalent: number;
  timestamp: string;
  referenceId?: string;
}

export interface MerchantDepot {
  id: string;
  name: string;
  dealerCode: string;
  address: string;
  city: string;
  contactPerson: string;
  phone: string;
  cashDisbursalHours: string;
  payoutStatus: 'ACTIVE_DISBURSAL' | 'LIMITED_CASH' | 'TEMPORARILY_CLOSED';
  currentCashFloatLimit: number;
}
