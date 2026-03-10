import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, loginRedirect, logoutUser, fetchUserPrefs, type UserPrefs } from '@/lib/api-helpers';

interface AuthState {
  user: any | null;
  loading: boolean;
  prefs: UserPrefs | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    prefs: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      let prefs: UserPrefs | null = null;
      if (user) {
        prefs = await fetchUserPrefs();
      }
      setState({ user, loading: false, prefs });
    } catch {
      setState({ user: null, loading: false, prefs: null });
    }
  };

  const login = useCallback(async () => {
    await loginRedirect();
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setState({ user: null, loading: false, prefs: null });
  }, []);

  const isLoggedIn = !!state.user;
  const subscriptionTier = state.prefs?.subscription_tier || 'recruit';

  return {
    user: state.user,
    loading: state.loading,
    prefs: state.prefs,
    isLoggedIn,
    subscriptionTier,
    login,
    logout,
    refresh: checkAuth,
  };
}