import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Octicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const icons = {
        home: (props) => <Octicons name="home" size={30} color={Colors.button} {...props} />,
        'add-new': (props) => <Octicons name="plus" size={30} color={Colors.button} {...props} />,
        profile: (props) => <Octicons name="person" size={30} color={Colors.button} {...props} />,
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
                        {icons[route.name]({
                            color: isFocused ? primaryColor : greyColor,
                            fontSize: 11,
                        })}
                        <Text style={{ color: isFocused ? primaryColor : greyColor, fontSize: 16 }}>
                            {label}
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