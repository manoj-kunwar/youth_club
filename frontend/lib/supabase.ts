import { createBrowserClient } from '@supabase/ssr';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export function isMockSupabase(): boolean {
  // Returns false so the application runs with real database auth
  return false;
}

// ─── Real Database & API Auth Client ──────────────────────────────────────────
const SESSION_STORAGE_KEY = 'high_school_youth_club_auth_session';
const LEGACY_STORAGE_KEY = 'hamro_chowk_auth_session';

type AuthListener = (event: AuthChangeEvent, session: Session | null) => void;
const listeners: Set<AuthListener> = new Set();

function getStoredSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Basic expiry check
    if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function setStoredSession(session: Session | null) {
  if (typeof window === 'undefined') return;
  try {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // ignore quota/storage issues
  }
}

function buildSupabaseUserAndSession(userDoc: any, token: string): { user: User; session: Session } {
  const user: User = {
    id: userDoc._id || userDoc.id,
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {
      full_name: userDoc.fullName,
      phone: userDoc.phone || '',
      role: userDoc.role,
      memberId: userDoc.memberId,
      adminId: userDoc.adminId,
    },
    aud: 'authenticated',
    confirmation_sent_at: '',
    recovery_sent_at: '',
    email_change_sent_at: '',
    new_email: '',
    invited_at: '',
    action_link: '',
    email: userDoc.email,
    phone: userDoc.phone || '',
    created_at: userDoc.createdAt || new Date().toISOString(),
    confirmed_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: '',
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: userDoc.updatedAt || new Date().toISOString(),
    identities: [],
    is_anonymous: false,
  };

  const session: Session = {
    access_token: token,
    token_type: 'bearer',
    expires_in: 7 * 86400,
    expires_at: Math.floor(Date.now() / 1000) + 7 * 86400,
    refresh_token: token,
    user,
  };

  return { user, session };
}

function createBackendApiClient() {
  return {
    auth: {
      async signUp({ email, password, options }: { email: string; password?: string; options?: { data?: Record<string, any> } }) {
        const fullName = options?.data?.full_name || options?.data?.fullName || email.split('@')[0];
        const phone = options?.data?.phone || '';

        try {
          const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName, phone }),
          });

          const json = await res.json();
          if (!res.ok || !json.success) {
            const errorMsg = json.error?.message || json.message || 'Registration failed';
            return { data: { user: null, session: null }, error: new Error(errorMsg) };
          }

          const { user, session } = buildSupabaseUserAndSession(json.data.user, json.data.token);
          setStoredSession(session);
          listeners.forEach((l) => l('SIGNED_IN', session));

          return { data: { user, session }, error: null };
        } catch (err: any) {
          return { data: { user: null, session: null }, error: new Error(err.message || 'Network error connecting to auth server') };
        }
      },


      async signInWithPassword({ email, password }: { email: string; password?: string }) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const json = await res.json();
          if (!res.ok || !json.success) {
            const errorMsg = json.error?.message || json.message || 'Invalid email or password';
            return { data: { user: null, session: null }, error: new Error(errorMsg) };
          }

          const { user, session } = buildSupabaseUserAndSession(json.data.user, json.data.token);
          setStoredSession(session);
          listeners.forEach((l) => l('SIGNED_IN', session));

          return { data: { user, session }, error: null };
        } catch (err: any) {
          return { data: { user: null, session: null }, error: new Error(err.message || 'Network error connecting to auth server') };
        }
      },

      async adminSignUp({
        email,
        password,
        confirmPassword,
        fullName,
        adminSecurityKey,
      }: {
        email: string;
        password?: string;
        confirmPassword?: string;
        fullName?: string;
        adminSecurityKey?: string;
      }) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/admin/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              password,
              confirmPassword,
              fullName,
              adminSecurityKey,
            }),
          });

          const json = await res.json();
          if (!res.ok || !json.success) {
            const errorMsg = json.error?.message || json.message || 'Administrator registration failed';
            return { data: { user: null, session: null }, error: new Error(errorMsg) };
          }

          const { user, session } = buildSupabaseUserAndSession(json.data.user, json.data.token);
          setStoredSession(session);
          listeners.forEach((l) => l('SIGNED_IN', session));

          return { data: { user, session }, error: null };
        } catch (err: any) {
          return { data: { user: null, session: null }, error: new Error(err.message || 'Network error connecting to auth server') };
        }
      },

      async adminSignIn({ email, password }: { email: string; password?: string }) {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const json = await res.json();
          if (!res.ok || !json.success) {
            const errorMsg = json.error?.message || json.message || 'Invalid administrator credentials';
            return { data: { user: null, session: null }, error: new Error(errorMsg) };
          }

          const { user, session } = buildSupabaseUserAndSession(json.data.user, json.data.token);
          setStoredSession(session);
          listeners.forEach((l) => l('SIGNED_IN', session));

          return { data: { user, session }, error: null };
        } catch (err: any) {
          return { data: { user: null, session: null }, error: new Error(err.message || 'Network error connecting to auth server') };
        }
      },

      async signOut() {
        const session = getStoredSession();
        if (session?.access_token) {
          try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
            });
          } catch {
            // Ignore failure on logout
          }
        }
        setStoredSession(null);
        listeners.forEach((l) => l('SIGNED_OUT', null));
        return { error: null };
      },

      async getSession() {
        const session = getStoredSession();
        return { data: { session }, error: null };
      },

      async getUser() {
        const session = getStoredSession();
        return { data: { user: session?.user ?? null }, error: null };
      },

      async resetPasswordForEmail(_email: string, _options?: { redirectTo?: string }) {
        return {
          data: {},
          error: new Error('Direct password reset is disabled. Please contact club administration.'),
        };
      },

      async updateUser(attributes: { data?: Record<string, any>; email?: string; password?: string }) {
        const session = getStoredSession();
        if (!session?.access_token) {
          return { data: { user: null }, error: new Error('User not authenticated') };
        }

        try {
          const updatePayload: Record<string, any> = {};
          if (attributes.data) {
            if (attributes.data.fullName || attributes.data.full_name) {
              updatePayload.fullName = attributes.data.fullName || attributes.data.full_name;
            }
            if (attributes.data.phone !== undefined) updatePayload.phone = attributes.data.phone;
            if (attributes.data.avatar !== undefined) updatePayload.avatar = attributes.data.avatar;
            if (attributes.data.bio !== undefined) updatePayload.bio = attributes.data.bio;
            if (attributes.data.address !== undefined) updatePayload.address = attributes.data.address;
            if (attributes.data.interests !== undefined) updatePayload.interests = attributes.data.interests;
            if (attributes.data.bloodGroup !== undefined) updatePayload.bloodGroup = attributes.data.bloodGroup;
            if (attributes.data.dateOfBirth !== undefined) updatePayload.dateOfBirth = attributes.data.dateOfBirth;
          }

          let updatedDoc: any = null;
          if (Object.keys(updatePayload).length > 0) {
            try {
              const res = await fetch(`${API_BASE_URL}/users/me`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(updatePayload),
              });
              const json = await res.json();
              if (res.ok && json.success) {
                updatedDoc = json.data;
              }
            } catch {
              // Non-blocking sync
            }
          }

          const currentUser = session.user;
          const mergedMetadata = {
            ...(currentUser.user_metadata || {}),
            ...(attributes.data || {}),
          };

          const updatedUser: User = {
            ...currentUser,
            user_metadata: mergedMetadata,
            ...(updatedDoc?.fullName ? { user_metadata: { ...mergedMetadata, full_name: updatedDoc.fullName, fullName: updatedDoc.fullName } } : {}),
            updated_at: new Date().toISOString(),
          };

          const updatedSession: Session = {
            ...session,
            user: updatedUser,
          };

          setStoredSession(updatedSession);
          listeners.forEach((l) => l('USER_UPDATED', updatedSession));

          return { data: { user: updatedUser }, error: null };
        } catch (err: any) {
          return { data: { user: null }, error: new Error(err.message || 'Failed to update user profile') };
        }
      },

      onAuthStateChange(callback: AuthListener) {
        listeners.add(callback);
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                listeners.delete(callback);
              },
            },
          },
        };
      },
    },
  };
}

export function createSupabaseBrowserClient(): any {
  // If valid Supabase URL is supplied (not placeholder and reachable), use real Supabase
  if (
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('example.com') &&
    !supabaseAnonKey.includes('placeholder') &&
    process.env.NEXT_PUBLIC_USE_MOCK_AUTH !== 'true'
  ) {
    try {
      return createBrowserClient(supabaseUrl, supabaseAnonKey);
    } catch {
      // Fall through to backend API auth
    }
  }
  return createBackendApiClient();
}

// Singleton for use in non-component contexts (hooks, utilities)
let browserClient: any = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }
  return browserClient;
}

// ─── Real Production Authentication API Methods ────────────────────────────

export async function memberRegisterApi(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || json.message || 'Registration failed');
  }
  if (json.data?.token && json.data?.user) {
    const { user, session } = buildSupabaseUserAndSession(json.data.user, json.data.token);
    setStoredSession(session);
    listeners.forEach((l) => l('SIGNED_IN', session));
  }
  return json.data;
}

export async function memberLoginApi(data: { emailOrId: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || json.message || 'Invalid credentials');
  }
  const { user, session } = buildSupabaseUserAndSession(json.data.user, json.data.token);
  setStoredSession(session);
  listeners.forEach((l) => l('SIGNED_IN', session));
  return json.data;
}

export async function adminRegisterApi(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  adminSecurityKey?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/admin/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || json.message || 'Administrator registration failed');
  }
  return json.data;
}

export async function adminLoginApi(data: { emailOrId: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || json.message || 'Invalid administrator credentials');
  }
  const { user, session } = buildSupabaseUserAndSession(json.data.user, json.data.token);
  setStoredSession(session);
  listeners.forEach((l) => l('SIGNED_IN', session));
  return json.data;
}



