import type {
  RelationshipCode,
  RelationshipKind,
} from "@/constants/relationships";

export interface Person {
  created_at: string;
  gender: number;
  id: string;
  initials: string;
  name: string;
  person_id?: string;
  relationship_code?: RelationshipCode;
  relationship_kind?: RelationshipKind;
  surname: string;
  birth_date?: string;
  life?: number;
  marital_status?: number;
  notes?: string;
  profile_id?: string;
  is_blood_relation?: boolean;
  is_favorite?: boolean;
}

export interface FamilyGroup {
  data: Person[];
  title: string;
}

export interface RelationshipSectionData {
  data: Person[];
  code: RelationshipCode;
  kind: RelationshipKind;
  title: string;
  isBloodRelation: boolean;
}

export interface SelectedPersonSummary {
  id: string;
  name: string;
  is_favorite: boolean;
}
