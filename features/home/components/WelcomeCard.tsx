import { colors } from "@/theme/colors";
import { View, Text, Image, StyleSheet } from "react-native";

const WelcomeCard = () => {
  return (
    <View style={styles.welcomeBox}>
      <View style={styles.welcomeTextContainer}>
        <Text style={styles.welcomeTitle}>Welcome!</Text>
        <Text style={styles.welcomeSubtitle}>
          Feel free to add all your people!
        </Text>
      </View>
      <Image
        source={require("@/assets/images/family-2.png")}
        style={styles.welcomeImage}
      />
    </View>
  );
};

export default WelcomeCard;

const styles = StyleSheet.create({
  welcomeBox: {
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: colors.grey,
    padding: 20,
    marginTop: 10,
    gap: 10,
  },
  welcomeTextContainer: {
    flexDirection: "column",
    gap: 10,
    width: "55%",
  },
  welcomeTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.button,
  },
  welcomeSubtitle: {
    fontSize: 17,
    color: colors.button,
  },
  welcomeImage: {
    width: 150,
    height: 100,
    borderRadius: 20,
    opacity: 0.8,
  },
});
