
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = "https://wihjkyjnrrukmiksqjdx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpaGpreWpucnJ1a21pa3NxamR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzOTU5ODYsImV4cCI6MjA1ODk3MTk4Nn0.cQlVuSCM8PT4ZYpLK9BZJeogvpUxiGWyT4ytph8nCV4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
