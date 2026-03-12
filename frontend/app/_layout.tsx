import '@/global.css'

import { Mode, NAV_THEME } from '@/lib/theme'
import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { useUniwind } from 'uniwind'
import { HeaderTitle } from '@/components/header/HeaderTitle'
import { ThemeToggle } from '@/components/header/ThemeToggle'
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message'
import { JSX } from 'react'

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
    const { theme } = useUniwind()

    const toastConfig = {
        success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
            <BaseToast
                {...props}
                style={{ borderLeftColor: 'green', backgroundColor: NAV_THEME[theme as Mode].colors.background }}
                text1Style={{
                    color: NAV_THEME[theme as Mode].colors.text,
                    fontSize: 17,
                }}
                text2Style={{
                    fontSize: 15,
                }}
            />
        ),
        error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
            <ErrorToast
                {...props}
                style={{ borderLeftColor: 'red', backgroundColor: NAV_THEME[theme as Mode].colors.background }}
                text1Style={{
                    color: NAV_THEME[theme as Mode].colors.text,
                    fontSize: 17,
                }}
                text2Style={{
                    fontSize: 15,
                }}
            />
        ),
    }

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
                    <Stack.Screen
                        name="edit-reservation/[id]"
                        options={{
                            headerBackTitle: '',
                            title: `Edit Reservation`,
                            headerShown: true,
                            headerRight: () => <ThemeToggle />,
                        }}
                    />
                </Stack>

                <PortalHost />
                <Toast position={'bottom'} bottomOffset={100} config={toastConfig} />
            </ThemeProvider>
        </>
    )
}
