import api from './api'

export const getDiagnosisByPatient = async (patientId) => {
    try {
        const response = await api.get(`/diagnosis/patient/${patientId}`)
        return response.data.data
    } catch (error) {
        console.error('Error fetching patient diagnosis:', error)
        throw error
    }
}

export const getDiagnosisByDoctor = async (doctorId) => {
    try {
        const response = await api.get(`/diagnosis/doctor/${doctorId}`)
        return response.data.data
    } catch (error) {
        console.error('Error fetching doctor diagnosis:', error)
        throw error
    }
}

export const createDiagnosis = async (diagnosisData) => {
    try {
        const response = await api.post('/diagnosis', diagnosisData)
        return response.data.data
    } catch (error) {
        console.error('Error creating diagnosis:', error)
        throw error
    }
}
