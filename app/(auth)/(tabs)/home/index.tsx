import { StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DashboardCards from "@/features/home/components/DashboardCards";
import WelcomeCard from "@/features/home/components/WelcomeCard";
import HomeHeader from "@/features/home/components/HomeHeader";
import HomeStats from "@/features/home/components/HomeStats";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 16,
          paddingBottom: 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader />
      <WelcomeCard />
      <HomeStats />
      <DashboardCards />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
});
