import { Text, Pressable, StyleSheet, View, Image } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";

const HomeHeader = () => {
  const [greeting, setGreeting] = useState("");
  const router = useRouter();

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);
  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
        <View style={{ flexDirection: "column", gap: 5 }}>
          <Text style={styles.greetingText}>Hi, Elvin!</Text>
          <Text style={styles.morningText}>{greeting}</Text>
        </View>
        <Image
          source={require("@/assets/images/avatar.png")}
          style={{
            width: 65,
            height: 65,
            borderRadius: 100,
            opacity: 0.8,
            borderWidth: 1,
            borderColor: colors.darkerGrey,
          }}
        />
      </View>

      <Pressable
        style={styles.searchButton}
        onPress={() => router.push("/(auth)/(other)/search")}
      >
        <Ionicons name="search" size={30} color={colors.button} />
        <Text style={{ color: colors.button, fontSize: 17 }}>My family</Text>
      </Pressable>
    </>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  greetingText: {
    fontSize: 33,
    color: colors.button,
    fontWeight: "bold",
  },
  morningText: {
    fontSize: 17,
    color: colors.darkGrey,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 10,
    borderRadius: 20,
    opacity: 0.3,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.darkerGrey,
  },
});
