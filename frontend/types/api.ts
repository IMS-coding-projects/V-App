export interface Room {
    id: string
    roomNumber: string
    roomFeatures: string[]
}

export interface ReservationDetails {
    id: string
    date: string
    startTime: string
    endTime: string
    room: Room
    description: string
    participants: string
}

export interface Reservation {
    id: string
    date: string
    startTime: string
    endTime: string
    room: Room
    description: string
    participants: string
}

export interface ReservationDTO {
    date: string
    startTime: string
    endTime: string
    roomId: string
    description: string
    participants: string
}

export interface ReservationResponse {
    reservation: any
    privateKey: string
    publicKey: string
}

export interface ReservationDetailsAdvanced {
    id: string
    publicKey: string
    privateKey: string
    date: string
    startTime: string
    endTime: string
    room: Room
    description: string
    participants: string
}
