import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import {
  getAllReceptionists,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/userService";
import { formatDateTime } from "../../utils/formatters";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

function ManageReceptionistsPage() {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReceptionistId, setEditingReceptionistId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const modalTitle = useMemo(
    () => (editingReceptionistId ? "Edit Receptionist" : "Add Receptionist"),
    [editingReceptionistId],
  );

  const fetchReceptionists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllReceptionists();
      setReceptionists(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load receptionists. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceptionists();
  }, []);

  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingReceptionistId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (receptionist) => {
    setEditingReceptionistId(receptionist.id);
    setFormData({
      name: receptionist.name,
      email: receptionist.email,
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (receptionistId) => {
    if (!window.confirm("Are you sure you want to delete this receptionist?"))
      return;
    try {
      setDeletingId(receptionistId);
      await deleteUser(receptionistId);
      await fetchReceptionists();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete receptionist. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      if (editingReceptionistId) {
        const updateData = {
          name: formData.name,
          email: formData.email,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await updateUser(editingReceptionistId, updateData);
      } else {
        await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role_id: 3,
        });
      }
      setIsModalOpen(false);
      resetForm();
      await fetchReceptionists();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save receptionist. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !receptionists.length)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
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
        loading={false}
        columns={columns}
        rows={receptionists}
        emptyTitle="No receptionists found"
        emptyMessage="Add your first receptionist to manage patients and bookings."
      />

      {error && receptionists.length > 0 && (
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
                required={!editingReceptionistId}
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
                value="Receptionist"
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
                    {editingReceptionistId ? "Updating..." : "Adding..."}
                  </span>
                ) : editingReceptionistId ? (
                  "Update Receptionist"
                ) : (
                  "Create Receptionist"
                )}
              </button>
            </div>
          </fieldset>
        </form>
      </Modal>
    </div>
  );
}

export default ManageReceptionistsPage;
