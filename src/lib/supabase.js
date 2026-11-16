// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getRedirectUrl = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  const protocol = window.location.protocol;

  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

  if (isLocal) {
    return `${protocol}//${hostname}:${port}/auth/callback`;
  }

  // ✅ Usar el origen actual (dinámico)
  return `${window.location.origin}/auth/callback`;
};