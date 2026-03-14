import { Text, Pressable, StyleSheet, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { appRoutes } from "@/constants/routes";
import { colors } from "@/theme/colors";
import { useRouter } from "expo-router";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { fetchProfile } from "@/features/profile/services/profileService";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const HomeHeader = () => {
  const [greeting, setGreeting] = useState("");
  const [profileName, setProfileName] = useState("");
  const router = useRouter();
  const { userId } = useSession();
  const isFocused = useIsFocused();

  const fetchProfileName = useCallback(async () => {
    if (!userId) {
      setProfileName("");
      return;
    }

    const { data, error } = await fetchProfile(userId);

    if (error) {
      console.error("Failed to load profile name", error.message);
      return;
    }

    setProfileName(data.name?.trim() ?? "");
  }, [userId]);

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
      <LinearGradient
        colors={[colors.main, colors.mainDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.topRow}>
          <View style={styles.greetingBlock}>
            <Text style={styles.greetingText}>{greetingLabel}</Text>
            <Text style={styles.morningText}>{greeting}</Text>
          </View>
          <View style={styles.avatarShell}>
            <Text style={styles.avatarText}>
              {(profileName || "FT").slice(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <Pressable
        style={styles.searchButton}
        onPress={() => router.push(appRoutes.authStackSearch)}
      >
        <View style={styles.searchIconWrap}>
          <Ionicons name="search" size={18} color={colors.mainDark} />
        </View>
        <View style={styles.searchTextBlock}>
          <Text style={styles.searchLabel}>My family</Text>
          <Text style={styles.searchHint}>Search people and open profiles</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.mainDark} />
      </Pressable>
    </>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 24,
    padding: 16,
    shadowColor: colors.mainDark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 5,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingBlock: {
    gap: 4,
    flex: 1,
  },
  greetingText: {
    fontSize: 28,
    color: colors.onMain,
    fontWeight: "800",
  },
  morningText: {
    fontSize: 15,
    color: "rgba(255,249,244,0.84)",
  },
  avatarShell: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  avatarText: {
    color: colors.onMain,
    fontSize: 18,
    fontWeight: "800",
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 14,
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderWarm,
  },
  searchIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainSoft,
  },
  searchTextBlock: {
    flex: 1,
    gap: 2,
  },
  searchLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  searchHint: {
    color: colors.inkMuted,
    fontSize: 13,
  },
});
