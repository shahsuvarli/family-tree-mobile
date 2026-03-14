import { Ionicons, Octicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const APP_TAB_BAR_HEIGHT = 80;
const TAB_ICON_SIZE = 24;
const ADD_ICON_SIZE = 30;
const ADD_BUTTON_SIZE = 54;
const TAB_BAR_VERTICAL_PADDING = 12;

export function AppTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
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

        const label =
          route.name === "home"
            ? "Home"
            : route.name === "profile"
              ? "Profile"
              : "Add";

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
                    backgroundColor: colors.main,
                  },
                ]}
              >
                <Ionicons name="add" size={ADD_ICON_SIZE} color={colors.onMain} />
              </View>
            ) : (
              <View style={styles.tabItemInner}>
                <Octicons
                  name={route.name === "home" ? "home" : "person"}
                  size={TAB_ICON_SIZE}
                  color={isFocused ? colors.mainDark : colors.inkMuted}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelActive,
                  ]}
                >
                  {label}
                </Text>
              </View>
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
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: APP_TAB_BAR_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    shadowColor: colors.mainDark,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 14,
    shadowOpacity: 0.08,
    elevation: 12,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 56,
  },
  tabItemInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.inkMuted,
  },
  tabLabelActive: {
    color: colors.mainDark,
  },
  addButton: {
    width: ADD_BUTTON_SIZE,
    height: ADD_BUTTON_SIZE,
    borderRadius: ADD_BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.mainDark,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
});
