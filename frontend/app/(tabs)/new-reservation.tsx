import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Check, Clock, Copy, MapPin, Save } from 'lucide-react-native'
import { Keyboard, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import Toast from 'react-native-toast-message'
import * as Clipboard from 'expo-clipboard'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ReservationDTO, ReservationResponse, Room } from '@/types/api'
import { validateReservation } from '@/lib/validator'
import { Icon } from '@/components/ui/icon'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function NewReservationScreen() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formErrors, setFormErrors] = useState<string[]>([])
    const [showKeysModal, setShowKeysModal] = useState(false)
    const [keysData, setKeysData] = useState<ReservationResponse | null>(null)

    // Form state - pre-populate today's date
    const today = new Date()
    const todayString = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

    const [formData, setFormData] = useState<ReservationDTO>({
        date: todayString,
        startTime: '09:00',
        endTime: '10:00',
        roomId: '',
        description: '',
        participants: '',
    })

    const [rooms, setRooms] = useState<Room[]>([])

    // validators
    const handleInputChange = (field: keyof ReservationDTO, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear errors when user starts typing
        setTimeout(() => {
            validateReservation(formData, setFormErrors)
        }, 0)
    }

    const copyToClipboard = async (text: string, label: string) => {
        await Clipboard.setStringAsync(text)
        Toast.show({
            type: 'success',
            text1: `${label} copied!`,
            text2: 'Key copied to clipboard',
        })
    }

    // Load rooms on mount
    useEffect(() => {
        loadRooms()
        setLoading(false)
    }, [])

    const loadRooms = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/room`)
            if (res.ok) {
                const roomData = await res.json()
                setRooms(roomData)
                // Pre-select first available room if any
                if (roomData.length > 0 && !formData.roomId) {
                    setFormData((prev) => ({ ...prev, roomId: roomData[0].id }))
                }
                setLoading(false)
            }
        } catch (err) {
            setError('Failed to load rooms')
        }
    }

    const handleSave = async () => {
        if (!validateReservation(formData, setFormErrors)) {
            Toast.show({
                type: 'error',
                text1: `${formErrors.length} Errors Found`,
                text2: formErrors.join(', '),
            })
            return
        }

        setSaving(true)
        setError(null)

        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`Create failed: ${errorText}`)
            }

            const responseData: ReservationResponse = await res.json()

            // Show success toast
            Toast.show({
                type: 'success',
                text1: 'Reservation Created!',
                text2: 'Access keys generated successfully.',
            })

            // Store keys data and show modal
            setKeysData(responseData)
            setShowKeysModal(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create reservation')
            Toast.show({
                type: 'error',
                text1: 'Create Failed',
                text2: err instanceof Error ? err.message : 'Please try again',
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <View className="flex-1 bg-background items-center justify-center p-4">
                <Text className="text-foreground">Loading...</Text>
            </View>
        )
    }

    return (
        <>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView className="flex-1 bg-background p-4">
                    <Card className="w-full mb-6">
                        <CardHeader>
                            <CardTitle className="flex-row items-center gap-2">
                                <Text>New Reservation</Text>
                            </CardTitle>
                            <CardDescription>Create a new room reservation</CardDescription>
                        </CardHeader>

                        <CardContent className="gap-4">
                            {/* Date */}
                            <View className="gap-2">
                                <Label>
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <Icon as={Calendar} size={17} />
                                        <Text>Date</Text>
                                    </View>
                                </Label>
                                <Input value={formData.date} onChangeText={(text) => handleInputChange('date', text)} placeholder="YYYY-MM-DD" />
                            </View>

                            {/* Times */}
                            <View className="gap-4">
                                <View className="gap-2">
                                    <Label>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Icon as={Clock} size={17} />
                                            <Text>Start Time</Text>
                                        </View>
                                    </Label>
                                    <Input value={formData.startTime} onChangeText={(text) => handleInputChange('startTime', text)} placeholder="HH:MM" />
                                </View>

                                <View className="gap-2">
                                    <Label>
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Icon as={Clock} size={17} />
                                            <Text>End Time</Text>
                                        </View>
                                    </Label>
                                    <Input value={formData.endTime} onChangeText={(text) => handleInputChange('endTime', text)} placeholder="HH:MM" />
                                </View>
                            </View>

                            {/* Room Selection */}
                            <View className="gap-2">
                                <Label htmlFor="room">
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <Icon as={MapPin} size={17} />
                                        <Text>Room</Text>
                                    </View>
                                </Label>

                                <Select
                                    value={{ value: formData.roomId, label: `Room ${rooms.find((r) => r.id === formData.roomId)?.roomNumber ?? ''}` }}
                                    onValueChange={(opt) => handleInputChange('roomId', opt?.value ?? '')}
                                    id="room"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a room" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rooms.map((room) => (
                                            <SelectItem label={`Room ${room.roomNumber}`} key={room.id} value={room.id}>
                                                <Text>Room {room.roomNumber}</Text>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </View>

                            {/* Description */}
                            <View className="gap-2">
                                <Label>Description (optional)</Label>
                                <Textarea
                                    value={formData.description}
                                    onChangeText={(text) => handleInputChange('description', text)}
                                    placeholder="Enter reservation description..."
                                    className="min-h-25"
                                />
                            </View>

                            {/* Participants */}
                            <View className="gap-2">
                                <Label>Participants</Label>
                                <Input value={formData.participants} onChangeText={(text) => handleInputChange('participants', text)} placeholder="John Doe, Jane Smith..." />
                            </View>
                        </CardContent>

                        <CardFooter className="flex-col gap-2">
                            {error && <Text className="text-destructive text-center text-sm">{error}</Text>}
                            <View className="flex-row w-full">
                                <Button className="flex-1" onPress={handleSave} disabled={saving}>
                                    <Icon as={Save} size={18} className="mr-2 text-primary-foreground" />
                                    <Text>{saving ? 'Creating...' : 'Create Reservation'}</Text>
                                </Button>
                            </View>
                        </CardFooter>
                    </Card>
                    <View className="h-45" />
                    {/* Keys Modal */}
                    <AlertDialog open={showKeysModal} onOpenChange={setShowKeysModal}>
                        <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="flex-row items-center gap-2">
                                    <Text>Reservation Keys</Text>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Text className="font-bold text-sm text-muted-foreground">Save these keys (screenshot/copy them)</Text>
                                    to manage your reservation
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <View className="gap-4">
                                <View className="gap-2">
                                    <Label>Public Key (Shareable)</Label>
                                    <View className="flex-row items-center justify-between bg-muted p-3 rounded-md">
                                        <Text className="text-foreground/70 flex-1 text-xs font-mono text-center" numberOfLines={2}>
                                            {keysData?.publicKey}
                                        </Text>
                                        <Button size="sm" variant="ghost" onPress={() => keysData && copyToClipboard(keysData.publicKey, 'Public Key')} className="p-1 h-8 w-8">
                                            <Icon as={Copy} size={16} />
                                        </Button>
                                    </View>
                                </View>

                                <View className="gap-2">
                                    <Label>Private Key (Owner Only)</Label>
                                    <View className="flex-row items-center justify-between bg-muted p-3 rounded-md">
                                        <Text className="text-foreground/70 flex-1 text-xs font-mono text-center" numberOfLines={2}>
                                            {keysData?.privateKey}
                                        </Text>
                                        <Button size="sm" variant="ghost" onPress={() => keysData && copyToClipboard(keysData.privateKey, 'Private Key')} className="p-1 h-8 w-8">
                                            <Icon as={Copy} size={16} />
                                        </Button>
                                    </View>
                                </View>

                                <View className="gap-1">
                                    <Text className="text-xs text-muted-foreground text-center">Keep your private key safe. Anyone with it can edit/delete this reservation.</Text>
                                    <Text className="text-sm text-destructive font-bold text-center">YOU WILL ONLY SEE THESE ONCE!</Text>
                                </View>
                            </View>

                            <AlertDialogFooter className="flex-col gap-2">
                                <AlertDialogAction asChild>
                                    <Button
                                        className="w-full"
                                        onPress={() => {
                                            debugger
                                            setShowKeysModal(false)
                                            setFormData({
                                                date: todayString,
                                                startTime: '09:00',
                                                endTime: '10:00',
                                                roomId: rooms[0]?.id || '',
                                                description: '',
                                                participants: '',
                                            })
                                            console.log(keysData)
                                            router.push({
                                                pathname: '/(tabs)',
                                                params: { privateKey: keysData?.privateKey || '' },
                                            })
                                        }}
                                    >
                                        <Icon as={Check} size={18} className="mr-2" />
                                        <Text>Done</Text>
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </ScrollView>
            </TouchableWithoutFeedback>
        </>
    )
}
