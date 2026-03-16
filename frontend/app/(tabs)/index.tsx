import React, { useEffect } from 'react'
import { Keyboard, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DownloadCloud, Globe, Link, Loader2Icon, Shield, TriangleAlert } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { Icon } from '@/components/ui/icon'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function AccessKeysScreen() {
    const { publicKey: publicParam, privateKey: privateParam } = useLocalSearchParams<{ publicKey?: string; privateKey?: string }>()
    const router = useRouter()

    const [privateKey, setPrivateKey] = React.useState('')
    const [publicKey, setPublicKey] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Auto-load if query param contains key
    useEffect(() => {
        if (publicParam) {
            const key = publicParam as string
            setPublicKey(key)
            handleSubmit({ type: 'public', key })
        }

        if (privateParam) {
            const key = privateParam as string
            setPrivateKey(key)
            handleSubmit({ type: 'private', key })
        }
    }, [publicParam, privateParam])

    async function handleSubmit({ type, key }: { type?: 'private' | 'public'; key?: string }) {
        setLoading(true)
        setError(null)

        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            }

            if (privateKey) headers['privateKey'] = privateKey
            else if (publicKey) headers['publicKey'] = publicKey

            if (type === 'private') headers['privateKey'] = key ?? ''
            else if (type === 'public') headers['publicKey'] = key ?? ''

            if (!headers?.privateKey && !headers?.publicKey) {
                throw new Error('Please enter a key.')
            }

            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/reservation`, {
                method: 'GET',
                headers,
            })

            if (!res.ok) {
                if (res.status === 404 || res.status === 400) throw new Error('Reservation not found. The Key may be incorrect or the reservation may have been deleted.')
                const errorText = await res.json()
                if ('error' in errorText) throw new Error(errorText.error)
                throw new Error(`Something went wrong: ${res.statusText}`)
            }

            const data = await res.json()

            if (!data.reservationDetails) {
                throw new Error('No reservation details found.')
            }

            setPrivateKey('')
            setPublicKey('')

            // Navigate to reservation screen with data
            router.push({
                pathname: '/reservation',
                params: {
                    reservation: JSON.stringify(data.reservationDetails),
                    privateKey: data.privateKey,
                    publicKey: data.publicKey,
                },
            })
        } catch (err: unknown) {
            let message = 'Failed to load reservation.'
            if (err instanceof Error) message = err.message

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: message,
            })
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView className="flex-1 bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Access Keys</CardTitle>
                        <CardDescription>Enter your access keys to view or edit your reservations.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <View className="gap-6">
                            {/* Private Key */}
                            <View className="gap-2">
                                <View className="flex-row items-center gap-2">
                                    <Icon className={'text-foreground'} size="17" as={Shield} />
                                    <Label>Private Key</Label>
                                </View>
                                <Input placeholder="xxxxxxxx-xxxxxxxxxxxx-xxxxxxx..." value={privateKey} onChangeText={setPrivateKey} />
                                <Alert variant="destructive" icon={TriangleAlert}>
                                    <AlertTitle>Never share your private key</AlertTitle>
                                    <AlertDescription>Used to securely access and manage reservations.</AlertDescription>
                                </Alert>
                            </View>

                            {/* Public Key */}
                            <View className="gap-2">
                                <View className="flex-row items-center gap-2">
                                    <Icon className={'text-foreground'} size="17" as={Globe} />
                                    <Label>Public Key</Label>
                                </View>
                                <Input placeholder="xxxxxxxx-xxxxxxxxxxxx-xxxxxxx..." value={publicKey} onChangeText={setPublicKey} />
                                <View className="rounded-md border border-border p-3">
                                    <View className="flex-row gap-2 items-center mb-1">
                                        <Icon className={'text-foreground'} size="17" as={Link} />
                                        <Text className="text-sm font-medium">Share your public key</Text>
                                    </View>
                                    <Text className="text-xs text-muted-foreground">View-only access for others.</Text>
                                </View>
                            </View>

                            {error && <Text className="text-destructive text-sm">{error}</Text>}
                        </View>
                    </CardContent>

                    <CardFooter>
                        <Button className="w-full" onPress={() => handleSubmit({})} disabled={loading}>
                            {!loading ? <Icon className={'text-primary-foreground'} size="17" as={DownloadCloud} /> : <Icon className={'text-primary-foreground'} size="17" as={Loader2Icon} />}
                            <Text>{loading ? 'Loading...' : 'Load Reservation'}</Text>
                        </Button>
                    </CardFooter>
                </Card>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}
