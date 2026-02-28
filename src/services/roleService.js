import api from './api'

export const getAllRoles = async () => {
    try {
        const response = await api.get('/roles')
        return response.data.data
    } catch (error) {
        console.error('Error fetching roles:', error)
        throw error
    }
}
