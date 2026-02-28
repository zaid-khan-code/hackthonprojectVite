import api from './api'

export const getAllDoctors = async () => {
    try {
        const response = await api.get('/users/doctors')
        return response.data.data
    } catch (error) {
        console.error('Error fetching doctors:', error)
        throw error
    }
}

export const getDoctorById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`)
        return response.data.data
    } catch (error) {
        console.error('Error fetching doctor:', error)
        throw error
    }
}

export const getAllReceptionists = async () => {
    try {
        const response = await api.get('/users/receptionists')
        return response.data.data
    } catch (error) {
        console.error('Error fetching receptionists:', error)
        throw error
    }
}

export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData)
        return response.data.data
    } catch (error) {
        console.error('Error creating user:', error)
        throw error
    }
}

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData)
        return response.data.data
    } catch (error) {
        console.error('Error updating user:', error)
        throw error
    }
}

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`)
        return response.data.data
    } catch (error) {
        console.error('Error deleting user:', error)
        throw error
    }
}
