import { Pressable, View } from "react-native";
import { router, Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { appRoutes } from "@/constants/routes";
import { colors } from "@/theme/colors";
import { usePersonStore } from "@/features/people/store/usePersonStore";

interface PersonRouteParams {
  id?: string;
  name?: string;
}

interface FavoriteRouteParams {
  id?: string;
}

export default function AuthStackLayout() {
  const { person, handleFavorite } = usePersonStore();

  return (
    <Stack>
      <Stack.Screen
        name="search"
        options={{
          title: "Search",
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
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  <Pressable onPress={handleFavorite}>
                    <FontAwesome
                      name={person.is_favorite ? "star" : "star-o"}
                      size={30}
                      color={colors.button}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: appRoutes.authTabsHomeEditPerson,
                        params: { person_id: personId },
                      })
                    }
                  >
                    <FontAwesome
                      name="pencil-square-o"
                      size={27}
                      color={colors.button}
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
        options={({ route }: { route: { params?: FavoriteRouteParams } }) => ({
          headerShown: true,
          title: "Favorites",
          headerRight: () => {
            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: appRoutes.authTabsHomeEditPerson,
                    params: { person_id: route.params?.id },
                  })
                }
              >
                <FontAwesome
                  name="pencil-square-o"
                  size={25}
                  color={colors.button}
                />
              </Pressable>
            );
          },
        })}
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
          headerShown: false,
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
