import { CalendarDays, Stethoscope, UserCog, Users } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import useSimulatedLoading from '../../hooks/useSimulatedLoading'
import { appointments, patients, users } from '../../data/mockData'
import { formatDate } from '../../utils/formatters'

const adminUsers = users.filter((entry) => entry.role === 'doctor' || entry.role === 'receptionist')
const patientsById = Object.fromEntries(patients.map((entry) => [entry.id, entry]))
const usersById = Object.fromEntries(adminUsers.map((entry) => [entry.id, entry]))

function AdminDashboardPage() {
  const loading = useSimulatedLoading(400)

  const totalDoctors = users.filter((entry) => entry.role === 'doctor').length
  const totalReceptionists = users.filter((entry) => entry.role === 'receptionist').length
  const totalPatients = patients.length
  const totalAppointments = appointments.length

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  const columns = [
    {
      key: 'patient',
      label: 'Patient Name',
      render: (row) => patientsById[row.patient_id]?.name || 'Unknown Patient',
    },
    {
      key: 'doctor',
      label: 'Doctor Name',
      render: (row) => usersById[row.doctor_id]?.name || 'Unknown Doctor',
    },
    {
      key: 'date',
      label: 'Date',
      render: (row) => formatDate(row.date),
    },
    { key: 'time', label: 'Time' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of doctors, receptionists, patients, and recent appointment activity."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Doctors" value={totalDoctors} icon={Stethoscope} />
        <StatCard title="Total Receptionists" value={totalReceptionists} icon={UserCog} />
        <StatCard title="Total Patients" value={totalPatients} icon={Users} />
        <StatCard title="Total Appointments" value={totalAppointments} icon={CalendarDays} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Recent Appointments</h2>
        <DataTable
          loading={loading}
          columns={columns}
          rows={recentAppointments}
          emptyTitle="No appointments found"
          emptyMessage="Recent appointments will appear here once records are added."
        />
      </section>
    </div>
  )
}

export default AdminDashboardPage
