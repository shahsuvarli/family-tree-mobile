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
import { showErrorToast } from "@/lib/toast";
import { colors } from "@/theme/colors";

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

      if (!person) {
        showErrorToast(
          "Family unavailable",
          "We couldn't load your main family person. Please try again."
        );
        return;
      }

      router.push({
        pathname: item.route as RelativePathString,
        params: {
          id: person.id,
          name: person.name,
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
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.gridItemTop}>
              <View style={styles.gridItemIconWrap}>
                <Image source={item.image} style={styles.gridItemImage} />
              </View>
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
    padding: 14,
    borderRadius: 24,
    minHeight: 128,
    gap: 12,
    width: "100%",
  },

  gridItemTop: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  gridItemBottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  gridItemIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  gridItemImage: {
    width: 24,
    height: 24,
    tintColor: colors.onMain,
  },
  gridItemText: {
    color: colors.onMain,
    fontSize: 19,
    fontWeight: "700",
  },
});
