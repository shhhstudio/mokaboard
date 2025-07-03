import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.GATSBY_SUPABASE_URL as string || "https://supabase.co";
const supabaseAnonKey = process.env.GATSBY_SUPABASE_ANON_KEY as string || "none";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
