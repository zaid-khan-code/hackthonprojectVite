import api from './api'

export const getPrescriptionsByPatient = async (patientId) => {
    try {
        const response = await api.get(`/prescriptions/patient/${patientId}`)
        return response.data.data
    } catch (error) {
        console.error('Error fetching patient prescriptions:', error)
        throw error
    }
}

export const getPrescriptionsByDoctor = async (doctorId) => {
    try {
        const response = await api.get(`/prescriptions/doctor/${doctorId}`)
        return response.data.data
    } catch (error) {
        console.error('Error fetching doctor prescriptions:', error)
        throw error
    }
}

export const createPrescription = async (prescriptionData) => {
    try {
        const response = await api.post('/prescriptions', prescriptionData)
        return response.data.data
    } catch (error) {
        console.error('Error creating prescription:', error)
        throw error
    }
}
