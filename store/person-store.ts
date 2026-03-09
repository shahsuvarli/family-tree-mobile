import { supabase } from "@/lib/supabase/client";
import type {
  RelationshipSectionData,
  SelectedPersonSummary,
} from "@/types/person";
import { create } from "zustand";

const EMPTY_PERSON: SelectedPersonSummary = {
  id: "",
  name: "",
  is_favorite: false,
};

interface PersonStore {
  person: SelectedPersonSummary;
  familyData: RelationshipSectionData[];
  setPerson: (person: SelectedPersonSummary) => void;
  setFamilyData: (familyData: RelationshipSectionData[]) => void;
  handleFavorite: () => Promise<void>;
}

export const usePersonStore = create<PersonStore>((set, get) => ({
  person: EMPTY_PERSON,
  familyData: [],
  setPerson: (person) => {
    set({ person });
  },
  setFamilyData: (familyData) => {
    set({ familyData });
  },
  handleFavorite: async () => {
    const { person } = get();

    if (!person.id) {
      return;
    }

    const nextFavoriteValue = !person.is_favorite;
    set({ person: { ...person, is_favorite: nextFavoriteValue } });

    const { error } = await supabase
      .from("people")
      .update({ is_favorite: nextFavoriteValue })
      .eq("id", person.id);

    if (error) {
      console.error("Failed to update favorite person", error.message);
      set({ person });
    }
  },
}));
