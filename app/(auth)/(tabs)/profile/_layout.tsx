import { Pressable } from "react-native";
import { router, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { appRoutes } from "@/constants/routes";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { colors } from "@/theme/colors";

const ProfileLayout = () => {
  const { signOut } = useSession();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.push(appRoutes.authTabsProfileEdit)}>
              <FontAwesome
                name="pencil-square-o"
                size={25}
                color={colors.button}
                style={{ marginLeft: 5 }}
              />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => void signOut()}>
              <FontAwesome
                name="sign-out"
                size={27}
                color={colors.warning}
                style={{ marginRight: 5 }}
              />
            </Pressable>
          ),
        }}
      />
      {/* <Stack.Screen
        name="recently-added"
        options={{ headerShown: true, title: "Recently added" }}
      /> */}
      <Stack.Screen
        name="edit-profile"
        options={{ headerShown: true, title: "Edit profile" }}
      />
    </Stack>
  );
};

export default ProfileLayout;
