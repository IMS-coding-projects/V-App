import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mode } from '@/lib/theme'
import { router } from 'expo-router'
import { Alert, View } from 'react-native'
import { useUniwind } from 'uniwind'
import Logo from '@/components/svg/Logo'

export default function SettingsScreen() {
    const { theme } = useUniwind()

    const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'Not configured'

    const handleUrlChange = () => {
        Alert.alert(
            'API URL Change',
            `Current Backend URL: ${apiUrl}\n\n⚠️ Changing the API URL requires:\n• Restarting the app\n• Updating your .env file\nSince you can't edit ENV vars during runtime. Edit EXPO_PUBLIC_API_URL in your .env file and restart.`,
            [{ text: 'Got it', style: 'destructive' }]
        )
    }

    return (
        <View className="bg-background flex-1 items-center gap-4 p-4">
            <Logo mode={theme as Mode} height={76} />
            <Text className="text-2xl font-bold text-foreground">Settings</Text>

            {/* API Backend Card */}
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Backend Server</CardTitle>
                    <CardDescription>OrariAperti API endpoint</CardDescription>
                </CardHeader>
                <CardContent className="gap-4">
                    <View className="gap-2">
                        <Label>API URL</Label>
                        <View className="flex-row items-center gap-2 p-3 bg-muted rounded-md">
                            <Text className="flex-1 text-sm font-mono text-foreground/80" numberOfLines={1}>
                                {apiUrl}
                            </Text>
                            <Button size="sm" variant="outline" onPress={handleUrlChange}>
                                <Text className="text-xs">Change</Text>
                            </Button>
                        </View>
                        <Text className="text-xs text-muted-foreground">Edit `EXPO_PUBLIC_API_URL` in your `.env` file and restart the app</Text>
                    </View>
                </CardContent>
            </Card>

            {/* About Card */}
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>About OrariAperti</CardTitle>
                </CardHeader>
                <CardContent className="gap-2">
                    <Text className="text-muted-foreground text-center">
                        This is an <Text className="font-bold text-foreground">IMS-Coding-Projects</Text> Production
                    </Text>

                    <Button
                        variant="secondary"
                        onPress={() => {
                            router.push('https://github.com/IMS-Coding-Projects/V-App')
                        }}
                    >
                        <Text className="text-sm font-medium underline text-primary">View on GitHub →</Text>
                    </Button>
                </CardContent>
            </Card>
        </View>
    )
}
