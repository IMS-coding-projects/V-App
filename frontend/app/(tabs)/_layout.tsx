import { Tabs } from 'expo-router'
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs'
import { Ionicons } from '@expo/vector-icons'
import { DynamicColorIOS, Platform } from 'react-native'

export default function TabsLayout() {
    if (Platform.OS === 'ios') {
        return (
            <NativeTabs
                tintColor={DynamicColorIOS({
                    dark: '#8E51FF',
                    light: '#8E51FF',
                })}
            >
                <NativeTabs.Trigger name="index">
                    <Label>Home</Label>
                    <Icon sf={{ default: 'house', selected: 'house.fill' }} />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="new-reservation">
                    <Label>New Reservation</Label>
                    <Icon sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }} />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="settings">
                    <Label>Settings</Label>
                    <Icon sf={{ default: 'gear', selected: 'gear' }} />
                </NativeTabs.Trigger>
            </NativeTabs>
        )
    }

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#8E51FF', headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="new-reservation"
                options={{
                    title: 'New Reservation',
                    tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
                }}
            />
        </Tabs>
    )
}
