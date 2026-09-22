import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { config } from './env';

// Server-side Supabase Admin client (uses Service Role Key)
// This client bypasses Row Level Security — use ONLY on backend
export const supabaseAdmin = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      transport: ws as any,
    },
  }
);
