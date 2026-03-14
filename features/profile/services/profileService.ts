import { supabase } from "@/lib/supabase/client";

/**
 * Fetch the profile overview (stats + name) for a given user ID.
 */
export async function fetchProfileOverview(userId: string) {
  return supabase
    .from("profile_overview")
    .select("*")
    .eq("id", userId)
    .single();
}

/**
 * Fetch basic profile fields (name, surname) for editing.
 */
export async function fetchProfile(userId: string) {
  return supabase
    .from("profiles")
    .select("name, surname")
    .eq("id", userId)
    .single();
}

/**
 * Update profile name and surname.
 */
export async function updateProfile(
  userId: string,
  payload: { name: string; surname: string },
) {
  return supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select("name, surname")
    .single();
}
