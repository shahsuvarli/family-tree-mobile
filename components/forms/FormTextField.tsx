import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import type {
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface FormTextFieldProps extends Omit<TextInputProps, "style"> {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  errorText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputRowStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export default function FormTextField({
  label,
  value,
  onChangeText,
  icon,
  errorText,
  containerStyle,
  inputRowStyle,
  labelStyle,
  inputStyle,
  placeholderTextColor = "#8f8a82",
  multiline = false,
  numberOfLines,
  ...textInputProps
}: FormTextFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
      </View>

      <View
        style={[
          styles.inputRow,
          multiline && styles.inputRowMultiline,
          inputRowStyle,
        ]}
      >
        {icon ? <Ionicons name={icon} size={20} color={styles.icon.color} /> : null}
        <TextInput
          {...textInputProps}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={placeholderTextColor}
        />
      </View>
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
  inputRow: {
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
  inputRowMultiline: {
    alignItems: "flex-start",
    paddingVertical: 14,
  },
  icon: {
    color: "#0000005a",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    minHeight: 40,
  },
  inputMultiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
});
