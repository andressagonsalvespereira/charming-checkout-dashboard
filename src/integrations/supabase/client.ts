// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://swfnbzfwiwuaakgzqmsk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Zm5iemZ3aXd1YWFrZ3pxbXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjM0NjcsImV4cCI6MjA1OTc5OTQ2N30.kHrVm1gInY9dOtC5QHccGuR9tapdJhtHP5y0iI280G0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);