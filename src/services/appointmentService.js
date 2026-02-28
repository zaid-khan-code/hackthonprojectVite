import api from './api'

export const getAllAppointments = async () => {
    try {
        const response = await api.get('/appointments')
        return response.data.data
    } catch (error) {
        console.error('Error fetching appointments:', error)
        throw error
    }
}

export const getAppointmentsByDoctor = async (doctorId) => {
    try {
        const response = await api.get(`/appointments/doctor/${doctorId}`)
        return response.data.data
    } catch (error) {
        console.error('Error fetching doctor appointments:', error)
        throw error
    }
}

export const getAppointmentsByPatient = async (patientId) => {
    try {
        const response = await api.get(`/appointments/patient/${patientId}`)
        return response.data.data
    } catch (error) {
        console.error('Error fetching patient appointments:', error)
        throw error
    }
}

export const createAppointment = async (appointmentData) => {
    try {
        const response = await api.post('/appointments', appointmentData)
        return response.data.data
    } catch (error) {
        console.error('Error creating appointment:', error)
        throw error
    }
}

export const updateAppointmentStatus = async (id, status) => {
    try {
        const response = await api.put(`/appointments/${id}/status`, { status })
        return response.data.data
    } catch (error) {
        console.error('Error updating appointment status:', error)
        throw error
    }
}

export const cancelAppointment = async (id) => {
    try {
        const response = await api.delete(`/appointments/${id}`)
        return response.data.data
    } catch (error) {
        console.error('Error cancelling appointment:', error)
        throw error
    }
}
