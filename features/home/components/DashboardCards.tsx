import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { RelativePathString, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { appRoutes } from "@/constants/routes";
import { dashboardCards } from "@/features/home/data/dashboard-cards";
import { useSession } from "@/features/auth/providers/SessionProvider";
import type { DashboardCard } from "@/types/ui";
import findPrimaryPerson from "@/features/people/lib/findPrimaryPerson";

const CARD_GAP = 12;
const HOME_HORIZONTAL_PADDING = 16;

const DashboardCards = () => {
  const { session } = useSession();
  const { width } = useWindowDimensions();
  const cardWidth = (width - HOME_HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

  async function handleCardPress(item: DashboardCard) {
    if (!session) {
      return;
    }

    if (item.route === appRoutes.authStackPerson) {
      const person = await findPrimaryPerson(session);

      router.push({
        pathname: item.route as RelativePathString,
        params: {
          id: person?.id ?? session,
          name: person?.name ?? "",
        },
      });
      return;
    }

    router.push({
      pathname: item.route as RelativePathString,
      params: { id: session },
    });
  }

  return (
    <View style={styles.gridContainer}>
      {dashboardCards.map((item: DashboardCard) => (
        <Pressable
          style={[styles.gridCardContainer, { width: cardWidth }]}
          onPress={() => void handleCardPress(item)}
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    rowGap: CARD_GAP,
    borderRadius: 20,
  },
  gridCardContainer: {
    alignSelf: "stretch",
  },
  gridItem: {
    flexDirection: "column",
    padding: 10,
    borderRadius: 20,
    height: 110,
    gap: 10,
    width: "100%",
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
