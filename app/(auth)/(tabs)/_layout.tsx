import { MyTabBar } from "@/components/tab";
import { Colors } from "@/constants/Colors";
import { Feather, Ionicons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <MyTabBar {...props} />}
    // initialRouteName="home"
    // screenOptions={{
    //   tabBarShowLabel: false,
    //   tabBarStyle: {
    //     borderBottomColor: "red",
    //   },
    // }}
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
            <Octicons name="home" size={30} color={Colors.button} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-new"
        options={{
          title: "Create",
          // headerTitle: "New person",
          // tabBarIcon: () => (
          //   <Feather name="plus-square" color={Colors.button} size={30} />
          // ),
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
              color={Colors.button}
            />
          ),
          tabBarItemStyle: {
            backgroundColor: Colors.background,
          },
          tabBarLabelStyle: {
            color: Colors.button,
          },
          title: "Profile",
        }}
      />
    </Tabs >

  );
}

