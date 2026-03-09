import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface FormPressableFieldProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value?: string;
  placeholder: string;
  errorText?: string;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  fieldStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

export default function FormPressableField({
  label,
  icon,
  value,
  placeholder,
  errorText,
  onPress,
  containerStyle,
  fieldStyle,
  labelStyle,
  valueStyle,
}: FormPressableFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      </View>

      <Pressable style={[styles.field, fieldStyle]} onPress={onPress}>
        <Ionicons name={icon} size={20} color={styles.icon.color} />
        <Text style={[styles.value, !value && styles.placeholder, valueStyle]}>
          {value || placeholder}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  label: {
    color: colors.button,
    fontSize: 14,
    fontWeight: "700",
  },
  errorText: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: "600",
  },
  field: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(47,79,79,0.15)",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    color: "#0000005a",
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: "#8f8a82",
  },
});
