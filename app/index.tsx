import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { Mode } from '@/lib/theme'
import { Link, Stack } from 'expo-router'
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native'
import * as React from 'react'
import { Image, ImageSourcePropType, type ImageStyle, View } from 'react-native'
import { Uniwind, useUniwind } from 'uniwind'

const LOGO: Record<Mode, ImageSourcePropType> = {
    light: require('@/assets/images/react-native-reusables-light.png'),
    dark: require('@/assets/images/react-native-reusables-dark.png'),
}

const SCREEN_OPTIONS = {
    title: 'V-App',
    headerTransparent: true,
    headerRight: () => <ThemeToggle />,
}

const IMAGE_STYLE: ImageStyle = {
    height: 76,
    width: 76,
}

export default function Screen() {
    const { theme } = useUniwind()

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <View className="flex-1 items-center justify-center gap-8 p-4">
                <Image source={LOGO[(theme ?? 'light') as Mode]} style={IMAGE_STYLE} resizeMode="contain" />
                <View className="gap-2 p-4">
                    <Text className="ios:text-foreground text-muted-foreground font-mono text-sm">
                        V-App Getting started!
                    </Text>
                </View>
                <View className="flex-row gap-2">
                    <Link href="https://github.com/IMS-coding-projects/V-App" asChild>
                        <Button>
                            <Text>Browse the Docs</Text>
                        </Button>
                    </Link>
                </View>
            </View>
        </>
    )
}

const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
}

function ThemeToggle() {
    const { theme } = useUniwind()

    function toggleTheme() {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        Uniwind.setTheme(newTheme)
    }

    return (
        <Button onPressIn={toggleTheme} size="icon" variant="ghost" className="ios:size-9 web:mx-4 rounded-full">
            <Icon as={THEME_ICONS[(theme ?? 'light') as Mode]} className="size-5" />
        </Button>
    )
}
