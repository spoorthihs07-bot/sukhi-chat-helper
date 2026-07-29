import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.EXT_SUPABASE_URL as string;
const anonKey = process.env.EXT_SUPABASE_ANON_KEY as string;
const serviceKey = process.env.EXT_SUPABASE_SERVICE_ROLE_KEY as string;

export const ADMIN_EMAIL = "spoorthihs07@gmail.com";

export function anonClient(): SupabaseClient {
  if (!url || !anonKey) throw new Error("EXT_SUPABASE_URL / EXT_SUPABASE_ANON_KEY not configured");
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function adminClient(): SupabaseClient {
  if (!url || !serviceKey) throw new Error("EXT_SUPABASE_URL / EXT_SUPABASE_SERVICE_ROLE_KEY not configured");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function verifyAdminToken(accessToken: string | undefined | null) {
  if (!accessToken) throw new Error("Not authenticated");
  const { data, error } = await anonClient().auth.getUser(accessToken);
  if (error || !data.user) throw new Error("Invalid session");
  if ((data.user.email ?? "").toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error("Forbidden");
  }
  return data.user;
}
