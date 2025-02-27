import { Pressable, View } from "react-native";
import { router, Stack } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { usePersonStore } from "@/utils/store";

export default function OtherLayout() {
  const {
    person,
    handleFavorite,
  } = usePersonStore();
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
        options={() => ({
          headerShown: true,
          headerBackTitleVisible: false,
          title: `${person.name}'s family`,
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
                  <AntDesign
                    name={person.is_favorite ? "star" : "staro"}
                    size={30}
                    color={Colors.button}
                  />
                </Pressable>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(auth)/(tabs)/home/edit-person",
                      params: { person_id: person.id },
                    })
                  }
                >
                  <FontAwesome
                    name="pencil-square-o"
                    size={27}
                    color={Colors.button}
                  />
                </Pressable>
              </View>
            );
          }

        })}
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
        options={({ route }: any) => ({
          headerShown: true,
          title: "Favorites",
          headerRight: () => {
            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/(tabs)/home/edit-person",
                    params: { person_id: route.params.id },
                  })
                }
              >
                <FontAwesome
                  name="pencil-square-o"
                  size={25}
                  color={Colors.button}
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
    </Stack>
  );
}
