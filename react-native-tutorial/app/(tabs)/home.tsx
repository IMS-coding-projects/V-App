import { Keyboard, ScrollView, TouchableWithoutFeedback} from 'react-native'
import { Text } from '@/components/ui/text'

export default function AccessKeysScreen() {

    // Note: the h-[70vh] is only there that you can *✨feel✨* the scroll effect
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView className="flex-1 bg-background p-4">
                <Text className='h-[70vh] '>This Text is inside a scrollable view (view is like a div)</Text>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}