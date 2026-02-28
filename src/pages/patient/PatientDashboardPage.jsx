import { useEffect, useState } from "react";
import { CalendarDays, ClipboardList } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { getLoggedInUser } from "../../services/authService";
import { getAppointmentsByPatient } from "../../services/appointmentService";
import { getPrescriptionsByPatient } from "../../services/prescriptionService";
import { getAllDoctors } from "../../services/userService";
import { formatDate } from "../../utils/formatters";

function PatientDashboardPage() {
  const patientId = getLoggedInUser()?.patient_id;
  const [myAppointments, setMyAppointments] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [doctorMap, setDoctorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [appointmentsData, prescriptionsData, doctorsData] =
          await Promise.all([
            getAppointmentsByPatient(patientId),
            getPrescriptionsByPatient(patientId),
            getAllDoctors(),
          ]);
        setMyAppointments(appointmentsData);
        setMyPrescriptions(prescriptionsData);
        setDoctorMap(
          Object.fromEntries(
            doctorsData.map((entry) => [entry.id, entry.name]),
          ),
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );

  const columns = [
    {
      key: "doctor",
      label: "Doctor Name",
      render: (row) => doctorMap[row.doctor_id] || "Unknown Doctor",
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
        title="Patient Dashboard"
        description="Track your appointments and active prescriptions."
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Appointments"
          value={myAppointments.length}
          icon={CalendarDays}
        />
        <StatCard
          title="Active Prescriptions"
          value={myPrescriptions.length}
          icon={ClipboardList}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Latest Appointments
        </h2>
        <DataTable
          loading={false}
          columns={columns}
          rows={myAppointments.slice(0, 5)}
          emptyTitle="No appointments yet"
          emptyMessage="Your appointment records will appear here."
        />
      </section>
    </div>
  );
}

export default PatientDashboardPage;
