import ScreenState from "@/components/ui/ScreenState";
import { appRoutes } from "@/constants/routes";
import { useSession } from "@/features/auth/providers/SessionProvider";
import PersonListItem from "@/features/people/components/PersonListItem";
import { supabase } from "@/lib/supabase/client";
import { colors } from "@/theme/colors";
import type { Person } from "@/types/person";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { userId } = useSession();

  const fetchData = useCallback(async () => {
    if (!userId) {
      setPeople([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data: favoritePeople, error: peopleError } = await supabase
      .from("people")
      .select("*")
      .eq("profile_id", userId)
      .order("created_at", { ascending: false })
      .eq("is_favorite", true);

    if (peopleError) {
      console.error(peopleError.message);
      setError("Failed to fetch data.");
      setPeople([]);
    } else {
      setPeople(favoritePeople ?? []);
    }

    setLoading(false);
  }, [userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  function handlePerson(person: Person) {
    router.push({
      pathname: appRoutes.authStackPerson,
      params: { id: person.id, name: person.name },
    });
  }

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <ScreenState
          message="Loading favorites..."
          showSpinner
          style={styles.stateCard}
        />
      ) : error ? (
        <ScreenState message={error} tone="error" style={styles.stateCard} />
      ) : people.length === 0 ? (
        <ScreenState
          message="No favorite people found."
          iconName="star-outline"
          style={styles.stateCard}
        />
      ) : (
        <FlatList
          data={people}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <LinearGradient
              colors={["#cc6a3c", "#e59b73"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroIconWrap}>
                <Ionicons name="star-outline" size={20} color={colors.onMain} />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Favorites</Text>
                <Text style={styles.heroSubtitle}>
                  Your most important people, pinned for quick access.
                </Text>
              </View>
            </LinearGradient>
          }
          renderItem={({ item }) => (
            <PersonListItem
              person={item}
              onPress={handlePerson}
              iconName="chevron-forward"
              variant="family"
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.main}
              colors={[colors.main]}
              progressBackgroundColor={colors.surface}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  heroCard: {
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
  },
  heroIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    color: colors.onMain,
    fontSize: 20,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "rgba(255,249,244,0.86)",
    fontSize: 13,
    lineHeight: 18,
  },
  separator: {
    height: 12,
  },
  stateCard: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
});
