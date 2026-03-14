import { supabase } from "@/lib/supabase/client";
import type { PersonPayload } from "@/features/people/lib/person-form";

/**
 * Fetch all people for a profile, optionally filtered by a search string.
 */
export async function fetchPeople(profileId: string, search = "") {
  return supabase
    .from("people")
    .select("*")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: false })
    .or(`name.ilike.%${search}%,surname.ilike.%${search}%`);
}

/**
 * Fetch all people for a profile excluding a specific person (used in add-relative).
 */
export async function fetchPeopleExcluding(
  profileId: string,
  excludePersonId: string,
  search = "",
) {
  return supabase
    .from("people")
    .select("*")
    .eq("profile_id", profileId)
    .neq("id", excludePersonId)
    .order("created_at", { ascending: false })
    .or(`name.ilike.%${search}%,surname.ilike.%${search}%`);
}

/**
 * Fetch a single person by ID.
 */
export async function fetchPersonById(personId: string) {
  return supabase.from("people").select("*").eq("id", personId).single();
}

/**
 * Insert a new person record.
 */
export async function insertPerson(payload: PersonPayload) {
  return supabase
    .from("people")
    .insert([payload])
    .select("id, name, surname")
    .single();
}

/**
 * Update an existing person record.
 */
export async function updatePerson(personId: string, payload: PersonPayload) {
  return supabase
    .from("people")
    .update(payload)
    .eq("id", personId)
    .select("name, surname")
    .single();
}

/**
 * Toggle the is_favorite flag on a person.
 */
export async function updatePersonFavorite(
  personId: string,
  isFavorite: boolean,
) {
  return supabase
    .from("people")
    .update({ is_favorite: isFavorite })
    .eq("id", personId);
}
