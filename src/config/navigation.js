import {
  Activity,
  CalendarDays,
  ClipboardList,
  Home,
  Stethoscope,
  UserRound,
  Users,
} from 'lucide-react'

export const adminNavItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: Home,
    exact: true,
  },
  {
    label: 'Manage Doctors',
    to: '/admin/doctors',
    icon: Stethoscope,
    matchPrefixes: ['/admin/doctors'],
  },
  {
    label: 'Manage Receptionists',
    to: '/admin/receptionists',
    icon: Users,
    matchPrefixes: ['/admin/receptionists'],
  },
  {
    label: 'Patients',
    to: '/admin/patients',
    icon: UserRound,
    matchPrefixes: ['/admin/patients'],
  },
]

export const receptionistNavItems = [
  {
    label: 'Dashboard',
    to: '/receptionist',
    icon: Home,
    exact: true,
  },
  {
    label: 'Patients',
    to: '/receptionist/patients',
    icon: Users,
    matchPrefixes: ['/receptionist/patients'],
  },
  {
    label: 'Appointments',
    to: '/receptionist/appointments',
    icon: CalendarDays,
    matchPrefixes: ['/receptionist/appointments'],
  },
]

export const doctorNavItems = [
  {
    label: 'Dashboard',
    to: '/doctor',
    icon: Home,
    exact: true,
  },
  {
    label: 'Appointments',
    to: '/doctor/appointments',
    icon: CalendarDays,
    matchPrefixes: ['/doctor/appointments', '/patient/'],
  },
  {
    label: 'Analytics',
    to: '/doctor/analytics',
    icon: Activity,
    matchPrefixes: ['/doctor/analytics'],
  },
]

export const patientNavItems = [
  {
    label: 'Dashboard',
    to: '/patient/dashboard',
    icon: Home,
    exact: true,
  },
  {
    label: 'My Appointments',
    to: '/patient/appointments',
    icon: CalendarDays,
    matchPrefixes: ['/patient/appointments'],
  },
  {
    label: 'My Prescriptions',
    to: '/patient/prescriptions',
    icon: ClipboardList,
    matchPrefixes: ['/patient/prescriptions'],
  },
]
