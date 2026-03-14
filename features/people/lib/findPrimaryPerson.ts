import { supabase } from "@/lib/supabase/client";

interface ProfileRecord {
  name: string;
  surname: string | null;
}

interface PersonRecord {
  id: string;
  name: string;
}

export interface PrimaryPersonResult {
  id: string;
  name: string;
}

async function findPersonByProfileName(
  profileId: string,
  profile: ProfileRecord
): Promise<PersonRecord | null> {
  let query = supabase
    .from("people")
    .select("id, name")
    .eq("profile_id", profileId)
    .eq("name", profile.name)
    .order("created_at", { ascending: true })
    .limit(1);

  if (profile.surname) {
    query = query.eq("surname", profile.surname);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("Failed to find person by profile name", error.message);
    return null;
  }

  return data;
}

async function findFirstProfilePerson(
  profileId: string
): Promise<PersonRecord | null> {
  const { data, error } = await supabase
    .from("people")
    .select("id, name")
    .eq("profile_id", profileId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to find first profile person", error.message);
    return null;
  }

  return data;
}

export default async function findPrimaryPerson(
  profileId: string
): Promise<PrimaryPersonResult | null> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, surname")
    .eq("id", profileId)
    .single<ProfileRecord>();

  if (profileError) {
    console.error("Failed to load profile for family route", profileError.message);
  }

  if (profile) {
    const matchingPerson = await findPersonByProfileName(profileId, profile);
    if (matchingPerson) {
      return matchingPerson;
    }
  }

  const firstPerson = await findFirstProfilePerson(profileId);
  if (firstPerson) {
    return firstPerson;
  }

  if (profile) {
    return {
      id: profileId,
      name: profile.name,
    };
  }

  return null;
}
