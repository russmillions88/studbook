import { createBrowserClient } from '@supabase/ssr';

// Used in Client Components (anything with 'use client' at the top).
// Reads the two public env vars — safe to expose in the browser,
// since RLS policies (set up in schema.sql) control what data is
// actually accessible, not this key.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
