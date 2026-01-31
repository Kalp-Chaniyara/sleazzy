import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Sleazzy] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env. Copy .env.example to .env and add your Supabase credentials. The app will load but auth will not work.'
  );
}

// Use placeholders when env vars are missing so the app can at least render
const effectiveUrl = supabaseUrl || 'https://placeholder.supabase.co';
const effectiveKey = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase: SupabaseClient = createClient(effectiveUrl, effectiveKey);
