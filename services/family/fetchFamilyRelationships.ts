import { RELATIONSHIP_SECTIONS } from "@/constants/relationships";
import { supabase } from "@/lib/supabase/client";
import type { Person, RelationshipSectionData } from "@/types/person";

function createEmptyRelationshipSections(): RelationshipSectionData[] {
  return RELATIONSHIP_SECTIONS.map((section) => ({
    ...section,
    data: [],
  }));
}

export default async function fetchFamilyRelationships(
  personId: string
): Promise<RelationshipSectionData[]> {
  const { data, error } = await supabase.rpc("get_person_relationships", {
    target_person_id: personId,
  });

  const groupedRelationships = createEmptyRelationshipSections();

  if (error) {
    console.error("Failed to fetch family relationships", error.message);
    return groupedRelationships;
  }

  data?.forEach((relationship: Person) => {
    const section = groupedRelationships.find(
      (item) => item.code === relationship.relationship_code
    );

    if (section) {
      section.data.push(relationship);
    }
  });

  return groupedRelationships;
}
