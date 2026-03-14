import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { fetchProfileOverview as fetchProfileOverviewService } from "@/features/profile/services/profileService";
import { colors } from "@/theme/colors";
import { View, Text, StyleSheet, Image } from "react-native";

interface HomeStatsOverview {
  people_count: number;
  relationship_count: number;
}

const HomeStats = () => {
  const { userId } = useSession();
  const isFocused = useIsFocused();
  const [overview, setOverview] = useState<HomeStatsOverview>({
    people_count: 0,
    relationship_count: 0,
  });

  const loadProfileOverview = useCallback(async () => {
    if (!userId) {
      setOverview({
        people_count: 0,
        relationship_count: 0,
      });
      return;
    }

    const { data, error } = await fetchProfileOverviewService(userId);

    if (error) {
      console.error("Failed to load home stats", error.message);
      return;
    }

    setOverview({
      people_count: data.people_count ?? 0,
      relationship_count: data.relationship_count ?? 0,
    });
  }, [userId]);

  useEffect(() => {
    if (isFocused) {
      void loadProfileOverview();
    }
  }, [loadProfileOverview, isFocused]);

  const statsCards = [
    {
      id: 1,
      image: require("@/assets/images/family-kpi.png"),
      count: overview.people_count,
      title: "people",
    },
    {
      id: 2,
      image: require("@/assets/images/relation-kpi.png"),
      count: overview.relationship_count,
      title: "relations",
    },
  ];

  return (
    <View style={styles.container}>
      {statsCards.map((item) => (
        <LinearGradient
          colors={[colors.main, colors.mainGlow]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
          key={item.id}
        >
          <Image
            source={item.image}
            tintColor={colors.onMain}
            style={styles.cardImage}
          />
          <View style={styles.cardText}>
            <Text style={styles.recentText}>{item.count}</Text>
            <Text style={styles.count}>{item.title}</Text>
          </View>
        </LinearGradient>
      ))}
    </View>
  );
};

export default HomeStats;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: colors.main,
    borderRadius: 20,
    flex: 1,
    padding: 12,
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 35,
    height: 35,
  },
  cardText: {
    flexDirection: "column",
  },
  count: {
    fontSize: 15,
    color: colors.onMain,
    fontWeight: "500",
  },
  recentText: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.onMain,
  },
});
