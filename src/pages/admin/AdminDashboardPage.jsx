import { useEffect, useState } from "react";
import { CalendarDays, Stethoscope, UserCog, Users } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { getAllDoctors, getAllReceptionists } from "../../services/userService";
import { getAllPatients } from "../../services/patientService";
import { getAllAppointments } from "../../services/appointmentService";
import { formatDate } from "../../utils/formatters";

function AdminDashboardPage() {
  const [doctors, setDoctors] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [doctorsData, receptionistsData, patientsData, appointmentsData] =
        await Promise.all([
          getAllDoctors(),
          getAllReceptionists(),
          getAllPatients(),
          getAllAppointments(),
        ]);
      setDoctors(doctorsData);
      setReceptionists(receptionistsData);
      setPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );

  const patientsById = Object.fromEntries(
    patients.map((entry) => [entry.id, entry]),
  );
  const doctorsById = Object.fromEntries(
    doctors.map((entry) => [entry.id, entry]),
  );

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const columns = [
    {
      key: "patient",
      label: "Patient Name",
      render: (row) => patientsById[row.patient_id]?.name || "Unknown Patient",
    },
    {
      key: "doctor",
      label: "Doctor Name",
      render: (row) => doctorsById[row.doctor_id]?.name || "Unknown Doctor",
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
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of doctors, receptionists, patients, and recent appointment activity."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Doctors"
          value={doctors.length}
          icon={Stethoscope}
        />
        <StatCard
          title="Total Receptionists"
          value={receptionists.length}
          icon={UserCog}
        />
        <StatCard title="Total Patients" value={patients.length} icon={Users} />
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          icon={CalendarDays}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Appointments
        </h2>
        <DataTable
          loading={false}
          columns={columns}
          rows={recentAppointments}
          emptyTitle="No appointments found"
          emptyMessage="Recent appointments will appear here once records are added."
        />
      </section>
    </div>
  );
}

export default AdminDashboardPage;
