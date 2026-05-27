import React from 'react';
import PropTypes from 'prop-types';
import { getSession, setSession, clearSession } from '../utils/storage';

const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = React.useState(() => getSession());

  React.useEffect(() => {
    setSessionState(getSession());
  }, []);

  const login = React.useCallback((sessionObj) => {
    setSession(sessionObj);
    setSessionState(sessionObj);
  }, []);

  const logout = React.useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  const value = React.useMemo(
    () => ({
      session,
      isLoggedIn: !!session,
      role: session?.role || 'user',
      login,
      logout,
    }),
    [session, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}