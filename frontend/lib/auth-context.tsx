'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from './supabase';
import { fetchApi } from './api-client';
import type { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (activeUser?: User | null) => {
    try {
      const data = await fetchApi<UserProfile>('/users/me');
      if (data) {
        const resolvedAvatar = data.avatar || (activeUser?.user_metadata?.avatar as string) || '';
        setProfile({ ...data, avatar: resolvedAvatar });
        return;
      }
    } catch {
      // API call error or offline backend
    }

    // Fallback profile based on active session / metadata if backend /users/me is temporarily unreachable
    if (activeUser) {
      const assignedRole = (activeUser.user_metadata?.role as any) || 'MEMBER';
      const fallback: UserProfile = {
        _id: activeUser.id,
        supabaseUserId: activeUser.id,
        fullName:
          (activeUser.user_metadata?.full_name as string) ||
          (activeUser.user_metadata?.fullName as string) ||
          'Community Member',
        email: activeUser.email || '',
        phone: (activeUser.user_metadata?.phone as string) || '',
        avatar: (activeUser.user_metadata?.avatar as string) || '',
        bio: (activeUser.user_metadata?.bio as string) || '',
        address: (activeUser.user_metadata?.address as string) || '',
        interests: (activeUser.user_metadata?.interests as string[]) || [],
        bloodGroup: (activeUser.user_metadata?.bloodGroup as string) || '',
        role: assignedRole,
        status: 'active',
        createdAt: activeUser.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProfile(fallback);
    } else {
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const { data: { session: activeSession } } = await supabase.auth.getSession();
    if (activeSession) {
      setSession(activeSession);
      setUser(activeSession.user);
    }
    await fetchUserProfile(activeSession?.user ?? user);
  }, [fetchUserProfile, user]);

  useEffect(() => {
    let unsubscribeFn: (() => void) | undefined;

    try {
      const supabase = getSupabaseBrowserClient();

      supabase.auth.getSession().then(({ data: { session } }: any) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user).finally(() => setIsLoading(false));
        } else {
          setIsLoading(false);
        }
      }).catch(() => {
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event: any, newSession: any) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) {
            await fetchUserProfile(newSession.user);
          } else {
            setProfile(null);
          }
          setIsLoading(false);
        }
      );

      unsubscribeFn = () => {
        subscription.unsubscribe();
      };
    } catch {
      setIsLoading(false);
    }

    return () => {
      unsubscribeFn?.();
    };
  }, [fetchUserProfile]);

  const logout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
