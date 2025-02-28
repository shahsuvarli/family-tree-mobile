import { supabase } from "@/db";
import { create } from "zustand";

interface Person {
    id: string;
    name: string;
    is_favorite: boolean;
}

interface PersonHeaderContext {
    person: Person;
    setPerson: (person: Person) => void;
    handleFavorite: () => void;
    familyData: any;
    setFamilyData: (family: any) => void;
}

export const usePersonStore = create<PersonHeaderContext>((set, get) => ({
    isFavorite: false,
    person: {
        id: "",
        name: "",
        is_favorite: false,
    },
    familyData: [],
    setFamilyData: (familyData: any) => {
        set({ familyData });
    },
    setPerson: (person: Person) => {
        set({ person });
    },
    handleFavorite: async () => {
        const { person } = get();
        set({ person: { ...person, is_favorite: !person.is_favorite } });
        const { error } = await supabase
            .from("people")
            .update({ is_favorite: !person.is_favorite })
            .eq("id", person.id)
            .select("id, is_favorite")
            .single();

        if (error) {
            set({ person: { ...person, is_favorite: !person.is_favorite } });
        }
    }
}));