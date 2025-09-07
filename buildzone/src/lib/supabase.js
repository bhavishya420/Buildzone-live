// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// Read from your .env.local file
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single client for the whole app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
