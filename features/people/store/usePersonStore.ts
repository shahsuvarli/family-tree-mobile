import { updatePersonFavorite } from "@/features/people/services/peopleService";
import { showErrorToast } from "@/lib/toast";
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

    const previousPerson = person;

    // Optimistically update the UI
    const nextFavoriteValue = !person.is_favorite;
    set({ person: { ...person, is_favorite: nextFavoriteValue } });

    try {
      const { error } = await updatePersonFavorite(person.id, nextFavoriteValue);

      if (error) {
        console.error("Failed to update favorite person", error.message);
        set({ person: previousPerson });
        showErrorToast(
          "Favorite update failed",
          "Could not update favorite. Please try again."
        );
      }
    } catch (error) {
      console.error("Unexpected favorite update error", error);
      set({ person: previousPerson });
      showErrorToast(
        "Favorite update failed",
        "Something went wrong. Please try again."
      );
    }
  },
}));
