import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/app/ctx";
import { supabase } from "@/lib/supabase/client";
import { View, Text, StyleSheet, Image } from "react-native";

interface HomeStatsOverview {
  people_count: number;
  relationship_count: number;
}

const HomeStats = () => {
  const { session } = useSession();
  const isFocused = useIsFocused();
  const [overview, setOverview] = useState<HomeStatsOverview>({
    people_count: 0,
    relationship_count: 0,
  });

  const fetchProfileOverview = useCallback(async () => {
    if (!session) {
      setOverview({
        people_count: 0,
        relationship_count: 0,
      });
      return;
    }

    const { data, error } = await supabase
      .from("profile_overview")
      .select("people_count, relationship_count")
      .eq("id", session)
      .single<HomeStatsOverview>();

    if (error) {
      console.error("Failed to load home stats", error.message);
      return;
    }

    setOverview({
      people_count: data.people_count ?? 0,
      relationship_count: data.relationship_count ?? 0,
    });
  }, [session]);

  useEffect(() => {
    if (isFocused) {
      void fetchProfileOverview();
    }
  }, [fetchProfileOverview, isFocused]);

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
          colors={["#FF6100", "#fff"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
          key={item.id}
        >
          <Image
            source={item.image}
            tintColor={"#fff"}
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
    backgroundColor: "#FF6600",
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
    color: "#fff",
    fontWeight: "500",
  },
  recentText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
});
