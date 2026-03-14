import { AppTabBar } from "@/components/navigation/TabBar";
import { colors } from "@/theme/colors";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: false,
      }}
      tabBar={(props) => <AppTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: () => (
            <Octicons name="home" size={30} color={colors.button} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-new"
        options={{
          headerShown: false,
          tabBarAccessibilityLabel: "Add new person",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons
              name="person-circle-outline"
              size={35}
              color={colors.button}
            />
          ),
          tabBarItemStyle: {
            backgroundColor: colors.background,
          },
          tabBarLabelStyle: {
            color: colors.button,
          },
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
