import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors } from "@/theme/colors";

type ScreenStateTone = "neutral" | "error" | "accent";

interface ScreenStateProps {
  message: string;
  tone?: ScreenStateTone;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  showSpinner?: boolean;
  style?: StyleProp<ViewStyle>;
}

const TONE_COLOR: Record<ScreenStateTone, string> = {
  neutral: colors.darkGrey,
  error: colors.warning,
  accent: colors.button,
};

export default function ScreenState({
  message,
  tone = "neutral",
  iconName,
  iconSize = 32,
  showSpinner = false,
  style,
}: ScreenStateProps) {
  const tintColor = TONE_COLOR[tone];

  return (
    <View style={[styles.container, style]}>
      {showSpinner ? (
        <ActivityIndicator size="large" color={tintColor} />
      ) : iconName ? (
        <Ionicons name={iconName} size={iconSize} color={tintColor} />
      ) : null}
      <Text style={[styles.message, { color: tintColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 12,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
  },
});
