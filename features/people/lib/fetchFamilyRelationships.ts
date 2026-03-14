import { RELATIONSHIP_SECTIONS } from "@/constants/relationships";
import { supabase } from "@/lib/supabase/client";
import type { Person, RelationshipSectionData } from "@/types/person";

interface NormalizedRelationship {
  id: string;
  is_blood_relation: boolean;
  person_id: string;
  relationship_code: Person["relationship_code"];
  relationship_kind: Person["relationship_kind"];
}

interface RelationshipRow {
  id: string;
  is_blood_relation: boolean;
  relationship_kind: "parent" | "spouse" | "sibling";
  source_person_id: string;
  target_person_id: string;
}

function createEmptyRelationshipSections(): RelationshipSectionData[] {
  return RELATIONSHIP_SECTIONS.map((section) => ({
    ...section,
    data: [],
  }));
}

export default async function fetchFamilyRelationships(
  personId: string
): Promise<RelationshipSectionData[]> {
  const groupedRelationships = createEmptyRelationshipSections();

  const { data: relationshipRows, error } = await supabase
    .from("relationships")
    .select(
      "id, relationship_kind, is_blood_relation, source_person_id, target_person_id"
    )
    .or(`source_person_id.eq.${personId},target_person_id.eq.${personId}`);

  if (error) {
    console.error("Failed to fetch family relationships", error.message);
    return groupedRelationships;
  }

  const normalizedRelationships = (relationshipRows ?? [])
    .map((relationship) => {
      const row = relationship as RelationshipRow;
      const isCurrentPersonSource = row.source_person_id === personId;
      const relatedPersonId = isCurrentPersonSource
        ? row.target_person_id
        : row.source_person_id;

      if (!relatedPersonId || relatedPersonId === personId) {
        return null;
      }

      const relationshipCode =
        row.relationship_kind === "parent"
          ? isCurrentPersonSource
            ? "child"
            : "parent"
          : row.relationship_kind;

      return {
        id: row.id,
        is_blood_relation: row.is_blood_relation,
        person_id: relatedPersonId,
        relationship_code: relationshipCode,
        relationship_kind: row.relationship_kind,
      };
    })
    .filter(
      (relationship): relationship is NormalizedRelationship =>
        relationship !== null
    );

  const relatedPersonIds = Array.from(
    new Set(normalizedRelationships.map((relationship) => relationship.person_id))
  );

  if (relatedPersonIds.length === 0) {
    return groupedRelationships;
  }

  const { data: peopleRows, error: peopleError } = await supabase
    .from("people")
    .select("id, created_at, gender, initials, name, surname")
    .in("id", relatedPersonIds);

  if (peopleError) {
    console.error("Failed to fetch related people", peopleError.message);
    return groupedRelationships;
  }

  const peopleById = new Map(
    (peopleRows ?? []).map((person) => [person.id, person as Person])
  );

  normalizedRelationships
    .map((relationship) => {
      const person = peopleById.get(relationship.person_id);

      if (!person) {
        return null;
      }

      return {
        ...person,
        id: relationship.id,
        person_id: relationship.person_id,
        relationship_code: relationship.relationship_code,
        relationship_kind: relationship.relationship_kind,
        is_blood_relation: relationship.is_blood_relation,
      } as Person;
    })
    .filter((relationship): relationship is Person => relationship !== null)
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    )
    .forEach((relationship) => {
      const section = groupedRelationships.find(
        (item) => item.code === relationship.relationship_code
      );

      if (section) {
        section.data.push(relationship);
      }
    });

  return groupedRelationships;
}
