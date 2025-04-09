
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const SUPABASE_URL = "https://swfnbzfwiwuaakgzqmsk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Zm5iemZ3aXd1YWFrZ3pxbXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjM0NjcsImV4cCI6MjA1OTc5OTQ2N30.kHrVm1gInY9dOtC5QHccGuR9tapdJhtHP5y0iI280G0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
