import { format } from "date-fns";

export interface PersonFormValues {
  name: string;
  surname: string;
  birthDate: string;
  birthDateUnknown: boolean;
  gender: number;
  maritalStatus: number;
  life: number;
  notes: string;
}

export interface PersonPayload {
  name: string;
  surname: string;
  birth_date: Date | null;
  gender: number;
  life: number;
  marital_status: number;
  notes: string;
  profile_id: string | null;
}

export function createPersonFormDefaults(date?: Date): PersonFormValues {
  return {
    name: "",
    surname: "",
    birthDate: date ? format(date, "dd MMM yyyy") : "",
    birthDateUnknown: false,
    gender: 1,
    maritalStatus: 1,
    life: 1,
    notes: "",
  };
}

export function buildPersonPayload(
  values: PersonFormValues,
  date: Date | undefined,
  profileId: string | null | undefined
): PersonPayload {
  return {
    name: values.name.trim(),
    surname: values.surname.trim(),
    birth_date: values.birthDateUnknown ? null : date ?? null,
    gender: values.gender,
    life: values.life,
    marital_status: values.maritalStatus,
    notes: values.notes.trim(),
    profile_id: profileId ?? null,
  };
}
