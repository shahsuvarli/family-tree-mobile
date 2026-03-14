import { Pressable, StyleSheet, View } from "react-native";
import { router, Stack } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { appRoutes } from "@/constants/routes";
import { colors } from "@/theme/colors";
import { usePersonStore } from "@/features/people/store/usePersonStore";

interface PersonRouteParams {
  id?: string;
  name?: string;
}

export default function AuthStackLayout() {
  const { person, handleFavorite } = usePersonStore();

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
        name="search"
        options={{
          title: "My family",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="person"
        options={({ route }: { route: { params?: PersonRouteParams } }) => {
          const displayName = route.params?.name ?? person.name;
          const personId = person.id ?? route.params?.id;

          return {
            headerShown: true,
            headerBackTitleVisible: false,
            title: displayName ? `${displayName}'s family` : "Family",
            headerRight: () => {
              return (
                <View
                  style={styles.headerActions}
                >
                  <Pressable
                    onPress={handleFavorite}
                    style={({ pressed }) => [
                      styles.headerIconAction,
                      pressed && styles.headerActionPressed,
                    ]}
                  >
                    <FontAwesome
                      name={person.is_favorite ? "star" : "star-o"}
                      size={26}
                      color={colors.mainDark}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: appRoutes.authTabsHomeEditPerson,
                        params: { person_id: personId },
                      })
                    }
                    style={({ pressed }) => [
                      styles.headerIconAction,
                      pressed && styles.headerActionPressed,
                    ]}
                  >
                    <FontAwesome
                      name="pencil-square-o"
                      size={24}
                      color={colors.mainDark}
                    />
                  </Pressable>
                </View>
              );
            },
          };
        }}
      />
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Home",
          headerShown: true,
          gestureDirection: "horizontal",
        }}
      />
      <Stack.Screen
        name="favorite"
        options={{
          headerShown: true,
          title: "Favorites",
        }}
      />

      <Stack.Screen
        name="recently-added"
        options={{
          title: "Recently added",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="add-relative"
        options={{
          title: "Add relative",
          headerShown: true,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="add-new"
        options={{
          title: "Add person",
          headerShown: true,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}

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
  headerIconAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  headerActionPressed: {
    opacity: 0.82,
  },
});
