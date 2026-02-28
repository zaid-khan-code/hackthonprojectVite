import { Eye, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import DataTable from '../../components/ui/DataTable'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import useSimulatedLoading from '../../hooks/useSimulatedLoading'
import { patients } from '../../data/mockData'
import { formatDateTime } from '../../utils/formatters'

const initialForm = {
  name: '',
  age: '',
  gender: 'Male',
  contact: '',
  blood_group: '',
}

function PatientsPage() {
  const loading = useSimulatedLoading(350)
  const [patientRows, setPatientRows] = useState(patients)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingPatientId, setEditingPatientId] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [formData, setFormData] = useState(initialForm)

  const modalTitle = useMemo(
    () => (editingPatientId ? 'Edit Patient' : 'Add Patient'),
    [editingPatientId],
  )

  const resetForm = () => {
    setFormData(initialForm)
    setEditingPatientId(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsFormModalOpen(true)
  }

  const openEditModal = (patient) => {
    setEditingPatientId(patient.id)
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      contact: patient.contact,
      blood_group: patient.blood_group,
    })
    setIsFormModalOpen(true)
  }

  const openViewModal = (patient) => {
    setSelectedPatient(patient)
    setIsViewModalOpen(true)
  }

  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const timestamp = new Date().toISOString()

    if (editingPatientId) {
      setPatientRows((previous) =>
        previous.map((patient) =>
          patient.id === editingPatientId
            ? {
                ...patient,
                name: formData.name,
                age: Number(formData.age),
                gender: formData.gender,
                contact: formData.contact,
                blood_group: formData.blood_group,
                updated_at: timestamp,
              }
            : patient,
        ),
      )
    } else {
      const nextId = patientRows.length
        ? Math.max(...patientRows.map((patient) => patient.id)) + 1
        : 1

      setPatientRows((previous) => [
        ...previous,
        {
          id: nextId,
          user_id: null,
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
          contact: formData.contact,
          blood_group: formData.blood_group,
          created_at: timestamp,
          updated_at: timestamp,
        },
      ])
    }

    setIsFormModalOpen(false)
    resetForm()
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'contact', label: 'Contact' },
    {
      key: 'blood_group',
      label: 'Blood Group',
      render: (row) => (
        <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
          {row.blood_group}
        </span>
      ),
    },
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
            onClick={() => openViewModal(row)}
            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => openEditModal(row)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Register new patients and edit demographic details."
        action={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </button>
        }
      />

      <DataTable
        loading={loading}
        columns={columns}
        rows={patientRows}
        emptyTitle="No patients found"
        emptyMessage="Add patient records to start booking appointments."
      />

      <Modal
        open={isFormModalOpen}
        title={modalTitle}
        onClose={() => setIsFormModalOpen(false)}
      >
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="age" className="mb-1.5 block text-sm font-semibold text-slate-700">
                age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="age"
                required
                className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="contact"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              contact
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              value={formData.contact}
              onChange={handleInputChange}
              placeholder="contact"
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="blood_group"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              blood_group
            </label>
            <input
              id="blood_group"
              name="blood_group"
              type="text"
              value={formData.blood_group}
              onChange={handleInputChange}
              placeholder="blood_group"
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {editingPatientId ? 'Update Patient' : 'Create Patient'}
          </button>
        </form>
      </Modal>

      <Modal
        open={isViewModalOpen}
        title="Patient Overview"
        onClose={() => setIsViewModalOpen(false)}
      >
        {selectedPatient ? (
          <dl className="grid gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">Name</dt>
              <dd className="mt-1 text-sm text-slate-800">{selectedPatient.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">Age</dt>
              <dd className="mt-1 text-sm text-slate-800">{selectedPatient.age}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">Gender</dt>
              <dd className="mt-1 text-sm text-slate-800">{selectedPatient.gender}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Contact
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{selectedPatient.contact}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Blood Group
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{selectedPatient.blood_group}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Created At
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                {formatDateTime(selectedPatient.created_at)}
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </div>
  )
}

export default PatientsPage
