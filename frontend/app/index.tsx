import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Mode } from '@/lib/theme'
import { Link, Stack } from 'expo-router'
import { View } from 'react-native'
import { useUniwind } from 'uniwind'
import { HeaderTitle } from '@/components/header/HeaderTitle'
import { ThemeToggle } from '@/components/header/ThemeToggle'
import Logo from '@/components/svg/Logo'

const SCREEN_OPTIONS = {
    headerTitle: () => <HeaderTitle />,
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
