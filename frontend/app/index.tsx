import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { Mode } from '@/lib/theme'
import { Link, LinkProps, router, Stack, useRouter } from 'expo-router'
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native'
import { Image, ImageSourcePropType, type ImageStyle, View } from 'react-native'
import { Uniwind, useUniwind } from 'uniwind'
import Logo from '@/components/svg/Logo'

const LOGO: Record<Mode, ImageSourcePropType> = {
    light: require('@/assets/images/react-native-reusables-light.png'),
    dark: require('@/assets/images/react-native-reusables-dark.png'),
}

function Header() {
    const { theme } = useUniwind()
    return (
        <View className="flex-1 flex-row items-center justify-center gap-2 p-4">
            <Logo mode={(theme ?? 'light') as Mode} height={24} />
            <Text className="text-xl font-bold">OrariAperti</Text>
        </View>
    )
}

// typescript
// Put the title component in the left slot and keep the literal type to satisfy TS
const SCREEN_OPTIONS = {
    headerTitle: () => <Header />,
    title: 'OrariAperti',
    headerRight: () => <ThemeToggle />,
}

export default function Screen() {
    const { theme } = useUniwind()

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <View className="flex-1 items-center justify-center gap-8 p-4">
                <Logo mode={(theme ?? 'light') as Mode} height={76} />
                
                <View className="gap-2 p-4">
                    <Text>Welcome to OrariAperti!</Text>
                </View>

                <Link href={{ pathname: './Hello' }} asChild>
                    <Button>
                        <Text>Go to Hello</Text>
                    </Button>
                </Link>

                <View className="flex-row gap-2">
                    <Link href="https://github.com/IMS-coding-projects/OrariAperti" asChild>
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
