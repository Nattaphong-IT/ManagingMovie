// context/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import type { AuthState, User, LoginRequest } from '../../types/auth.types';
import { api } from '../../lib/utils';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
  ready: boolean; // ✅ เพิ่ม
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

const authReducer = (state: AuthState & { loading: boolean }, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, loading: false };
    case 'LOGIN_ERROR':
      return { ...state, loading: false };
    case 'LOGOUT':
      return { user: null, token: null, isAuthenticated: false, loading: false };
    case 'RESTORE_SESSION':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, loading: false };
    default:
      return state;
  }
};

const initialState: AuthState & { loading: boolean } = { user: null, token: null, isAuthenticated: false, loading: false };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [ready, setReady] = useState(false); // ✅ เพิ่ม

  useEffect(() => {
    const savedUser = localStorage.getItem('mm_user');
    const savedToken = localStorage.getItem('mm_token');
    if (savedUser && savedToken) {
      dispatch({ type: 'RESTORE_SESSION', payload: { user: JSON.parse(savedUser), token: savedToken } });
    }
    setReady(true); // ✅ รออ่าน localStorage เสร็จ
  }, []);

  const login = async (credentials: LoginRequest) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data?.token) {
        localStorage.setItem('mm_token', res.data.token);
        localStorage.setItem('mm_user', JSON.stringify(res.data.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: res.data.user, token: res.data.token } });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, loading: state.loading, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
