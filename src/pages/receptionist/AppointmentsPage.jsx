import { useMemo, useState } from 'react'
import DataTable from '../../components/ui/DataTable'
import PageHeader from '../../components/ui/PageHeader'
import StatusBadge from '../../components/ui/StatusBadge'
import useSimulatedLoading from '../../hooks/useSimulatedLoading'
import { appointments, patients, users } from '../../data/mockData'
import { formatDate } from '../../utils/formatters'

const initialForm = {
  patient_id: '',
  doctor_id: '',
  date: '',
  time: '',
  notes: '',
}

function AppointmentsPage() {
  const loading = useSimulatedLoading(350)
  const [appointmentRows, setAppointmentRows] = useState(appointments)
  const [formData, setFormData] = useState(initialForm)

  const doctorRows = useMemo(
    () => users.filter((entry) => entry.role === 'doctor'),
    [],
  )

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((entry) => [entry.id, entry])),
    [],
  )

  const doctorMap = useMemo(
    () => Object.fromEntries(doctorRows.map((entry) => [entry.id, entry])),
    [doctorRows],
  )

  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleBookingSubmit = (event) => {
    event.preventDefault()
    const timestamp = new Date().toISOString()
    const nextId = appointmentRows.length
      ? Math.max(...appointmentRows.map((entry) => entry.id)) + 1
      : 1

    setAppointmentRows((previous) => [
      ...previous,
      {
        id: nextId,
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        date: formData.date,
        time: formData.time,
        status: 'pending',
        notes: formData.notes,
        created_at: timestamp,
        updated_at: timestamp,
      },
    ])

    setFormData(initialForm)
  }

  const handleCancel = (appointmentId) => {
    setAppointmentRows((previous) =>
      previous.map((entry) =>
        entry.id === appointmentId
          ? { ...entry, status: 'cancelled', updated_at: new Date().toISOString() }
          : entry,
      ),
    )
  }

  const handleStatusChange = (appointmentId, status) => {
    setAppointmentRows((previous) =>
      previous.map((entry) =>
        entry.id === appointmentId
          ? { ...entry, status, updated_at: new Date().toISOString() }
          : entry,
      ),
    )
  }

  const columns = [
    {
      key: 'patient',
      label: 'Patient Name',
      render: (row) => patientMap[row.patient_id]?.name || 'Unknown Patient',
    },
    {
      key: 'doctor',
      label: 'Doctor Name',
      render: (row) => doctorMap[row.doctor_id]?.name || 'Unknown Doctor',
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleCancel(row.id)}
            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={row.status === 'completed' || row.status === 'cancelled'}
          >
            Cancel
          </button>
          <select
            value={row.status === 'cancelled' ? 'pending' : row.status}
            onChange={(event) => handleStatusChange(row.id, event.target.value)}
            disabled={row.status === 'cancelled'}
            className="rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-xs font-semibold text-blue-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="completed">completed</option>
          </select>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Book appointments and manage status updates."
      />

      <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Book Appointment</h2>
        <form onSubmit={handleBookingSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="patient_id"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Select Patient
            </label>
            <select
              id="patient_id"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select patient</option>
              {patients.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="doctor_id"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Select Doctor
            </label>
            <select
              id="doctor_id"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select doctor</option>
              {doctorRows.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-semibold text-slate-700">
              date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="time" className="mb-1.5 block text-sm font-semibold text-slate-700">
              time
            </label>
            <input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="mb-1.5 block text-sm font-semibold text-slate-700">
              notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="notes"
              rows={3}
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">All Appointments</h2>
        <DataTable
          loading={loading}
          columns={columns}
          rows={appointmentRows}
          emptyTitle="No appointments yet"
          emptyMessage="Booked appointments will appear in this table."
        />
      </section>
    </div>
  )
}

export default AppointmentsPage
