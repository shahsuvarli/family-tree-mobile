import { Ionicons, Octicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const APP_TAB_BAR_HEIGHT = 72;
const TAB_ICON_SIZE = 30;
const ADD_ICON_SIZE = 30;
const ADD_BUTTON_SIZE = 52;
const TAB_BAR_VERTICAL_PADDING = 10;

export function AppTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const primaryColor = "#0891b2";
  const mutedColor = "#737373";

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: TAB_BAR_VERTICAL_PADDING,
          paddingBottom: Math.max(insets.bottom, TAB_BAR_VERTICAL_PADDING),
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
            style={styles.tabBarItem}
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
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: APP_TAB_BAR_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#d4d4d4",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 10,
    shadowOpacity: 0.08,
    elevation: 12,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 52,
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
