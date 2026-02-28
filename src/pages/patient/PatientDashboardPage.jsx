import { CalendarDays, ClipboardList } from 'lucide-react'
import DataTable from '../../components/ui/DataTable'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import useSimulatedLoading from '../../hooks/useSimulatedLoading'
import { CURRENT_SESSION, appointments, prescriptions, users } from '../../data/mockData'
import { formatDate } from '../../utils/formatters'

function PatientDashboardPage() {
  const loading = useSimulatedLoading(350)
  const patientId = CURRENT_SESSION.patientId

  const doctorMap = Object.fromEntries(
    users.filter((entry) => entry.role === 'doctor').map((entry) => [entry.id, entry.name]),
  )

  const myAppointments = appointments.filter((entry) => entry.patient_id === patientId)
  const myPrescriptions = prescriptions.filter((entry) => entry.patient_id === patientId)

  const activePrescriptions = myPrescriptions.length

  const columns = [
    {
      key: 'doctor',
      label: 'Doctor Name',
      render: (row) => doctorMap[row.doctor_id] || 'Unknown Doctor',
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
        title="Patient Dashboard"
        description="Track your appointments and active prescriptions."
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Appointments"
          value={myAppointments.length}
          icon={CalendarDays}
        />
        <StatCard
          title="Active Prescriptions"
          value={activePrescriptions}
          icon={ClipboardList}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Latest Appointments</h2>
        <DataTable
          loading={loading}
          columns={columns}
          rows={myAppointments.slice(0, 5)}
          emptyTitle="No appointments yet"
          emptyMessage="Your appointment records will appear here."
        />
      </section>
    </div>
  )
}

export default PatientDashboardPage
