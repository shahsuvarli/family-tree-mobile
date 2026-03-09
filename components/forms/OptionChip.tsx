import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import type { SelectableOption } from "@/types/ui";
import { Pressable, StyleSheet, Text } from "react-native";

interface OptionChipProps {
  option: SelectableOption;
  value: number;
  onChange: (value: number) => void;
}

export default function OptionChip({
  option,
  value,
  onChange,
}: OptionChipProps) {
  const isSelected = value === option.id;

  return (
    <Pressable
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={() => onChange(option.id)}
    >
      {option.icon ? (
        <Ionicons
          name={option.icon}
          size={20}
          color={isSelected ? "#fff" : colors.button}
          style={styles.icon}
        />
      ) : null}
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {option.value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#0000003d",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: "#fff",
    gap: 6,
  },
  chipSelected: {
    backgroundColor: "#0a7ea4",
  },
  icon: {
    flexShrink: 0,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  labelSelected: {
    color: "#fff",
    fontWeight: "700",
  },
});
