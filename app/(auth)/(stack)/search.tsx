import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { appRoutes } from "@/constants/routes";
import ScreenState from "@/components/ui/ScreenState";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/features/auth/providers/SessionProvider";
import PersonListItem from "@/features/people/components/PersonListItem";
import type { Person } from "@/types/person";
import { router } from "expo-router";

export default function SearchPeopleScreen() {
  const [searchText, setSearchText] = useState("");
  const { session } = useSession();
  const [people, setPeople] = useState<Person[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSearchResults = useCallback(
    async (searchText: string) => {
      if (!session) {
        setPeople([]);
        setRefreshing(false);
        return;
      }

      setRefreshing(true);

      const { data: people } = await supabase
        .from("people")
        .select("*")
        .eq("profile_id", session)
        .order("created_at", { ascending: false })
        .or(`name.ilike.%${searchText}%,surname.ilike.%${searchText}%`);

      setPeople(people ?? []);
      setRefreshing(false);
    },
    [session]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchSearchResults(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchSearchResults, searchText]);

  function handlePerson(person: Person) {
    router.replace({
      pathname: appRoutes.authStackPerson,
      params: { id: person.id, name: person.name },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchButton}>
        <Ionicons name="search" size={30} color={colors.button} />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          autoFocus
          keyboardAppearance="light"
        />
      </View>
      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PersonListItem
            person={item}
            onPress={handlePerson}
            iconName="chevron-forward"
          />
        )}
        refreshing={refreshing}
        onRefresh={() => void fetchSearchResults(searchText)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void fetchSearchResults(searchText)}
          />
        }
        ListEmptyComponent={() => (
          <ScreenState
            message="No results found"
            tone="accent"
            iconName="search"
            iconSize={100}
            style={styles.emptyState}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: "column",
    gap: 15,
    backgroundColor: "#fff",
    flex: 1,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.darkGrey,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    padding: 5,
    color: colors.button,
    paddingVertical: 15,
  },
  emptyState: {
    flexGrow: 1,
  },
});
