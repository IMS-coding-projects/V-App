import { Stack } from 'expo-router'
import { View } from 'react-native'
import { Text } from '@/components/ui/text'

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: '404 Not Found', headerBackTitle: 'Back' }} />
            <View className="flex-1 justify-center items-center gap-8 ">
                <Text className="text-2xl text-center font-bold">Oh NO!{'\n'}The Page Has Gone Undercover.</Text>
                <Text className="text-xl text-center pb-30">This page is in witness protection. {'\n'} Even we don't know where it went : ( </Text>
            </View>
        </>
    )
}
