import { Eye, Plus } from "lucide-react";
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

function PatientsPage() {
  const [patientRows, setPatientRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const modalTitle = useMemo(
    () => (editingPatientId ? "Edit Patient" : "Add Patient"),
    [editingPatientId],
  );

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPatients();
      setPatientRows(data);
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

  const resetForm = () => {
    setFormData(initialForm);
    setEditingPatientId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsFormModalOpen(true);
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
    setIsFormModalOpen(true);
  };

  const openViewModal = (patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    console.log(formData);
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;
    try {
      setDeletingId(patientId);
      await deletePatient(patientId);
      await fetchPatients();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete patient. Please try again.",
      );
    } finally {
      setDeletingId(null);
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
      setIsFormModalOpen(false);
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
  if (error && !patientRows.length)
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
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            disabled={deletingId === row.id}
            className={`rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition ${deletingId === row.id ? "opacity-50 cursor-not-allowed" : "hover:bg-rose-50"}`}
          >
            {deletingId === row.id ? (
              <span className="flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-rose-700"></div>
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      ),
    },
  ];

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
        loading={false}
        columns={columns}
        rows={patientRows}
        emptyTitle="No patients found"
        emptyMessage="Add patient records to start booking appointments."
      />

      {error && patientRows.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Modal
        open={isFormModalOpen}
        title={modalTitle}
        onClose={() => setIsFormModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset disabled={submitting} className="space-y-4">
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
              disabled={submitting}
              className={`inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editingPatientId ? "Updating..." : "Adding..."}
                </span>
              ) : editingPatientId ? (
                "Update Patient"
              ) : (
                "Create Patient"
              )}
            </button>
          </fieldset>
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
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Name
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                {selectedPatient.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Age
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                {selectedPatient.age}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Gender
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                {selectedPatient.gender}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Contact
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                {selectedPatient.contact}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Blood Group
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                {selectedPatient.blood_group}
              </dd>
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
  );
}

export default PatientsPage;
