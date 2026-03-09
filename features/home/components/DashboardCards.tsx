import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { RelativePathString, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { dashboardCards } from "@/features/home/data/dashboard-cards";
import { useSession } from "@/app/ctx";
import type { DashboardCard } from "@/types/ui";

const DashboardCards = () => {
  const { session } = useSession();

  return (
    <View style={styles.gridContainer}>
      {dashboardCards.map((item: DashboardCard) => (
        <Pressable
          style={styles.gridCardContainer}
          onPress={() =>
            router.push({ pathname: item.route as RelativePathString, params: { id: session } })
          }
          key={item.id}
        >
          <LinearGradient
            colors={item.colors}
            style={styles.gridItem}
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: -2 }}
          >
            <View style={styles.gridItemTop}>
              <Image source={item.image} style={styles.gridItemImage} />
            </View>
            <View style={styles.gridItemBottom}>
              <Text style={styles.gridItemText}>{item.title}</Text>
            </View>
          </LinearGradient>
        </Pressable>
      ))}
    </View>
  );
};

export default DashboardCards;

const styles = StyleSheet.create({
  gridContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    flex: 2,
    marginTop: 10,
    width: "100%",
    gap: 7,
    borderRadius: 20,
  },
  gridCardContainer: {
    flexBasis: "49%",
  },
  gridItem: {
    flexDirection: "column",
    padding: 10,
    borderRadius: 20,
    height: 110,
    gap: 10,
  },

  gridItemTop: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  gridItemBottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingLeft: 7,
  },
  gridItemImage: {
    width: 50,
    height: 50,
  },
  gridItemText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
});
