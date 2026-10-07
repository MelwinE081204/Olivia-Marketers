import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAsDemoUser: (userId: string) => void;
  loginWithCredentials: (phone: string, pin: string, role: UserRole) => boolean;
  logout: () => void;
  updateCurrentUser: (updater: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)) => void;
  allUsers: UserProfile[];
  isAdmin: boolean;
  isContractor: boolean;
  isMerchant: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'olivia_rewards_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load user session', e);
    }
    // Default to Rajesh Sharma (Contractor) for first run
    return INITIAL_USERS[0];
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('olivia_rewards_all_users');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      // sync into allUsers
      setAllUsers((prev) => {
        const next = prev.map((u) => (u.id === currentUser.id ? currentUser : u));
        localStorage.setItem('olivia_rewards_all_users', JSON.stringify(next));
        return next;
      });
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  const loginAsDemoUser = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId) || INITIAL_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const loginWithCredentials = (phone: string, _pin: string, requestedRole: UserRole): boolean => {
    // Check if user exists with matching phone and role
    const cleanPhone = phone.replace(/\s+/g, '');
    const found = allUsers.find(
      (u) => u.phone.replace(/\s+/g, '') === cleanPhone && u.role === requestedRole
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }

    // If not found, create a new profile for demo friendliness!
    const isNewContractor = requestedRole === 'contractor';
    const newUser: UserProfile = {
      id: `user-${requestedRole}-${Date.now()}`,
      name: isNewContractor ? 'Praveen Yadav' : requestedRole === 'admin' ? 'Olivia Admin Officer' : 'National Hardware Store',
      phone,
      role: requestedRole,
      tier: 'Bronze Pro',
      totalPoints: isNewContractor ? 500 : 0,
      availablePoints: isNewContractor ? 500 : 0,
      lifetimePoints: isNewContractor ? 500 : 0,
      contractorLicenseId: isNewContractor ? 'E-LIC-MH-2026-NEW' : undefined,
      merchantStoreName: requestedRole === 'merchant' ? 'National Hardware Store' : undefined,
      city: 'Mumbai',
      state: 'Maharashtra',
      streakDays: 1,
      scratchCardsAvailable: 1,
    };
    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateCurrentUser = (updater: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      if (typeof updater === 'function') {
        return updater(prev);
      }
      return { ...prev, ...updater };
    });
  };

  const role = currentUser?.role || 'contractor';
  const isAdmin = role === 'admin';
  const isContractor = role === 'contractor';
  const isMerchant = role === 'merchant';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated: !!currentUser,
        loginAsDemoUser,
        loginWithCredentials,
        logout,
        updateCurrentUser,
        allUsers,
        isAdmin,
        isContractor,
        isMerchant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
