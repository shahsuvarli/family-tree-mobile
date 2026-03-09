import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/app/ctx";
import PersonLine from "@/components/PersonLine";
import type { PersonType } from "@/types";
import { router } from "expo-router";

export default function SearchPeopleScreen() {
  const [search, setSearch] = useState<string>("");
  const { session } = useSession();
  const [data, setData] = useState<PersonType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSearchResults = useCallback(
    async (searchText: string) => {
      if (!session) {
        setData([]);
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

      setData(people ?? []);
      setRefreshing(false);
    },
    [session]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchSearchResults(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchSearchResults, search]);

  function handlePerson(item: PersonType) {
    router.replace({
      pathname: "/(auth)/(other)/person",
      params: { id: item.id, name: item.name },
    });
  }

  return (
    <View
      style={{
        padding: 15,
        flexDirection: "column",
        gap: 15,
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <View style={styles.searchButton}>
        <Ionicons name="search" size={30} color={colors.button} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => setSearch(text)}
          autoFocus
          keyboardAppearance="light"
        />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PersonLine
            item={item}
            handlePerson={handlePerson}
            icon="chevron-forward"
          />
        )}
        refreshing={refreshing}
        onRefresh={() => void fetchSearchResults(search)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void fetchSearchResults(search)}
          />
        }
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", padding: 20 }}>
            <Ionicons name="search" size={100} color={colors.button} />
            <Text style={{ color: colors.button }}>No results found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.darkerGrey,
  },
  searchInput: {
    flex: 1,
    fontSize: 20,
    padding: 5,
    color: colors.button,
    paddingVertical: 15,
  },
});
