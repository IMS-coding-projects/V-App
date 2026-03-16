import { Text } from '@/components/ui/text'
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '@/components/ui/card'
import { Mode } from '@/lib/theme'
import { View } from 'react-native'
import { useUniwind } from 'uniwind'
import Logo from '@/components/svg/Logo'

export default function SettingsScreen() {
    const { theme } = useUniwind()

    return (
        <View className="bg-background flex-1 items-center gap-4 p-4">
            <Logo mode={theme as Mode} height={76} />
            <Text className="text-2xl font-bold text-foreground">Settings</Text>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>A Card Example Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent className="gap-4">
                    <Text>Card Content</Text>
                </CardContent>
                <CardFooter>
                    <Text>Card Footer</Text>
                </CardFooter>
            </Card>
        </View>
    )
}