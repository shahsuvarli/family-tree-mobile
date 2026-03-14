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
      style={({ pressed }) => [
        styles.chip,
        isSelected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}
      onPress={() => onChange(option.id)}
    >
      {option.icon ? (
        <Ionicons
          name={option.icon}
          size={20}
          color={isSelected ? colors.onMain : colors.mainDark}
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
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexGrow: 1,
    flexBasis: "31%",
    backgroundColor: colors.surfaceAlt,
    gap: 6,
    minHeight: 56,
  },
  chipSelected: {
    backgroundColor: colors.main,
    borderColor: colors.mainDark,
  },
  chipPressed: {
    opacity: 0.85,
  },
  icon: {
    flexShrink: 0,
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "600",
  },
  labelSelected: {
    color: colors.onMain,
    fontWeight: "700",
  },
});
