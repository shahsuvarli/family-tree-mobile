import { Text, Pressable, StyleSheet, View, Image } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useSession } from "@/app/ctx";
import { supabase } from "@/lib/supabase/client";
import { useIsFocused } from "@react-navigation/native";

const HomeHeader = () => {
  const [greeting, setGreeting] = useState("");
  const [profileName, setProfileName] = useState("");
  const router = useRouter();
  const { session } = useSession();
  const isFocused = useIsFocused();

  const fetchProfileName = useCallback(async () => {
    if (!session) {
      setProfileName("");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", session)
      .single();

    if (error) {
      console.error("Failed to load profile name", error.message);
      return;
    }

    setProfileName(data.name?.trim() ?? "");
  }, [session]);

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

  useEffect(() => {
    if (isFocused) {
      void fetchProfileName();
    }
  }, [fetchProfileName, isFocused]);

  const greetingLabel = profileName ? `Hi, ${profileName}!` : "Hi!";

  return (
    <>
      <View style={styles.topRow}>
        <View style={{ flexDirection: "column", gap: 5 }}>
          <Text style={styles.greetingText}>{greetingLabel}</Text>
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
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
    gap: 10,
    borderRadius: 20,
    opacity: 0.3,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.darkerGrey,
  },
});
