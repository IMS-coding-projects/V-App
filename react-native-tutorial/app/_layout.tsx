import '@/global.css'

import { Mode, NAV_THEME } from '@/lib/theme'
import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { useUniwind } from 'uniwind'
import { HeaderTitle } from '@/components/header/HeaderTitle'
import { ThemeToggle } from '@/components/header/ThemeToggle'

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
    const { theme } = useUniwind()

    return (
        <>
            <ThemeProvider value={NAV_THEME[theme as Mode]}>
                <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

                <Stack
                    screenOptions={{
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerTitle: () => <HeaderTitle />,
                            headerShown: true,
                            headerBackVisible: false,
                            headerRight: () => <ThemeToggle />,
                        }}
                    />
                </Stack>

                <PortalHost />
            </ThemeProvider>
        </>
    )
}