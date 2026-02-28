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
}

function ManageReceptionistsPage() {
  const loading = useSimulatedLoading(350)
  const [receptionists, setReceptionists] = useState(() =>
    users.filter((entry) => entry.role === 'receptionist'),
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReceptionistId, setEditingReceptionistId] = useState(null)
  const [formData, setFormData] = useState(initialForm)

  const modalTitle = useMemo(
    () => (editingReceptionistId ? 'Edit Receptionist' : 'Add Receptionist'),
    [editingReceptionistId],
  )

  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const resetForm = () => {
    setFormData(initialForm)
    setEditingReceptionistId(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (receptionist) => {
    setEditingReceptionistId(receptionist.id)
    setFormData({
      name: receptionist.name,
      email: receptionist.email,
      password: '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (receptionistId) => {
    setReceptionists((previous) =>
      previous.filter((receptionist) => receptionist.id !== receptionistId),
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const timestamp = new Date().toISOString()

    if (editingReceptionistId) {
      setReceptionists((previous) =>
        previous.map((receptionist) =>
          receptionist.id === editingReceptionistId
            ? {
                ...receptionist,
                name: formData.name,
                email: formData.email,
                password: formData.password || receptionist.password,
                updated_at: timestamp,
              }
            : receptionist,
        ),
      )
    } else {
      const nextId = receptionists.length
        ? Math.max(...receptionists.map((receptionist) => receptionist.id)) + 1
        : 1
      setReceptionists((previous) => [
        ...previous,
        {
          id: nextId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'receptionist',
          specialty: null,
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
        title="Manage Receptionists"
        description="Create and maintain receptionist user accounts."
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Receptionist
          </button>
        }
      />

      <DataTable
        loading={loading}
        columns={columns}
        rows={receptionists}
        emptyTitle="No receptionists found"
        emptyMessage="Add your first receptionist to manage patients and bookings."
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
              required={!editingReceptionistId}
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {editingReceptionistId ? 'Update Receptionist' : 'Create Receptionist'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ManageReceptionistsPage
