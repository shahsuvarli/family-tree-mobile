import { View, SectionList, Text, Pressable, StyleSheet } from "react-native";
import { appRoutes } from "@/constants/routes";
import PersonListItem from "@/features/people/components/PersonListItem";
import { useCallback, useEffect } from "react";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import fetchFamilyRelationships from "@/features/people/lib/fetchFamilyRelationships";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase/client";
import { usePersonStore } from "@/features/people/store/usePersonStore";
import type { Person, RelationshipSectionData } from "@/types/person";

export default function PersonScreen() {
  const { setPerson, setFamilyData, familyData } = usePersonStore();
  const { id: personId } = useLocalSearchParams<{ id: string }>();

  const loadPerson = useCallback(async () => {
    if (!personId) {
      return;
    }

    const { data, error } = await supabase
      .from("people")
      .select("id, name, is_favorite")
      .eq("id", personId)
      .single();

    if (!error) {
      const { id, name, is_favorite } = data;
      setPerson({ id, name, is_favorite });
    }
  }, [personId, setPerson]);

  const loadFamilyData = useCallback(async () => {
    if (!personId) {
      setFamilyData([]);
      return;
    }

    const relationships = await fetchFamilyRelationships(personId);
    setFamilyData(relationships);
  }, [personId, setFamilyData]);

  useEffect(() => {
    void loadFamilyData();
  }, [loadFamilyData]);

  useEffect(() => {
    void loadPerson();
  }, [loadPerson]);

  function handlePlusPress(
    currentPersonId: string,
    relationshipCode: RelationshipSectionData["code"],
    title: string
  ): void {
    router.push({
      pathname: appRoutes.authStackAddRelative,
      params: {
        person_id: currentPersonId,
        relationship_code: relationshipCode,
        title,
      },
    });
  }

  function handlePerson(person: Person) {
    router.replace({
      pathname: appRoutes.authStackPerson,
      params: { id: person.person_id ?? person.id, name: person.name },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <SectionList
          sections={familyData}
          renderItem={() => {
            return null;
          }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: {
            title,
            data,
            code,
          } }: { section: RelationshipSectionData }) => {
            const count = data.length;
            return (
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderTitle}>
                  <Text style={styles.sectionHeaderText}>{title}</Text>
                  <Pressable onPress={() => handlePlusPress(personId, code, title)}>
                    <Ionicons name="add" size={27} color={colors.darkGrey} />
                  </Pressable>
                </View>
                <View>
                  {count ? (
                    data.map((person: Person) => {
                      return (
                        <PersonListItem
                          person={person}
                          key={person.id}
                          onPress={handlePerson}
                          iconName="chevron-forward"
                          relationshipCode={code}
                        />
                      );
                    })
                  ) : (
                    <Text style={styles.noItemsText}>
                      &nbsp; no {title.toLowerCase()} found
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
          stickyHeaderHiddenOnScroll={true}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: "#fff",
    padding: 10,
    flex: 1,
  },
  sectionHeader: {
    padding: 10,
    gap: 5,
  },
  sectionHeaderTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderText: {
    fontSize: 17,
    color: colors.darkGrey,
  },
  noItemsText: {
    color: colors.darkGrey,
    fontSize: 15,
    fontStyle: "italic",
  },
});
