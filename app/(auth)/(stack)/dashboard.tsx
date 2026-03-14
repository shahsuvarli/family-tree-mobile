import { colors } from "@/theme/colors";
import { PieChart } from "react-native-gifted-charts";
import { StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
  const data = [
    { value: 50, color: colors.main, text: "Parents" },
    { value: 80, color: colors.mainDark, text: "Siblings" },
    { value: 90, color: colors.button, text: "Children" },
    { value: 70, color: "#4d7cd8", text: "Extended" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>Overview</Text>
        <Text style={styles.title}>Family distribution</Text>
        <Text style={styles.subtitle}>
          A quick visual summary of the people currently mapped in your tree.
        </Text>

        <View style={styles.chartWrap}>
          <PieChart
            data={data}
            focusOnPress
            showText
            textColor={colors.ink}
            showValuesAsLabels
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 8,
    flex: 1,
  },
  eyebrow: {
    color: colors.mainDark,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  chartWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
