import { useCallback, useEffect, useState } from "react";
import { fetchPeople } from "@/features/people/services/peopleService";
import type { Person } from "@/types/person";
import { showErrorToast } from "@/lib/toast";

interface UsePeopleSearchResult {
  people: Person[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePeopleSearch(
  profileId: string | null,
  searchText: string,
): UsePeopleSearchResult {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!profileId) {
      setPeople([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: peopleError } = await fetchPeople(profileId, searchText);

      if (peopleError) {
        console.error("Failed to fetch people", peopleError.message);
        setPeople([]);
        setError("Failed to fetch data.");
        showErrorToast("Error", "Failed to fetch data");
      } else {
        setPeople(data ?? []);
        setError(null);
      }
    } catch (err) {
      console.error("Unexpected people search error", err);
      setPeople([]);
      setError("Something went wrong while fetching data.");
      showErrorToast(
        "Error",
        "Something went wrong while fetching data.",
      );
    } finally {
      setLoading(false);
    }
  }, [profileId, searchText]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    people,
    loading,
    error,
    refetch: load,
  };
}

