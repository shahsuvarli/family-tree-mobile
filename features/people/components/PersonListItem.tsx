import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase/client";
import { usePersonStore } from "@/features/people/store/usePersonStore";
import { colors } from "@/theme/colors";
import type { RelationshipCode } from "@/constants/relationships";
import type { Person } from "@/types/person";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PersonListItemProps {
  person: Person;
  onPress: (person: Person) => void;
  iconName: keyof typeof Ionicons.glyphMap;
  relationshipCode?: RelationshipCode;
}

export default function PersonListItem({
  person,
  onPress,
  iconName,
  relationshipCode,
}: PersonListItemProps) {
  const createdAtLabel = new Date(person.created_at).toLocaleDateString();
  const { familyData, setFamilyData } = usePersonStore();

  const handleLongPress = async () => {
    if (!relationshipCode) {
      return;
    }

    const relationshipId = person.id;
    const { error } = await supabase
      .from("relationships")
      .delete()
      .eq("id", relationshipId);

    if (error) {
      console.error("Failed to remove relationship", error.message);
      return;
    }

    const nextFamilyData = familyData.map((section) =>
      section.code === relationshipCode
        ? {
            ...section,
            data: section.data.filter(
              (relationshipPerson) => relationshipPerson.id !== relationshipId
            ),
          }
        : section
    );

    setFamilyData(nextFamilyData);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(person)}
      onLongPress={relationshipCode ? handleLongPress : undefined}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.initialBadge,
            {
              backgroundColor: person.gender === 1 ? colors.male : colors.female,
            },
          ]}
        >
          <Text style={styles.initialText}>{person.initials}</Text>
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.nameText}>
            {person.name} {person.surname}
          </Text>
          <Text style={styles.dateText}>{createdAtLabel}</Text>
        </View>
      </View>
      <Ionicons name={iconName} size={30} color={colors.darkGrey} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.3,
    width: "100%",
  },
  leftContent: {
    flexDirection: "row",
    gap: 12,
  },
  initialBadge: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  nameBlock: {
    flexDirection: "column",
    gap: 7,
  },
  nameText: {
    fontSize: 20,
    color: colors.button,
  },
  dateText: {
    color: colors.darkGrey,
  },
});
