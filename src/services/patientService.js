import api from './api'

export const getAllPatients = async () => {
    try {
        const response = await api.get('/patients')
        return response.data.data
    } catch (error) {
        console.error('Error fetching patients:', error)
        throw error
    }
}

export const getPatientById = async (id) => {
    try {
        const response = await api.get(`/patients/${id}`)
        return response.data.data
    } catch (error) {
        console.error('Error fetching patient:', error)
        throw error
    }
}

export const createPatient = async (patientData) => {
    try {
        const response = await api.post('/patients', patientData)
        console.log(response);
        
        return response.data.data
    } catch (error) {
        console.error('Error creating patient:', error)
        throw error
    }
}

export const updatePatient = async (id, patientData) => {
    try {
        const response = await api.put(`/patients/${id}`, patientData)
        return response.data.data
    } catch (error) {
        console.error('Error updating patient:', error)
        throw error
    }
}

export const deletePatient = async (id) => {
    try {
        const response = await api.delete(`/patients/${id}`)
        return response.data.data
    } catch (error) {
        console.error('Error deleting patient:', error)
        throw error
    }
}
