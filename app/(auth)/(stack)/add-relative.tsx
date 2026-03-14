import ScreenState from "@/components/ui/ScreenState";
import { useSession } from "@/features/auth/providers/SessionProvider";
import PersonListItem from "@/features/people/components/PersonListItem";
import { buildRelationshipPayload, RelationshipCode } from "@/constants/relationships";
import fetchFamilyRelationships from "@/features/people/lib/fetchFamilyRelationships";
import { fetchPeopleExcluding } from "@/features/people/services/peopleService";
import { supabase } from "@/lib/supabase/client";
import { usePersonStore } from "@/features/people/store/usePersonStore";
import { showErrorToast } from "@/lib/toast";
import { colors } from "@/theme/colors";
import type { Person } from "@/types/person";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddRelativeScreen() {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const router = useRouter();
  const { person_id: personId, relationship_code: relationshipCode, title } =
    useLocalSearchParams<{
      person_id: string;
      relationship_code: RelationshipCode;
      title: string;
    }>();
  const {
    person: { name },
    setFamilyData,
  } = usePersonStore();
  const { userId } = useSession();

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const fetchPeople = useCallback(
    async (searchText = "") => {
      if (!userId || !personId) {
        setPeople([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error: peopleError } = await fetchPeopleExcluding(
        userId,
        personId,
        searchText,
      );

      if (peopleError) {
        showErrorToast("Error", "Failed to fetch data", { bottomOffset: 50 });
        setError("Failed to fetch data.");
        setPeople([]);
      } else {
        setError(null);
        setPeople(data ?? []);
      }

      setLoading(false);
    },
    [userId, personId],
  );

  useEffect(() => {
    void fetchPeople();
  }, [fetchPeople]);

  useEffect(() => {
    void fetchPeople(search);
  }, [search, fetchPeople]);

  const handleSelectPerson = async (relatedPerson: Person) => {
    if (!userId || !personId || !relationshipCode) return;

    const payload = buildRelationshipPayload(
      relationshipCode,
      personId,
      relatedPerson.id,
      userId,
    );

    const { error: insertError } = await supabase
      .from("relationships")
      .insert([payload]);

    if (insertError) {
      showErrorToast("Error", "Failed to add relationship", {
        bottomOffset: 50,
      });
      return;
    }

    const updatedFamily = await fetchFamilyRelationships(personId);
    setFamilyData(updatedFamily);
    router.back();
  };

  const handleCreateNewPerson = () => {
    router.push("/(auth)/(stack)/add-new");
  };

  const relationLabel = title ?? "relative";

  return (
    <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <LinearGradient
              colors={[colors.main, colors.mainDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroIconWrap}>
                <Ionicons name="git-branch-outline" size={20} color={colors.onMain} />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>Add {relationLabel}</Text>
                <Text style={styles.heroSubtitle}>
                  Find someone already in your tree or create a new person to
                  connect.
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.searchPanel}>
              <View style={styles.searchContainer}>
                <View style={styles.searchIconWrap}>
                  <Ionicons name="search" size={18} color={colors.mainDark} />
                </View>
                <TextInput
                  style={styles.searchInput}
                  placeholder={`Search to add as ${relationLabel}`}
                  placeholderTextColor={colors.inkMuted}
                  value={search}
                  onChangeText={setSearch}
                  autoCapitalize="words"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                />
              </View>
              <Text style={styles.searchHint}>
                Adding to {name ? `${name}'s` : "this"} {relationLabel} section.
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ScreenState
              message="Loading people..."
              showSpinner
              style={styles.stateCard}
            />
          ) : error ? (
            <ScreenState
              message={error}
              tone="error"
              style={styles.stateCard}
            />
          ) : (
            <View style={styles.emptyCard}>
              <ScreenState
                message={`No people found to add as ${
                  name ? `${name}'s` : "a"
                } ${relationLabel}.`}
                iconName="person-add-outline"
                style={styles.stateContainerInner}
              />
              <Pressable style={styles.createButton} onPress={handleCreateNewPerson}>
                <Text style={styles.createButtonText}>Create new person</Text>
              </Pressable>
            </View>
          )
        }
        renderItem={({ item }) => (
          <PersonListItem
            person={item}
            iconName="add-circle-outline"
            onPress={handleSelectPerson}
            variant="family"
          />
        )}
      />
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
  headerContent: {
    gap: 16,
    marginBottom: 18,
  },
  heroCard: {
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  searchPanel: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainSoft,
  },
  searchInput: {
    flex: 1,
    minHeight: 42,
    fontSize: 16,
    color: colors.ink,
  },
  searchHint: {
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  separator: {
    height: 12,
  },
  stateCard: {
    minHeight: 220,
    backgroundColor: colors.surface,
    borderRadius: 24,
  },
  emptyCard: {
    minHeight: 260,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 12,
  },
  stateContainerInner: {
    flex: 1,
  },
  createButton: {
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: colors.main,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  createButtonText: {
    color: colors.onMain,
    fontSize: 16,
    fontWeight: "700",
  },
});
