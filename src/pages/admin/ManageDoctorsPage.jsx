import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import useSimulatedLoading from '../../hooks/useSimulatedLoading'
import { users } from '../../data/mockData'
import { formatDateTime } from '../../utils/formatters'

const initialForm = {
  name: '',
  email: '',
  password: '',
  specialty: '',
}

function ManageDoctorsPage() {
  const loading = useSimulatedLoading(350)
  const [doctors, setDoctors] = useState(() =>
    users.filter((entry) => entry.role === 'doctor'),
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoctorId, setEditingDoctorId] = useState(null)
  const [formData, setFormData] = useState(initialForm)

  const modalTitle = useMemo(
    () => (editingDoctorId ? 'Edit Doctor' : 'Add Doctor'),
    [editingDoctorId],
  )

  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingDoctorId(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (doctor) => {
    setEditingDoctorId(doctor.id)
    setFormData({
      name: doctor.name,
      email: doctor.email,
      password: '',
      specialty: doctor.specialty || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (doctorId) => {
    setDoctors((previous) => previous.filter((doctor) => doctor.id !== doctorId))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const timestamp = new Date().toISOString()

    if (editingDoctorId) {
      setDoctors((previous) =>
        previous.map((doctor) =>
          doctor.id === editingDoctorId
            ? {
                ...doctor,
                name: formData.name,
                email: formData.email,
                password: formData.password || doctor.password,
                specialty: formData.specialty,
                updated_at: timestamp,
              }
            : doctor,
        ),
      )
    } else {
      const nextId = doctors.length
        ? Math.max(...doctors.map((doctor) => doctor.id)) + 1
        : 1

      setDoctors((previous) => [
        ...previous,
        {
          id: nextId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'doctor',
          specialty: formData.specialty,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ])
    }

    setIsModalOpen(false)
    resetForm()
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialty', label: 'Specialty' },
    {
      key: 'created_at',
      label: 'Created At',
      render: (row) => formatDateTime(row.created_at),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Doctors"
        description="Create, edit, and maintain doctor records."
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Doctor
          </button>
        }
      />

      <DataTable
        loading={loading}
        columns={columns}
        rows={doctors}
        emptyTitle="No doctors found"
        emptyMessage="Add your first doctor to start managing appointments."
      />

      <Modal open={isModalOpen} title={modalTitle} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
              name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="name"
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email"
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="password"
              required={!editingDoctorId}
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="specialty"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              specialty
            </label>
            <input
              id="specialty"
              name="specialty"
              type="text"
              value={formData.specialty}
              onChange={handleInputChange}
              placeholder="specialty"
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {editingDoctorId ? 'Update Doctor' : 'Create Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManageDoctorsPage
