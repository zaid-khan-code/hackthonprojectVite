import DataTable from '../../components/ui/DataTable'
import PageHeader from '../../components/ui/PageHeader'
import StatusBadge from '../../components/ui/StatusBadge'
import useSimulatedLoading from '../../hooks/useSimulatedLoading'
import { CURRENT_SESSION, appointments, users } from '../../data/mockData'
import { formatDate } from '../../utils/formatters'

function MyAppointmentsPage() {
  const loading = useSimulatedLoading(300)
  const patientId = CURRENT_SESSION.patientId

  const doctorMap = Object.fromEntries(
    users.filter((entry) => entry.role === 'doctor').map((entry) => [entry.id, entry.name]),
  )

  const myAppointments = appointments.filter((entry) => entry.patient_id === patientId)

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
    { key: 'notes', label: 'Notes' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Appointments"
        description="Complete appointment history with status updates."
      />

      <DataTable
        loading={loading}
        columns={columns}
        rows={myAppointments}
        emptyTitle="No appointment records"
        emptyMessage="Book an appointment to see records here."
      />
    </div>
  )
}

export default MyAppointmentsPage
