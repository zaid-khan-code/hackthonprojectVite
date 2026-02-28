import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import {
  getAllPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../../services/patientService";
import { formatDateTime } from "../../utils/formatters";

const initialForm = {
  name: "",
  age: "",
  gender: "male",
  contact: "",
  blood_group: "",
};

function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const modalTitle = useMemo(
    () => (editingPatientId ? "Edit Patient" : "Add Patient"),
    [editingPatientId],
  );

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load patients. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingPatientId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (patient) => {
    setEditingPatientId(patient.id);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      contact: patient.contact,
      blood_group: patient.blood_group,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (patientId) => {
    try {
      await deletePatient(patientId);
      await fetchPatients();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete patient. Please try again.",
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      if (editingPatientId) {
        await updatePatient(editingPatientId, {
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
          contact: formData.contact,
          blood_group: formData.blood_group,
        });
      } else {
        await createPatient({
          name: formData.name,
          age: Number(formData.age),
          gender: formData.gender,
          contact: formData.contact,
          blood_group: formData.blood_group,
        });
      }
      setIsModalOpen(false);
      resetForm();
      await fetchPatients();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save patient. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !patients.length)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );

  const columns = [
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "contact", label: "Contact" },
    {
      key: "blood_group",
      label: "Blood Group",
      render: (row) => (
        <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
          {row.blood_group}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created At",
      render: (row) => formatDateTime(row.created_at),
    },
    {
      key: "actions",
      label: "Actions",
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
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Register new patients and manage existing records."
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
        loading={false}
        columns={columns}
        rows={patients}
        emptyTitle="No patients found"
        emptyMessage="Add patient records to start managing appointments."
      />

      {error && patients.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Modal
        open={isModalOpen}
        title={modalTitle}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
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
              <label
                htmlFor="age"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
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
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
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
              blood group
            </label>
            <select
              id="blood_group"
              name="blood_group"
              value={formData.blood_group}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-blue-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {editingPatientId ? "Update Patient" : "Create Patient"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminPatientsPage;
