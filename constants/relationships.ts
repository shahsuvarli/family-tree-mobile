export type RelationshipCode = "parent" | "spouse" | "child" | "sibling";
export type RelationshipKind = "parent" | "spouse" | "sibling";

export interface RelationshipSection {
  code: RelationshipCode;
  kind: RelationshipKind;
  title: string;
  isBloodRelation: boolean;
}

export const RELATIONSHIP_SECTIONS: RelationshipSection[] = [
  {
    code: "parent",
    kind: "parent",
    title: "Parent",
    isBloodRelation: true,
  },
  {
    code: "spouse",
    kind: "spouse",
    title: "Spouse",
    isBloodRelation: false,
  },
  {
    code: "child",
    kind: "parent",
    title: "Child",
    isBloodRelation: true,
  },
  {
    code: "sibling",
    kind: "sibling",
    title: "Sibling",
    isBloodRelation: true,
  },
];

export function buildRelationshipPayload(
  code: RelationshipCode,
  currentPersonId: string,
  relatedPersonId: string,
  profileId: string
) {
  if (code === "parent") {
    return {
      profile_id: profileId,
      source_person_id: relatedPersonId,
      target_person_id: currentPersonId,
      relationship_kind: "parent" as const,
      is_blood_relation: true,
    };
  }

  if (code === "child") {
    return {
      profile_id: profileId,
      source_person_id: currentPersonId,
      target_person_id: relatedPersonId,
      relationship_kind: "parent" as const,
      is_blood_relation: true,
    };
  }

  const [sourcePersonId, targetPersonId] = [currentPersonId, relatedPersonId].sort();

  return {
    profile_id: profileId,
    source_person_id: sourcePersonId,
    target_person_id: targetPersonId,
    relationship_kind: code,
    is_blood_relation: code === "sibling",
  };
}
