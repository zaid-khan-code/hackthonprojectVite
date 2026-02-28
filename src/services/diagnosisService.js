import API from './api'

export const getDiagnosisByPatient = async (patient_id) => {
    const response = await API.get(`/diagnosis/patient/${patient_id}`)
    return response.data
}

export const getDiagnosisByDoctor = async (doctorId) => {
    const response = await API.get(`/diagnosis/doctor/${doctorId}`)
    return response.data
}

export const createDiagnosis = async (data) => {
    const response = await API.post('/diagnosis', data)
    return response.data
}
