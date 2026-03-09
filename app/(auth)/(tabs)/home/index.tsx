import { StyleSheet, ScrollView } from "react-native";
import DashboardCards from "@/features/home/components/DashboardCards";
import WelcomeCard from "@/features/home/components/WelcomeCard";
import HomeHeader from "@/features/home/components/HomeHeader";
import HomeStats from "@/features/home/components/HomeStats";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexDirection: "column", gap: 10 }}
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
    flexDirection: "column",
    paddingHorizontal: 15,
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingTop: 100,
  },
});
