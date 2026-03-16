import { ReservationDTO } from '@/types/api'

export function validateReservation(formData: ReservationDTO, setFormErrors: (value: ((prevState: string[]) => string[]) | string[]) => void) {
    let newErrors: string[] = []

    // Required fields
    if (!formData.date) newErrors.push('Date is required')
    if (!formData.startTime) newErrors.push('Start time is required')
    if (!formData.endTime) newErrors.push('End time is required')
    if (!formData.roomId) newErrors.push('Room is required')

    // Time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (formData.startTime && !timeRegex.test(formData.startTime)) {
        newErrors.push('Invalid time format (HH:MM)')
    }
    if (formData.endTime && !timeRegex.test(formData.endTime)) {
        newErrors.push('Invalid time format (HH:MM)')
    }

    // Date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (formData.date && !dateRegex.test(formData.date)) {
        newErrors.push('Invalid date format (YYYY-MM-DD)')
    }

    // Not in the past
    if (formData.date) {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const [year, month, day] = formData.date.split('-').map(Number)
        const startDateTime = new Date(year, month - 1, day, 0, 0)
        if (startDateTime < now) {
            newErrors.push('Reservation cannot be in the past')
        }
    }

    // End time after start time
    if (formData.startTime && formData.endTime) {
        if (formData.startTime >= formData.endTime) {
            newErrors.push('End time must be after start time')
        }
    }

    setFormErrors(newErrors)
    return newErrors.length === 0
}
