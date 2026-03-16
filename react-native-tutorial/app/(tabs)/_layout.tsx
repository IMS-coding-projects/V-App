import { Tabs } from 'expo-router'
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Ionicons } from '@expo/vector-icons'
import { Platform } from 'react-native'

export default function TabsLayout() {
    if (Platform.OS === 'ios') {
        return (
            <NativeTabs>
                <NativeTabs.Trigger name="home">
                    <Label>Home</Label>
                    <Icon sf={{ default: 'house', selected: 'house.fill' }} />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="settings">
                    <Label>Settings</Label>
                    <Icon sf={{ default: 'gear', selected: 'gear' }} />
                </NativeTabs.Trigger>
            </NativeTabs>
        )
    }

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
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