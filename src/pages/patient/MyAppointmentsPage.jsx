import { useEffect, useState } from "react";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { getLoggedInUser } from "../../services/authService";
import { getAppointmentsByPatient } from "../../services/appointmentService";
import { getAllDoctors } from "../../services/userService";
import { formatDate } from "../../utils/formatters";

function MyAppointmentsPage() {
  const patientId = getLoggedInUser()?.patient_id;
  const [myAppointments, setMyAppointments] = useState([]);
  const [doctorMap, setDoctorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [appointmentsData, doctorsData] = await Promise.all([
          getAppointmentsByPatient(patientId),
          getAllDoctors(),
        ]);
        setMyAppointments(appointmentsData);
        setDoctorMap(
          Object.fromEntries(
            doctorsData.map((entry) => [entry.id, entry.name]),
          ),
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load appointments. Please try again.",
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
    { key: "notes", label: "Notes" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Appointments"
        description="Complete appointment history with status updates."
      />

      <DataTable
        loading={false}
        columns={columns}
        rows={myAppointments}
        emptyTitle="No appointment records"
        emptyMessage="Book an appointment to see records here."
      />
    </div>
  );
}

export default MyAppointmentsPage;
