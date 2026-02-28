import API from './api'

export const getPrescriptionsByPatient = async (patient_id) => {
    const response = await API.get(`/prescriptions/patient/${patient_id}`)
    return response.data
}

export const getPrescriptionsByDoctor = async (doctor_id) => {
    const response = await API.get(`/prescriptions/doctor/${doctor_id}`)
    return response.data
}

export const createPrescription = async (data) => {
    const response = await API.post('/prescriptions', data)
    return response.data
}
