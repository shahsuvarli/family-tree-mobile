import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';

type IconKey = 'home' | 'add-new' | 'profile'
type IconName = 'home' | 'plus' | 'person'

export function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {

    const icons: Record<IconKey, IconName> = {
        home: 'home',
        'add-new': 'plus',
        profile: 'person',
    }

    const primaryColor = '#0891b2'
    const greyColor = '#737373'

    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name

                const isFocused = state.index === index;

                if (['index'].includes(route.name)) return null

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const iconName = icons[route.name as IconKey]

                return (
                    <TouchableOpacity
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabbarItem}
                        key={route.name}
                    >

                        <Octicons name={iconName} size={30} color={isFocused ? primaryColor : greyColor} />
                        <Text style={{ color: isFocused ? primaryColor : greyColor, fontSize: 16 }}>
                            {label as string}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 25,
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 20,
        borderCurve: 'continuous',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    }
})