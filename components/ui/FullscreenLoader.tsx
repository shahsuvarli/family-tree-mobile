import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";

interface FullscreenLoaderProps {
  backgroundColor?: string;
}

export default function FullscreenLoader({
  backgroundColor = "#fff",
}: FullscreenLoaderProps) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size="large" color={colors.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
