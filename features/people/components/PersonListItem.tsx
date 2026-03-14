import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase/client";
import { usePersonStore } from "@/features/people/store/usePersonStore";
import { colors } from "@/theme/colors";
import type { RelationshipCode } from "@/constants/relationships";
import type { Person } from "@/types/person";
import { format } from "date-fns";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PersonListItemProps {
  person: Person;
  onPress: (person: Person) => void;
  iconName: keyof typeof Ionicons.glyphMap;
  relationshipCode?: RelationshipCode;
  variant?: "default" | "family";
}

export default function PersonListItem({
  person,
  onPress,
  iconName,
  relationshipCode,
  variant = "default",
}: PersonListItemProps) {
  const createdAtLabel = formatDateLabel(person.created_at);
  const secondaryLabel = person.birth_date
    ? `Born ${person.birth_date}`
    : createdAtLabel
      ? `Added ${createdAtLabel}`
      : "Recently added";
  const { familyData, setFamilyData } = usePersonStore();
  const isFamilyVariant = variant === "family";
  const badgeColor =
    person.gender === 1
      ? colors.male
      : person.gender === 2
        ? colors.female
        : colors.darkGrey;

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
      activeOpacity={0.82}
      style={[
        styles.container,
        isFamilyVariant ? styles.containerFamily : styles.containerDefault,
      ]}
      onPress={() => onPress(person)}
      onLongPress={relationshipCode ? handleLongPress : undefined}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.initialBadge,
            isFamilyVariant && styles.initialBadgeFamily,
            {
              backgroundColor: badgeColor,
            },
          ]}
        >
          <Text style={[styles.initialText, isFamilyVariant && styles.initialTextFamily]}>
            {person.initials}
          </Text>
        </View>
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <Text
              numberOfLines={1}
              style={[styles.nameText, isFamilyVariant && styles.nameTextFamily]}
            >
              {person.name} {person.surname}
            </Text>
            {isFamilyVariant && person.is_favorite ? (
              <View style={styles.favoriteBadge}>
                <Ionicons name="star" size={12} color={colors.mainDark} />
              </View>
            ) : null}
          </View>
          <Text style={[styles.dateText, isFamilyVariant && styles.dateTextFamily]}>
            {secondaryLabel}
          </Text>
        </View>
      </View>
      {isFamilyVariant ? (
        <View style={styles.trailingBadge}>
          <Ionicons name={iconName} size={18} color={colors.mainDark} />
        </View>
      ) : (
        <Ionicons name={iconName} size={30} color={colors.darkGrey} />
      )}
    </TouchableOpacity>
  );
}

function formatDateLabel(dateString: string) {
  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return format(parsedDate, "MMM d, yyyy");
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    width: "100%",
  },
  containerDefault: {
    paddingVertical: 10,
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.3,
  },
  containerFamily: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    shadowColor: colors.mainDark,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  leftContent: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    alignItems: "center",
  },
  initialBadge: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  initialBadgeFamily: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  initialText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  initialTextFamily: {
    fontSize: 22,
    fontWeight: "800",
  },
  nameBlock: {
    flexDirection: "column",
    gap: 6,
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameText: {
    fontSize: 20,
    color: colors.button,
    flexShrink: 1,
  },
  nameTextFamily: {
    fontSize: 18,
    color: colors.ink,
    fontWeight: "700",
  },
  dateText: {
    color: colors.darkGrey,
  },
  dateTextFamily: {
    color: colors.inkMuted,
    fontSize: 14,
  },
  favoriteBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainSoft,
    borderWidth: 1,
    borderColor: colors.borderWarm,
  },
  trailingBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainSoft,
    borderWidth: 1,
    borderColor: colors.borderWarm,
  },
});
