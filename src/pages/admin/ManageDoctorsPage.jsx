import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import {
  getAllDoctors,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService";
import { formatDateTime } from "../../utils/formatters";

const initialForm = {
  name: "",
  email: "",
  password: "",
  specialty: "",
};

function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const modalTitle = useMemo(
    () => (editingDoctorId ? "Edit Doctor" : "Add Doctor"),
    [editingDoctorId],
  );

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load doctors. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingDoctorId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (doctor) => {
    setEditingDoctorId(doctor.id);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      password: "",
      specialty: doctor.specialty || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      setDeletingId(doctorId);
      await deleteUser(doctorId);
      await fetchDoctors();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete doctor. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      if (editingDoctorId) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          specialty: formData.specialty,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await updateUser(editingDoctorId, updateData);
      } else {
        await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          specialty: formData.specialty,
          role_id: 2,
        });
      }
      setIsModalOpen(false);
      resetForm();
      await fetchDoctors();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save doctor. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !doctors.length)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "specialty", label: "Specialty" },
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
        loading={false}
        columns={columns}
        rows={doctors}
        emptyTitle="No doctors found"
        emptyMessage="Add your first doctor to start managing appointments."
      />

      {error && doctors.length > 0 && (
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

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
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

            <div>
              <label
                htmlFor="role_id"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                role
              </label>
              <input
                id="role_id"
                type="text"
                value="Doctor"
                disabled
                className="w-full rounded-xl border border-blue-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex w-full justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {editingDoctorId ? "Updating..." : "Adding..."}
                  </span>
                ) : editingDoctorId ? (
                  "Update Doctor"
                ) : (
                  "Create Doctor"
                )}
              </button>
            </div>
          </fieldset>
        </form>
      </Modal>
    </div>
  );
}

export default ManageDoctorsPage;
