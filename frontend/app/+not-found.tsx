import { Link, Stack } from 'expo-router'
import { View, Image } from 'react-native'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: '404 Not Found' }} />
            <View className='flex-1 justify-center items-center gap-8 '>
                <Text className='text-2xl text-center font-bold'>Oh NO!{'\n'}The Page Has Gone Undercover.</Text>
                <Text className='text-xl text-center pb-30'>This page is in witness protection. {'\n'} Even we don't know where it went : ( </Text>
            </View>
        </>
    )
}
