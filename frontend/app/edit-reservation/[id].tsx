import React, { useEffect, useState } from 'react'
import { Keyboard, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@/components/ui/icon'
import { Calendar, Clock, MapPin, Save, X } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { Reservation, ReservationDTO, Room } from '@/types/api'
import { validateReservation } from '@/lib/validator'

export default function EditReservationScreen() {
    const { id, key: privateKeyParam } = useLocalSearchParams<{ id: string; key: string }>()
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formErrors, setFormErrors] = useState<string[]>([])
    const [originalFormData, setOriginalFormData] = useState<ReservationDTO | null>(null)

    // Form state
    const [formData, setFormData] = useState<ReservationDTO>({
        date: '',
        startTime: '',
        endTime: '',
        roomId: '',
        description: '',
        participants: '',
    })

    const [rooms, setRooms] = useState<Room[]>([])
    const [originalReservation, setOriginalReservation] = useState<Reservation | null>(null)

    // Formatters
    const formatDateString = (dateString: string | Date): string => {
        const date = new Date(dateString)
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
    }

    const formatTimeString = (timeString: string): string => {
        return timeString ? timeString.substring(0, 5) : ''
    }

    // validators
    const handleInputChange = (field: keyof ReservationDTO, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Re-validate immediately
        setTimeout(() => validateReservation(formData, setFormErrors), 0)
    }

    // Load existing reservation
    useEffect(() => {
        loadReservation()
        loadRooms()
    }, [])

    useEffect(() => {
        if (originalReservation) {
            const formattedData: ReservationDTO = {
                date: formatDateString(originalReservation.date),
                startTime: formatTimeString(originalReservation.startTime),
                endTime: formatTimeString(originalReservation.endTime),
                roomId: originalReservation.room.id,
                description: originalReservation.description || '',
                participants: originalReservation.participants || '',
            }
            setFormData(formattedData)
            setOriginalFormData(formattedData) // ← Store original
            setFormErrors([]) // Reset errors
        }
    }, [originalReservation])

    // Add this function before handleSave
    const isFormChanged = (): boolean => {
        if (!originalFormData) return false

        return Object.keys(formData).some((key) => {
            const current = (formData as any)[key]
            const original = (originalFormData as any)[key]
            return current !== original && current !== original?.trim()
        })
    }

    const loadReservation = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reservation`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    privateKey: String(privateKeyParam),
                },
            })

            if (!res.ok) throw new Error('Failed to load reservation')

            const data = await res.json()
            const reservation = data.reservationDetails

            setOriginalReservation(reservation)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load reservation')
        } finally {
            setLoading(false)
        }
    }

    const loadRooms = async () => {
        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/room`)
            if (res.ok) {
                const roomData = await res.json()
                setRooms(roomData)
            }
        } catch (err) {
            console.error('Failed to load rooms:', err)
        }
    }

    const handleSave = async () => {
        if (!validateReservation(formData, setFormErrors)) {
            validateReservation(formData, setFormErrors)
            Toast.show({
                type: 'error',
                text1: `${formErrors.length} Errors Found:`,
                text2: formErrors.join(', '),
            })
            return
        }

        setSaving(true)
        setError(null)

        try {
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reservation/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    privateKey: String(privateKeyParam),
                },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`Update failed: ${errorText}`)
            }

            Toast.show({
                type: 'success',
                text1: 'Reservation Updated!',
                text2: 'Your changes have been saved.',
            })

            router.dismissTo('/(tabs)')

            router.replace({
                pathname: '/(tabs)',
                params: { privateKey: privateKeyParam },
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update reservation')
            Toast.show({
                type: 'error',
                text1: 'Save Failed',
                text2: err instanceof Error ? err.message : 'Please try again',
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <View className="flex-1 bg-background items-center justify-center p-4">
                <Text className="text-foreground">Loading reservation...</Text>
            </View>
        )
    }

    if (error || !originalReservation) {
        return (
            <View className="flex-1 bg-background items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error || 'Reservation not found'}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full" onPress={() => router.back()}>
                            <Text>Go Back</Text>
                        </Button>
                    </CardFooter>
                </Card>
            </View>
        )
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView className="flex-1 bg-background p-4">
                <Card className="w-full mb-6">
                    <CardHeader>
                        <CardTitle>Edit Reservation</CardTitle>
                        <CardDescription>Update the details for your reservation</CardDescription>
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
                                value={{ value: formData.roomId, label: `Room ${rooms.find((r) => r.id === formData.roomId)?.roomNumber ?? 0}` }}
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
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                placeholder="Enter reservation description..."
                                className="min-h-25"
                            />
                        </View>

                        {/* Participants */}
                        <View className="gap-2">
                            <Label>Participants</Label>
                            <Input value={formData.participants} onChangeText={(text) => setFormData({ ...formData, participants: text })} placeholder="John Doe, Jane Smith..." />
                        </View>
                    </CardContent>

                    <CardFooter className="flex-col gap-2">
                        {error && <Text className="text-destructive text-center text-sm">{error}</Text>}
                        <View className="flex-row gap-2 w-full">
                            <Button className="flex-1" variant="outline" onPress={() => router.back()} disabled={saving}>
                                <Icon as={X} size={18} className="mr-2" />
                                <Text>Cancel</Text>
                            </Button>
                            <Button className="flex-1" onPress={handleSave} disabled={!isFormChanged() || saving}>
                                <Icon as={Save} size={18} className="mr-2 text-primary-foreground" />
                                <Text>{saving ? 'Saving...' : 'Save Changes'}</Text>
                            </Button>
                        </View>
                    </CardFooter>
                </Card>
                <View className={'h-68'}></View>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}
