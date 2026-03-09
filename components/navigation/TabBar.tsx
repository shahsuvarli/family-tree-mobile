import { Ionicons, Octicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const APP_TAB_BAR_HEIGHT = 56;
export const APP_TAB_BAR_MARGIN = 16;
const TAB_ICON_SIZE = 26;
const ADD_ICON_SIZE = 26;
const ADD_BUTTON_SIZE = 46;

export function AppTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const primaryColor = "#0891b2";
  const mutedColor = "#737373";

  return (
    <View
      style={[
        styles.container,
        {
          bottom: Math.max(insets.bottom, APP_TAB_BAR_MARGIN),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        if (route.name === "index") {
          return null;
        }

        const onPress = () => {
          if (route.name === "add-new") {
            router.push("/(auth)/(other)/add-new");
            return;
          }

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={
              options.tabBarAccessibilityLabel ??
              (typeof options.title === "string" ? options.title : route.name)
            }
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabBarItem,
              route.name === "add-new" && styles.addNewTabBarItem,
            ]}
            key={route.name}
          >
            {route.name === "add-new" ? (
              <View
                style={[
                  styles.addButton,
                  {
                    backgroundColor: isFocused ? primaryColor : "#1f9fbd",
                  },
                ]}
              >
                <Ionicons name="add" size={ADD_ICON_SIZE} color="#fff" />
              </View>
            ) : (
              <Octicons
                name={route.name === "home" ? "home" : "person"}
                size={TAB_ICON_SIZE}
                color={isFocused ? primaryColor : mutedColor}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const MyTabBar = AppTabBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: APP_TAB_BAR_MARGIN,
    right: APP_TAB_BAR_MARGIN,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: APP_TAB_BAR_HEIGHT,
    borderRadius: 18,
    borderCurve: "continuous",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 40,
  },
  addNewTabBarItem: {
    marginTop: -10,
  },
  addButton: {
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    borderRadius: ADD_BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0891b2",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
});
