import DataTable from '../../components/ui/DataTable'
import PageHeader from '../../components/ui/PageHeader'
import useSimulatedLoading from '../../hooks/useSimulatedLoading'
import { CURRENT_SESSION, prescriptions, users } from '../../data/mockData'
import { formatDateTime } from '../../utils/formatters'

function MyPrescriptionsPage() {
  const loading = useSimulatedLoading(300)
  const patientId = CURRENT_SESSION.patientId

  const doctorMap = Object.fromEntries(
    users.filter((entry) => entry.role === 'doctor').map((entry) => [entry.id, entry.name]),
  )

  const myPrescriptions = prescriptions.filter((entry) => entry.patient_id === patientId)

  const columns = [
    {
      key: 'doctor',
      label: 'Doctor Name',
      render: (row) => doctorMap[row.doctor_id] || 'Unknown Doctor',
    },
    { key: 'medicines', label: 'Medicines' },
    { key: 'dosage', label: 'Dosage' },
    { key: 'notes', label: 'Notes' },
    {
      key: 'date',
      label: 'Date',
      render: (row) => formatDateTime(row.created_at),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Prescriptions"
        description="Medicines and dosage history from your doctors."
      />

      <DataTable
        loading={loading}
        columns={columns}
        rows={myPrescriptions}
        emptyTitle="No prescriptions found"
        emptyMessage="Prescriptions will be listed here once issued."
      />
    </div>
  )
}

export default MyPrescriptionsPage
