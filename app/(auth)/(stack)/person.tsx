import ScreenState from "@/components/ui/ScreenState";
import { appRoutes } from "@/constants/routes";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import fetchFamilyRelationships from "@/features/people/lib/fetchFamilyRelationships";
import PersonListItem from "@/features/people/components/PersonListItem";
import { fetchPersonById } from "@/features/people/services/peopleService";
import { usePersonStore } from "@/features/people/store/usePersonStore";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Person, RelationshipSectionData } from "@/types/person";

export default function PersonScreen() {
  const { setPerson, setFamilyData, familyData } = usePersonStore();
  const { id: personId, name: personName } = useLocalSearchParams<{
    id: string;
    name?: string;
  }>();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    if (!personId) {
      setSelectedPerson(null);
      setFamilyData([]);
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    setIsLoading(true);
    setSelectedPerson(null);
    setFamilyData([]);
    setPerson({
      id: personId,
      name: personName ?? "",
      is_favorite: false,
    });

    const loadScreenData = async () => {
      const [{ data, error }, relationships] = await Promise.all([
        fetchPersonById(personId),
        fetchFamilyRelationships(personId),
      ]);

      if (!isActive) {
        return;
      }

      if (error) {
        console.error("Failed to load person", error.message);
        setSelectedPerson(null);
      } else if (data) {
        setSelectedPerson(data);
        setPerson({
          id: data.id,
          name: data.name,
          is_favorite: data.is_favorite ?? false,
        });
      } else {
        setSelectedPerson(null);
      }

      setFamilyData(relationships);
      setIsLoading(false);
    };

    void loadScreenData();

    return () => {
      isActive = false;
    };
  }, [personId, personName, setFamilyData, setPerson]);

  function handlePlusPress(
    currentPersonId: string,
    relationshipCode: RelationshipSectionData["code"],
    title: string,
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
    router.push({
      pathname: appRoutes.authStackPerson,
      params: { id: person.person_id ?? person.id, name: person.name },
    });
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenState
          message="Loading family..."
          showSpinner
          style={styles.stateContainer}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {selectedPerson ? (
        <View style={styles.personSummaryCard}>
          <Text style={styles.personSummaryLabel}>Selected person</Text>
          <View style={styles.personSummaryRow}>
            <View
              style={[
                styles.personSummaryBadge,
                {
                  backgroundColor:
                    selectedPerson.gender === 1
                      ? colors.male
                      : selectedPerson.gender === 2
                        ? colors.female
                        : colors.darkGrey,
                },
              ]}
            >
              <Text style={styles.personSummaryInitials}>
                {selectedPerson.initials}
              </Text>
            </View>
            <View style={styles.personSummaryTextBlock}>
              <Text style={styles.personSummaryName}>
                {selectedPerson.name}
                {selectedPerson.surname ? ` ${selectedPerson.surname}` : ""}
              </Text>
              <Text style={styles.personSummarySubtitle}>
                This family view starts from this person.
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <ScreenState
          message="We couldn't load this person."
          tone="error"
          style={styles.stateContainer}
        />
      )}

      {familyData.map((section) => {
        const count = section.data.length;

        return (
          <View key={section.code} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
                <Text style={styles.sectionCountText}>
                  {count} {count === 1 ? "person" : "people"}
                </Text>
              </View>
              <Pressable
                onPress={() => handlePlusPress(personId, section.code, section.title)}
                style={styles.addButton}
              >
                <Ionicons name="add" size={18} color={colors.mainDark} />
              </Pressable>
            </View>

            {count ? (
              <View style={styles.peopleList}>
                {section.data.map((person: Person) => (
                  <PersonListItem
                    person={person}
                    key={person.id}
                    onPress={handlePerson}
                    iconName="chevron-forward"
                    relationshipCode={section.code}
                    variant="family"
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.noItemsText}>
                No {section.title.toLowerCase()} found yet.
              </Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 28,
  },
  stateContainer: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  personSummaryCard: {
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    padding: 18,
    gap: 12,
  },
  personSummaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: colors.mainDark,
  },
  personSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  personSummaryBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },
  personSummaryInitials: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  personSummaryTextBlock: {
    flex: 1,
    gap: 4,
  },
  personSummaryName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.ink,
  },
  personSummarySubtitle: {
    fontSize: 14,
    color: colors.inkMuted,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  sectionTitleBlock: {
    gap: 4,
    flex: 1,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.ink,
  },
  sectionCountText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkMuted,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainSoft,
    borderWidth: 1,
    borderColor: colors.borderWarm,
  },
  peopleList: {
    gap: 12,
  },
  noItemsText: {
    color: colors.inkMuted,
    fontSize: 15,
    fontStyle: "italic",
  },
});
