import React, { createContext, useContext, useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL|| 'http://localhost:3000';
import {refreshPage} from '../services/apiService'

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: () => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
    } catch (err) {
      setIsAuthenticated(false);
      console.log("Refresh failed:", err);
    }
  };
  /*const controller = new AbortController();

  const timeout = setTimeout(() => {
    console.warn('⏱️ checkAuth timed out');
    controller.abort(); //  Cancel the request after 5s
  }, 10000); // 10 seconds
  */
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
          //signal: controller.signal,
        });
        console.log(res);
        const data = await res.json();
        if (!data.success) {
          throw Error('Could not be authenticated');
        }
        console.log('authenticated', data);
        setIsAuthenticated(true);
        
      } catch (err: any) {
        console.log(err.message);
        await refreshAuth();
        
      } finally {
        //clearTimeout(timeout);
        console.log('loading');
        setLoading(false);
        
      }
    };

    if (!isAuthenticated) checkAuth();
    /*return () => {
      clearTimeout(timeout);
      controller.abort();
    };*/

  }, []);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
      setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, refreshAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
