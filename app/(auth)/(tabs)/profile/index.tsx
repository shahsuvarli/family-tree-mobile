import FullscreenLoader from "@/components/ui/FullscreenLoader";
import ScreenState from "@/components/ui/ScreenState";
import { appRoutes } from "@/constants/routes";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { useProfileOverview } from "@/features/profile/useProfileOverview";
import { colors } from "@/theme/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ProfileOverview {
  name: string;
  surname: string;
  email: string;
  people_count: number;
  relationship_count: number;
  created_at: string;
}

export default function ProfileScreen() {
  const isFocused = useIsFocused();
  const { userId } = useSession();
  const insets = useSafeAreaInsets();
  const {
    data: profile,
    error,
    loading,
  } = useProfileOverview<ProfileOverview>(userId, isFocused);

  if (loading) {
    return <FullscreenLoader backgroundColor={colors.canvas} />;
  }

  if (!profile) {
    return (
      <ScreenState
        message={error ?? "Your profile could not be loaded right now."}
        tone="error"
        iconName="alert-circle-outline"
        style={styles.screenState}
      />
    );
  }

  const displayName = [profile.name, profile.surname]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const initials = [profile.name, profile.surname]
    .map((part) => part?.trim().charAt(0))
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const joinedDate = format(new Date(profile.created_at), "MMMM d, yyyy");
  const memberSinceYear = format(new Date(profile.created_at), "yyyy");
  const peopleCount = profile.people_count ?? 0;
  const relationshipCount = profile.relationship_count ?? 0;

  const stats = [
    {
      id: "people",
      icon: "account-group-outline" as const,
      value: peopleCount,
      label: "People added",
    },
    {
      id: "relationships",
      icon: "source-branch" as const,
      value: relationshipCount,
      label: "Relationships",
    },
  ];

  const quickActions = [
    {
      id: "edit-profile",
      title: "Edit profile",
      subtitle: "Update your name and account details.",
      icon: "account-edit-outline" as const,
      route: appRoutes.authTabsProfileEdit,
    },
    {
      id: "recently-added",
      title: "Recently added",
      subtitle: "Review the newest people you saved.",
      icon: "clock-outline" as const,
      route: appRoutes.authStackRecentlyAdded,
    },
    {
      id: "browse-tree",
      title: "Browse family",
      subtitle: "Search through your family tree.",
      icon: "magnify" as const,
      route: appRoutes.authStackSearch,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + 28,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.main, colors.mainDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTopRow}>
          <View style={styles.avatarShell}>
            <Text style={styles.avatarInitials}>{initials || "FT"}</Text>
          </View>
          <View style={styles.heroBody}>
            <View style={styles.heroHeadingRow}>
              <Text numberOfLines={1} style={styles.heroTitle}>
                {displayName || "Your profile"}
              </Text>
              <View style={styles.memberBadge}>
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color={colors.onMain}
                />
                <Text style={styles.memberBadgeText}>{memberSinceYear}</Text>
              </View>
            </View>
            <Text style={styles.heroSubtitle}>
              Keep your profile current while you grow your family tree.
            </Text>

            <View style={styles.infoRow}>
              <View style={[styles.infoChip, styles.emailChip]}>
                <Ionicons name="mail-outline" size={16} color={colors.onMain} />
                <Text numberOfLines={1} style={styles.infoChipText}>
                  {profile.email}
                </Text>
              </View>

              <View style={styles.infoChip}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={colors.onMain}
                />
                <Text style={styles.infoChipText}>Joined {joinedDate}</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        {stats.map((item) => (
          <View key={item.id} style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={colors.button}
              />
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionEyebrow}>Quick actions</Text>
        <Text style={styles.sectionTitle}>Manage your profile</Text>

        <View style={styles.actionList}>
          {quickActions.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => router.push(item.route)}
              style={({ pressed }) => [
                styles.actionRow,
                pressed && styles.actionRowPressed,
              ]}
            >
              <View style={styles.actionIconWrap}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={22}
                  color={colors.mainDark}
                />
              </View>

              <View style={styles.actionTextWrap}>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.mainDark}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 18,
  },
  screenState: {
    backgroundColor: colors.canvas,
  },
  heroCard: {
    borderRadius: 26,
    padding: 16,
    shadowColor: colors.mainDark,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarShell: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
  },
  avatarInitials: {
    color: colors.onMain,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heroBody: {
    flex: 1,
    gap: 6,
  },
  heroHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberBadge: {
    minHeight: 26,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberBadgeText: {
    color: colors.onMain,
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    color: colors.onMain,
    fontSize: 22,
    fontWeight: "800",
    flex: 1,
  },
  heroSubtitle: {
    color: "rgba(255,247,238,0.82)",
    fontSize: 13,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoChip: {
    minHeight: 34,
    borderRadius: 14,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emailChip: {
    flex: 1,
  },
  infoChipText: {
    color: colors.onMain,
    fontSize: 12,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: -18,
    paddingHorizontal: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    shadowColor: colors.mainDark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainSoft,
  },
  statValue: {
    color: colors.mainDark,
    fontSize: 30,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  sectionEyebrow: {
    color: colors.mainDark,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: "800",
  },
  actionList: {
    gap: 12,
    marginTop: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  actionRowPressed: {
    opacity: 0.82,
  },
  actionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainSoft,
  },
  actionTextWrap: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: "700",
  },
  actionSubtitle: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
