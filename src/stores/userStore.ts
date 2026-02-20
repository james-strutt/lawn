import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = 'first-home-buyer' | 'investor' | 'upgrader' | null;
export type SubscriptionTier = 'free' | 'pro' | null;

interface UserProfile {
  email: string | null;
  userType: UserType;
  subscriptionTier: SubscriptionTier;
  annualIncome?: number;
  deposit?: number;
  isFirstHomeBuyer: boolean;
}

interface UserState {
  user: UserProfile;
  isAuthenticated: boolean;
  setUser: (user: Partial<UserProfile>) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setUserType: (userType: UserType) => void;
  setSubscription: (tier: SubscriptionTier) => void;
  logout: () => void;
}

const DEFAULT_USER: UserProfile = {
  email: null,
  userType: null,
  subscriptionTier: 'free',
  isFirstHomeBuyer: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: DEFAULT_USER,
      isAuthenticated: false,

      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

      setUserType: (userType) =>
        set((state) => ({
          user: { ...state.user, userType },
        })),

      setSubscription: (tier) =>
        set((state) => ({
          user: { ...state.user, subscriptionTier: tier },
        })),

      logout: () =>
        set({
          user: DEFAULT_USER,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'lawn-user-storage',
    }
  )
);
