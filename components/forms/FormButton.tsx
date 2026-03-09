import { colors } from "@/theme/colors";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";

interface FormButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function FormButton({
  label,
  onPress,
  disabled = false,
  containerStyle,
  textStyle,
}: FormButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled, containerStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: colors.button,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  label: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
