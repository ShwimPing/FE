import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      const storedAccessToken = await AsyncStorage.getItem('accessToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      if (storedAccessToken) { setAccessToken(storedAccessToken); }
      if (storedRefreshToken) { setRefreshToken(storedRefreshToken); }
    };
    loadTokens();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://211.188.51.4/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.isSuccess && data.results) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.results;

        if (newAccessToken) {
          setAccessToken(newAccessToken);
          await AsyncStorage.setItem('accessToken', newAccessToken);
        }

        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
        }

      } else {
        throw new Error(data.message || '로그인 실패');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  const logout = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) { throw new Error('리프레시 토큰이 없습니다.'); }

      const response = await fetch('http://211.188.51.4/auth/reissue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: refreshToken,
        },
      });

      const data = await response.json();
      if (data.isSuccess && data.results.accessToken) {
        const newAccessToken = data.results.accessToken;
        setAccessToken(newAccessToken);
        await AsyncStorage.setItem('accessToken', newAccessToken);
      } else {
        throw new Error('토큰 갱신 실패');
      }
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다.');
  }
  return context;
};
