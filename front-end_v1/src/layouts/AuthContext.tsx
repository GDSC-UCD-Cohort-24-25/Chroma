import React, { createContext, useContext, useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL|| 'http://localhost:3000';
import {refreshPage} from '../services/apiService'

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  name: string | null;
  total: number;
  email: string | null;
  login: () => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  getName: () => string | null;
  getTotal: () => number;
  getEmail: () => string | null;
  refreshUserInfo: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const refreshUserInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/checkstatus`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setName(data.name);
        setEmail(data.email);
        setTotal(data.total);
      }
      else{throw Error('Could not be authenticated');}
    } catch (err:any) {
      console.log(err.message || "Failed to refresh user info");
    }
  };
  
  const refreshAuth = async () => {
    try {
      const res = await refreshPage();
      if (res.success) {
        setIsAuthenticated(true);
        console.log('Token refreshed');
      } else {
        setIsAuthenticated(false);
        console.log('Refresh failed');
      }
    } catch (err: any) {
      setIsAuthenticated(false);
      console.log("Refresh failed:", err);
    }
  };
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('cheking authentication fetch');
        const res = await fetch(`${API_BASE_URL}/api/checkstatus`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        console.log(res);
        const data = await res.json();
        if (!data.success) {
          throw Error('Could not be authenticated');
        }
        setIsAuthenticated(true);
        setName(data.name);
        setEmail(data.email);
        setTotal(data.total);
      } catch (err: any) {
        console.log(err.message);
        await refreshAuth();
        
      } finally {
        console.log('loading');
        setLoading(false);
      }
    };

    checkAuth();
    

  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
      setIsAuthenticated(false);
      setName(null);
      setEmail(null);
  };
  const getName = () => name;
  const getTotal = () => total;
  const getEmail = () => email;
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, name, total, email, login, logout, refreshAuth, getName, getTotal, getEmail, refreshUserInfo}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
