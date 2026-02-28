import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../../components/ui/DataTable'
import PageHeader from '../../components/ui/PageHeader'
import StatusBadge from '../../components/ui/StatusBadge'
import useSimulatedLoading from '../../hooks/useSimulatedLoading'
import { CURRENT_SESSION, appointments, patients } from '../../data/mockData'
import { formatDate } from '../../utils/formatters'

function DoctorAppointmentsPage() {
  const navigate = useNavigate()
  const loading = useSimulatedLoading(350)
  const doctorId = CURRENT_SESSION.doctorId

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((entry) => [entry.id, entry])),
    [],
  )

  const doctorAppointments = appointments.filter((entry) => entry.doctor_id === doctorId)

  const columns = [
    {
      key: 'patient',
      label: 'Patient Name',
      render: (row) => patientMap[row.patient_id]?.name || 'Unknown Patient',
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
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          type="button"
          onClick={() => navigate(`/patient/${row.patient_id}`)}
          className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          View Patient
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Appointments"
        description="Review booked appointments and open patient profile details."
      />

      <DataTable
        loading={loading}
        columns={columns}
        rows={doctorAppointments}
        emptyTitle="No appointments assigned"
        emptyMessage="Appointments linked to this doctor will be displayed here."
      />
    </div>
  )
}

export default DoctorAppointmentsPage
