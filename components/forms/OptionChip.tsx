import { Ionicons } from "@expo/vector-icons";
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
          color={isSelected ? "#fff" : "#000000a6"}
          style={[
            styles.icon,
            { borderColor: isSelected ? "#fff" : "#000000a6" },
          ]}
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
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#0000003d",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "#0a7ea4",
  },
  icon: {
    borderRadius: 100,
    paddingRight: 5,
    borderWidth: 1,
  },
  label: {
    color: "#000000a6",
    fontSize: 15,
  },
  labelSelected: {
    color: "#fff",
    fontWeight: "700",
  },
});
