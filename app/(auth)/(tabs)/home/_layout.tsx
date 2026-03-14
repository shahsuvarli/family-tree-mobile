import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { appRoutes } from "@/constants/routes";

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.canvas,
        },
        headerTitleStyle: {
          color: colors.ink,
          fontSize: 20,
          fontWeight: "700",
        },
        headerLeft: () => (
          <Pressable
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
                return;
              }

              router.replace(appRoutes.authTabsHome);
            }}
            style={({ pressed }) => [
              styles.headerNavAction,
              pressed && styles.headerActionPressed,
            ]}
          >
            <Ionicons
              name={navigation.canGoBack() ? "arrow-back" : "home-outline"}
              size={20}
              color={colors.mainDark}
            />
          </Pressable>
        ),
      })}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          gestureDirection: "horizontal",
        }}
      />

      <Stack.Screen
        name="edit-person"
        options={{
          title: "Edit person",
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;

const styles = StyleSheet.create({
  headerNavAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderWarm,
  },
  headerActionPressed: {
    opacity: 0.82,
  },
});
