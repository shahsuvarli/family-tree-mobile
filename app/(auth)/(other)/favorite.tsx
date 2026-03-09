import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import PersonLine from "@/components/PersonLine";
import { supabase } from "@/lib/supabase/client";
import type { PersonType } from "@/types";
import { router } from "expo-router";
import { useSession } from "@/app/ctx";

export default function FavoritesScreen() {
  const [data, setData] = useState<PersonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { session } = useSession();

  const fetchData = useCallback(async () => {
    if (!session) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data: people, error: peopleError } = await supabase
      .from("people")
      .select("*")
      .eq("profile_id", session)
      .order("created_at", { ascending: false })
      .eq("is_favorite", true);

    if (peopleError) {
      console.error(peopleError.message);
      setError("Failed to fetch data.");
      setData([]);
    } else {
      setData(people ?? []);
    }

    setLoading(false);
  }, [session]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function handlePerson(item: PersonType) {
    router.replace({
      pathname: "/(auth)/(other)/person",
      params: { id: item.id, name: item.name },
    });
  }

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : data.length === 0 ? (
        <Text style={styles.noDataText}>No favorite people found.</Text>
      ) : (
        <FlatList
          data={data}
          contentContainerStyle={{ padding: 20 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PersonLine
              item={item}
              handlePerson={handlePerson}
              icon="chevron-forward"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "gray",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  noDataText: {
    fontSize: 18,
    color: "gray",
  },
});
