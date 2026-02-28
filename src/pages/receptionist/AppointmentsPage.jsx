import { useEffect, useMemo, useState } from "react";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import {
  getAllAppointments,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
} from "../../services/appointmentService";
import { getAllDoctors } from "../../services/userService";
import { getAllPatients } from "../../services/patientService";
import { formatDate } from "../../utils/formatters";

const initialForm = {
  patient_id: "",
  doctor_id: "",
  date: "",
  time: "",
  notes: "",
};

function AppointmentsPage() {
  const [appointmentRows, setAppointmentRows] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appointmentsData, doctorsData, patientsData] = await Promise.all([
        getAllAppointments(),
        getAllDoctors(),
        getAllPatients(),
      ]);
      setAppointmentRows(appointmentsData);
      setDoctors(doctorsData);
      setPatients(patientsData);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((entry) => [entry.id, entry])),
    [patients],
  );

  const doctorMap = useMemo(
    () => Object.fromEntries(doctors.map((entry) => [entry.id, entry])),
    [doctors],
  );

  const handleInputChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      await createAppointment({
        patient_id: Number(formData.patient_id),
        doctor_id: Number(formData.doctor_id),
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      });
      setFormData(initialForm);
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      setCancellingId(appointmentId);
      await cancelAppointment(appointmentId);
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to cancel appointment. Please try again.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    try {
      setUpdatingStatusId(appointmentId);
      await updateAppointmentStatus(appointmentId, status);
      await fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update appointment status. Please try again.",
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !appointmentRows.length)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );

  const columns = [
    {
      key: "patient",
      label: "Patient Name",
      render: (row) => patientMap[row.patient_id]?.name || "Unknown Patient",
    },
    {
      key: "doctor",
      label: "Doctor Name",
      render: (row) => doctorMap[row.doctor_id]?.name || "Unknown Doctor",
    },
    {
      key: "date",
      label: "Date",
      render: (row) => formatDate(row.date),
    },
    { key: "time", label: "Time" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleCancel(row.id)}
            className={`rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition ${cancellingId === row.id ? "opacity-50 cursor-not-allowed" : "hover:bg-rose-50"} disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={
              row.status === "completed" ||
              row.status === "cancelled" ||
              cancellingId === row.id
            }
          >
            {cancellingId === row.id ? (
              <span className="flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-rose-700"></div>
                Cancelling...
              </span>
            ) : (
              "Cancel"
            )}
          </button>
          <select
            value={row.status === "cancelled" ? "pending" : row.status}
            onChange={(event) => handleStatusChange(row.id, event.target.value)}
            disabled={row.status === "cancelled" || updatingStatusId === row.id}
            className={`rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-xs font-semibold text-blue-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="completed">completed</option>
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Book appointments and manage status updates."
      />

      <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Book Appointment
        </h2>
        <form
          onSubmit={handleBookingSubmit}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <fieldset disabled={submitting} className="contents">
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
                {doctors.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
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
              <label
                htmlFor="time"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
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
              <label
                htmlFor="notes"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
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
                disabled={submitting}
                className={`inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition ${submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Booking...
                  </span>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </div>
          </fieldset>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          All Appointments
        </h2>
        <DataTable
          loading={false}
          columns={columns}
          rows={appointmentRows}
          emptyTitle="No appointments yet"
          emptyMessage="Booked appointments will appear in this table."
        />

        {error && appointmentRows.length > 0 && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}
      </section>
    </div>
  );
}

export default AppointmentsPage;
