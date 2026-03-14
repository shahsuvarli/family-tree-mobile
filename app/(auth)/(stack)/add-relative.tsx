import { useSession } from "@/features/auth/providers/SessionProvider";
import ScreenState from "@/components/ui/ScreenState";
import PersonListItem from "@/features/people/components/PersonListItem";
import { buildRelationshipPayload, RelationshipCode } from "@/constants/relationships";
import fetchFamilyRelationships from "@/features/people/lib/fetchFamilyRelationships";
import { supabase } from "@/lib/supabase/client";
import { usePersonStore } from "@/features/people/store/usePersonStore";
import { colors } from "@/theme/colors";
import type { Person } from "@/types/person";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

export default function AddRelativeScreen() {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { goBack } = useNavigation();
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
  const { session } = useSession();

  const fetchPeople = useCallback(
    async (searchText = "") => {
      if (!session || !personId) {
        setPeople([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error: peopleError } = await supabase
        .from("people")
        .select("*")
        .eq("profile_id", session)
        .neq("id", personId)
        .order("created_at", { ascending: false })
        .or(`name.ilike.%${searchText}%,surname.ilike.%${searchText}%`);

      if (peopleError) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch data",
          position: "bottom",
          bottomOffset: 50,
        });
        setError("Failed to fetch data.");
        setPeople([]);
      } else {
        setError(null);
        setPeople(data ?? []);
      }

      setLoading(false);
    },
    [personId, session]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      void fetchPeople(search);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchPeople, search]);

  const handleAddPerson = useCallback(
    async (person: Person) => {
      if (!session || !personId) {
        return;
      }

      const payload = buildRelationshipPayload(
        relationshipCode,
        personId,
        person.id,
        session
      );
      const { error: relationshipError } = await supabase
        .from("relationships")
        .insert([payload]);

      if (relationshipError) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: relationshipError.message,
          position: "bottom",
          bottomOffset: 50,
        });
        return;
      }

      const nextFamilyData = await fetchFamilyRelationships(personId);
      setFamilyData(nextFamilyData);
      goBack();
      Toast.show({
        type: "success",
        text1: "Person added to family",
        text2: "Person added to family",
        position: "bottom",
        bottomOffset: 50,
      });
    },
    [goBack, personId, relationshipCode, session, setFamilyData]
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.description}>
        {`Select ${name}'s ${title.toLowerCase()} from the list`}
      </Text>

      <View style={styles.headerContainer}>
        <Ionicons name="search" size={24} color="gray" />
        <TextInput
          placeholder="Search"
          style={styles.textInput}
          autoCorrect={false}
          placeholderTextColor={colors.darkGrey}
          onChangeText={setSearch}
        />
      </View>

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
            contentContainerStyle={styles.listContent}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PersonListItem
                person={item}
                onPress={handleAddPerson}
                iconName="add"
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
  description: {
    fontSize: 20,
    color: "gray",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  listContent: {
    paddingVertical: 20,
  },
  stateContainer: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    fontSize: 20,
  },
  headerContainer: {
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: colors.darkerSecondaryColor,
    paddingVertical: 7,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.darkerSecondaryColor,
    marginTop: 10,
  },
});
