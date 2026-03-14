import { appRoutes } from "@/constants/routes";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { colors } from "@/theme/colors";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

const ProfileLayout = () => {
  const { signOut } = useSession();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.canvas,
          },
          headerTitleStyle: {
            color: colors.ink,
            fontSize: 22,
            fontWeight: "700",
          },
          headerLeft: () => (
            <Pressable
              onPress={() => router.push(appRoutes.authTabsProfileEdit)}
              style={({ pressed }) => [
                styles.headerAction,
                pressed && styles.headerActionPressed,
              ]}
            >
              <MaterialCommunityIcons
                name="account-edit-outline"
                size={20}
                color={colors.main}
              />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={() => void signOut()}
              style={({ pressed }) => [
                styles.headerAction,
                styles.signOutAction,
                pressed && styles.headerActionPressed,
              ]}
            >
              <FontAwesome name="sign-out" size={20} color={colors.warning} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={({ navigation }) => ({
          headerShown: true,
          title: "Edit profile",
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
                styles.headerAction,
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
      />
    </Stack>
  );
};

export default ProfileLayout;

const styles = StyleSheet.create({
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderWarm,
  },
  signOutAction: {
    borderColor: "rgba(178,59,59,0.16)",
  },
  headerActionPressed: {
    opacity: 0.82,
  },
});
