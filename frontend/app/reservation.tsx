import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Calendar, Edit3, LucideX, Share2, Trash2, Users } from 'lucide-react-native'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'
import * as Clipboard from 'expo-clipboard'
import { ThemeToggle } from '@/components/header/ThemeToggle'
import Toast from 'react-native-toast-message'
import { ReservationDetailsAdvanced } from '@/types/api'

export default function ReservationScreen() {
    const {
        reservation: reservationJson,
        privateKey,
        publicKey,
    } = useLocalSearchParams<{
        reservation?: string
        privateKey?: string
        publicKey?: string
    }>()

    const SCREEN_OPTIONS = {
        headerBackTitle: 'Back',
        title: 'Reservation Details',
        headerRight: () => <ThemeToggle />,
    }

    const router = useRouter()

    const reservationData: ReservationDetailsAdvanced = reservationJson ? JSON.parse(reservationJson as string) : null

    if (!reservationData) {
        return (
            <>
                <Stack.Screen options={SCREEN_OPTIONS} />
                <View className="flex-1 bg-background items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>No Reservation Data</CardTitle>
                            <CardDescription>Please load a reservation first.</CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <Button className="w-full" onPress={() => router.back()}>
                                <Text>Go Back</Text>
                            </Button>
                        </CardFooter>
                    </Card>
                </View>
            </>
        )
    }

    const startDateTime = new Date(`${reservationData.date}T${reservationData.startTime}`)
    const endDateTime = new Date(`${reservationData.date}T${reservationData.endTime}`)

    const handleEdit = () => {
        router.push({
            pathname: `/edit-reservation/[id]`,
            params: { id: reservationData.id, key: privateKey },
        })
    }

    const handleShare = async () => {
        const shareMessage = `🎉 *Event Invitation* 🎉

📅 ${format(startDateTime, 'PPP', { locale: enGB })}
🕒 ${reservationData.startTime} - ${reservationData.endTime}
📍 Room Number: ${reservationData.room.roomNumber}

${reservationData.description ? `📝 Description: ${reservationData.description.trim()}` : ''}
${reservationData.participants ? `\n👥 Participants: ${reservationData.participants}` : ''}

🔗 Public Key: \`${publicKey}\`

💡 More Information: OrariAperti App → Access Keys → Paste public key

_Shared with OrariAperti Mobile App_`

        await Clipboard.setStringAsync(shareMessage)
        Toast.show({
            type: 'success',
            text1: 'Copied Reservation Details!',
            text2: 'You can now share this event with others.',
        })
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reservation/${reservationData.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    privateKey: String(privateKey),
                },
            })

            if (!res.ok) {
                throw new Error('Failed to delete reservation.')
            }

            Toast.show({
                type: 'success',
                text1: 'Reservation deleted',
                text2: 'The reservation has been removed.',
            })

            router.back()
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Delete failed',
                text2: error instanceof Error ? error.message : 'Please try again.',
            })
        }
    }

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />

            <ScrollView className="bg-background p-2">
                <Card className="w-full">
                    <CardHeader>
                        <View className="flex-row items-start justify-between mb-2">
                            <View className="flex-1">
                                <CardTitle className="text-2xl mb-1">Room {reservationData.room.roomNumber}</CardTitle>
                                {reservationData.description && <CardDescription>Description: {reservationData.description.trim()}</CardDescription>}
                            </View>
                        </View>
                    </CardHeader>

                    <CardContent className="gap-2">
                        {/* Date & Time Section */}
                        <View className="gap-3">
                            <Text className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">When</Text>
                            <View className="flex-row items-center gap-3 p-4 bg-muted/50 rounded-xl">
                                <View className="w-12 h-12 bg-primary/10 rounded-lg items-center justify-center">
                                    <Icon as={Calendar} size={20} className="text-primary" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold text-foreground">{format(startDateTime, 'PPP', { locale: enGB })}</Text>
                                    <Text className="text-muted-foreground text-sm mt-0.5">
                                        {format(startDateTime, 'HH:mm')} - {format(endDateTime, 'HH:mm')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Room Features */}
                        {reservationData.room.roomFeatures?.length > 0 && (
                            <View className="gap-3">
                                <Text className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">Room Features</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {reservationData.room.roomFeatures.map((feature) => (
                                        <Badge key={feature} variant="outline" className="px-3 py-1.5">
                                            <Text>{feature}</Text>
                                        </Badge>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Participants */}
                        {reservationData.participants && (
                            <View className="gap-3">
                                <Text className="text-sm font-semibold text-foreground/80 tracking-wide uppercase">Participants</Text>
                                <View className="p-4 bg-muted/50 rounded-xl">
                                    <View className="flex-row items-start gap-3">
                                        <Icon as={Users} size={20} className="mt-0.5 text-muted-foreground" />
                                        <Text className="text-foreground text-base leading-relaxed">{reservationData.participants}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </CardContent>

                    <CardFooter className="pt-6 gap-3 flex-col justify-between">
                        <Button className="w-full" onPress={handleShare}>
                            <Icon as={Share2} size={18} className="mr-2 text-primary-foreground" />
                            <Text>Share Event</Text>
                        </Button>

                        {privateKey && (
                            <View className="flex-row gap-2 w-full">
                                <Button className="w-1/2" variant="outline" onPress={handleEdit}>
                                    <Icon as={Edit3} size={18} className="mr-2" />
                                    <Text>Edit</Text>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" className="w-[82%]">
                                            <Icon as={Trash2} size={18} className="mr-2 text-primary-foreground" />
                                            <Text>Delete</Text>
                                        </Button>
                                    </AlertDialogTrigger>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete this reservation?</AlertDialogTitle>
                                            <AlertDialogDescription>This action cannot be undone. This will permanently delete this reservation and remove it from the system.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                <Icon as={LucideX} size={18} className="mr-2" />
                                                <Text>Cancel</Text>
                                            </AlertDialogCancel>
                                            <AlertDialogAction asChild>
                                                <Button className={'bg-destructive active:bg-destructive/90 dark:bg-destructive/60 shadow-sm shadow-black/5'} onPress={handleDelete}>
                                                    <Icon as={Trash2} size={18} className="mr-2 text-primary-foreground" />
                                                    <Text>Delete</Text>
                                                </Button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </View>
                        )}
                    </CardFooter>
                </Card>
            </ScrollView>
        </>
    )
}
