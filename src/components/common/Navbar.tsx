import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRewards } from '../../context/RewardsContext';
import {
  ShieldCheck,
  UserCheck,
  Store,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowRightLeft,
  Bell,
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { currentUser, role, logout, allUsers, loginAsDemoUser } = useAuth();
  const { pendingCashClaimsCount } = useRewards();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'admin':
        return { label: 'Admin Portal', icon: ShieldCheck, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'merchant':
        return { label: 'Merchant Hub', icon: Store, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      default:
        return { label: 'Contractor', icon: UserCheck, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
    }
  };

  const badge = getRoleBadge(role);
  const BadgeIcon = badge.icon;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-bold text-slate-950 text-sm tracking-tighter">
            OR
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
              OLIVIA REWARDS
            </span>
            <span className="text-[10px] text-slate-400 tracking-wide font-medium mt-0.5">
              Olivia Marketers Loyalty
            </span>
          </div>
        </div>

        {/* Zone 2: Role Switcher & Navigation Capsule */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${badge.color} hover:bg-slate-800 active:scale-95`}
            title="Click to switch between Contractor, Admin, or Merchant"
          >
            <BadgeIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{badge.label}:</span>
            <span className="truncate max-w-[110px] sm:max-w-[130px] text-white">
              {currentUser?.name.split(' ')[0] || 'User'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Quick Switch Dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2 py-1.5 border-b border-slate-800 mb-1 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ArrowRightLeft className="w-3 h-3" /> Quick Switch Profile
                </span>
                <span className="text-[10px] text-emerald-400">Instant RBAC</span>
              </div>

              <div className="space-y-1">
                {allUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id;
                  const userRoleBadge = getRoleBadge(user.role);
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        loginAsDemoUser(user.id);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        isCurrent ? 'bg-slate-800 text-white font-medium' : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="text-xs truncate">{user.name}</span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {user.role === 'contractor' ? `${user.tier} · ${user.availablePoints} pts` : user.role === 'admin' ? 'Olivia Operations Admin' : user.merchantStoreName}
                        </span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${userRoleBadge.color}`}>
                        {user.role}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-1 border-t border-slate-800 flex items-center justify-between px-1">
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    logout();
                  }}
                  className="w-full text-center py-1.5 text-xs text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Quick Action / Status Counter */}
        <div className="flex items-center gap-2">
          {role === 'contractor' && currentUser && (
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-xs font-mono-nums font-bold text-emerald-300">
                {currentUser.availablePoints.toLocaleString()} <span className="text-[10px] text-emerald-500 font-normal">pts</span>
              </span>
            </div>
          )}

          {role === 'admin' && (
            <div className="flex items-center gap-1.5 bg-amber-950/70 border border-amber-500/30 px-2 py-1 rounded-lg text-amber-300 text-xs font-medium">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono-nums font-bold">{pendingCashClaimsCount}</span>
              <span className="hidden sm:inline text-[11px] text-amber-400/80">claims queue</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
