import { FlatList, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { appRoutes } from "@/constants/routes";
import ScreenState from "@/components/ui/ScreenState";
import PersonListItem from "@/features/people/components/PersonListItem";
import { supabase } from "@/lib/supabase/client";
import type { Person } from "@/types/person";
import { router } from "expo-router";
import { useSession } from "@/features/auth/providers/SessionProvider";

export default function RecentlyAddedScreen() {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();

  const fetchData = useCallback(async () => {
    if (!session) {
      setPeople([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data: people, error: peopleError } = await supabase
      .from("people")
      .select("*")
      .eq("profile_id", session)
      .order("created_at", { ascending: false });

    if (peopleError) {
      console.error(peopleError.message);
      setError("Failed to fetch data.");
      setPeople([]);
    } else {
      setPeople(people ?? []);
    }

    setLoading(false);
  }, [session]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function handlePerson(person: Person) {
    router.replace({
      pathname: appRoutes.authStackPerson,
      params: { id: person.id, name: person.name },
    });
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ScreenState message="Loading..." showSpinner style={styles.stateContainer} />
      ) : error ? (
        <ScreenState message={error} tone="error" style={styles.stateContainer} />
      ) : people.length === 0 ? (
        <ScreenState message="No data available." style={styles.stateContainer} />
      ) : (
        <FlatList
          data={people}
          contentContainerStyle={{ padding: 20 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PersonListItem
              person={item}
              iconName="chevron-forward"
              onPress={handlePerson}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stateContainer: {
    flex: 1,
  },
});
