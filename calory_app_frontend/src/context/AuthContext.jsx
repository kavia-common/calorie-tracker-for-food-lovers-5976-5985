import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken, clearToken, getUser, setUser } from "../utils/storage";
import { login as apiLogin, register as apiRegister, fetchProfile, logout as apiLogout } from "../services/auth";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication state and actions. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state (user, token) and actions (login, register, logout). */
  const [token, setTokenState] = useState(getToken());
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (!token) return;
      try {
        const profile = await fetchProfile(token);
        if (!cancelled) {
          setUserState(profile);
          setUser(profile);
        }
      } catch {
        // Token may be invalid/expired; clear
        if (!cancelled) {
          handleLogout();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (email, password) => {
    const data = await apiLogin(email, password);
    if (data?.token) {
      setToken(data.token);
      setTokenState(data.token);
    }
    if (data?.user) {
      setUserState(data.user);
      setUser(data.user);
    }
    return data;
  };

  const handleRegister = async (payload) => {
    const data = await apiRegister(payload);
    return data;
  };

  const handleLogout = () => {
    apiLogout();
    clearToken();
    setTokenState(null);
    setUserState(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      loading,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
