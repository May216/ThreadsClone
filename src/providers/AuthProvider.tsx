import { ActivityIndicator, View } from 'react-native';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';

import { supabase } from '../lib/supabase';
import { Tables } from '@/types/database.types';
import { getProfileById } from '@/services/profiles';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  profile: Tables<'profiles'> | null;
};

const AuthContext = createContext<AuthContextType | undefined>({
  user: null,
  isAuthenticated: false,
  profile: null,
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfileById(user?.id!)
  })

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const value = {
    user,
    isAuthenticated,
    profile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
