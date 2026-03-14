import { colors } from "@/theme/colors";
import { View, Text, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const WelcomeCard = () => {
  return (
    <LinearGradient
      colors={["#fff8f1", "#f5e4d3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.welcomeBox}
    >
      <View style={styles.welcomeTextContainer}>
        <Text style={styles.welcomeEyebrow}>Start here</Text>
        <Text style={styles.welcomeTitle}>Keep growing your tree</Text>
        <Text style={styles.welcomeSubtitle}>
          Add people, connect branches, and build a clearer family story over
          time.
        </Text>
      </View>
      <Image
        source={require("@/assets/images/family-2.png")}
        style={styles.welcomeImage}
      />
    </LinearGradient>
  );
};

export default WelcomeCard;

const styles = StyleSheet.create({
  welcomeBox: {
    flexDirection: "row",
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  welcomeTextContainer: {
    flexDirection: "column",
    gap: 8,
    width: "58%",
  },
  welcomeEyebrow: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: colors.mainDark,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.ink,
  },
  welcomeSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkMuted,
  },
  welcomeImage: {
    width: 132,
    height: 96,
    borderRadius: 18,
    opacity: 0.9,
  },
});
