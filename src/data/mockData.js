const toISODate = (date) => date.toISOString().slice(0, 10)

const shiftDate = (days) => {
  const next = new Date()
  next.setDate(next.getDate() + days)
  return toISODate(next)
}

const currentTimestamp = new Date().toISOString()

export const users = [
  {
    id: 1,
    name: 'Ayesha Malik',
    email: 'admin@carebridge.com',
    password: 'admin123',
    role: 'admin',
    specialty: null,
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 2,
    name: 'Dr. Sarah Khan',
    email: 'sarah.khan@carebridge.com',
    password: 'doctor123',
    role: 'doctor',
    specialty: 'Cardiology',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 3,
    name: 'Dr. Omar Farooq',
    email: 'omar.farooq@carebridge.com',
    password: 'doctor123',
    role: 'doctor',
    specialty: 'Dermatology',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 4,
    name: 'Hina Akhtar',
    email: 'reception@carebridge.com',
    password: 'reception123',
    role: 'receptionist',
    specialty: null,
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 5,
    name: 'John Carter',
    email: 'john.carter@email.com',
    password: 'patient123',
    role: 'patient',
    specialty: null,
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 6,
    name: 'Maria Chen',
    email: 'maria.chen@email.com',
    password: 'patient123',
    role: 'patient',
    specialty: null,
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
]

export const patients = [
  {
    id: 1,
    user_id: 5,
    name: 'John Carter',
    age: 34,
    gender: 'Male',
    contact: '+1 415 555 0199',
    blood_group: 'O+',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 2,
    user_id: 6,
    name: 'Maria Chen',
    age: 27,
    gender: 'Female',
    contact: '+1 415 555 0103',
    blood_group: 'A-',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
]

export const appointments = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 2,
    date: shiftDate(0),
    time: '09:30',
    status: 'pending',
    notes: 'New patient consultation',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 2,
    patient_id: 2,
    doctor_id: 2,
    date: shiftDate(0),
    time: '11:00',
    status: 'confirmed',
    notes: 'Cardio follow-up',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 3,
    patient_id: 1,
    doctor_id: 3,
    date: shiftDate(-2),
    time: '14:15',
    status: 'completed',
    notes: 'Skin allergy review',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 4,
    patient_id: 2,
    doctor_id: 3,
    date: shiftDate(1),
    time: '10:45',
    status: 'pending',
    notes: 'Routine skin check',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 5,
    patient_id: 1,
    doctor_id: 2,
    date: shiftDate(-1),
    time: '16:00',
    status: 'cancelled',
    notes: 'Rescheduled by patient',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
]

export const prescriptions = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 2,
    medicines: 'Atorvastatin',
    dosage: '10mg once daily',
    notes: 'Take after dinner',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 2,
    patient_id: 1,
    doctor_id: 2,
    medicines: 'Aspirin',
    dosage: '75mg once daily',
    notes: 'Take with water',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 3,
    patient_id: 2,
    doctor_id: 3,
    medicines: 'Cetirizine',
    dosage: '5mg at night',
    notes: 'Use for one week',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
]

export const diagnosisLogs = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 2,
    symptoms: 'Chest discomfort, elevated BP',
    diagnosis: 'Hypertension',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 2,
    patient_id: 1,
    doctor_id: 2,
    symptoms: 'Headache and fatigue',
    diagnosis: 'Hypertension',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
  {
    id: 3,
    patient_id: 2,
    doctor_id: 3,
    symptoms: 'Itching and redness',
    diagnosis: 'Eczema',
    created_at: currentTimestamp,
    updated_at: currentTimestamp,
  },
]

export const CURRENT_SESSION = {
  adminId: 1,
  doctorId: 2,
  receptionistId: 4,
  patientId: 1,
  patientUserId: 5,
}
