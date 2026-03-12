import { useUniwind } from 'uniwind'
import Logo from '@/components/svg/Logo'
import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Mode } from '@/lib/theme'

export function HeaderTitle() {
    const { theme } = useUniwind()

    return (
        <View className="flex-1 flex-row items-center justify-center">
            <Logo mode={theme as Mode} height={24} />
            <Text className="text-xl font-bold">OrariAperti</Text>
        </View>
    )
}
