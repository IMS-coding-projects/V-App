import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: '404 Not Found', headerBackTitle: 'Back' }} />
            <View className="flex-1 justify-center items-center gap-8 ">
                <Text>This screen doesn't exist.</Text>


            </View>
        </>
    );
}
