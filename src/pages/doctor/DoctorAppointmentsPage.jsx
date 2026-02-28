import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { getLoggedInUser } from "../../services/authService";
import { getAppointmentsByDoctor } from "../../services/appointmentService";
import { getAllPatients } from "../../services/patientService";
import { formatDate } from "../../utils/formatters";

function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  const doctorId = getLoggedInUser()?.id;
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [appointmentsData, patientsData] = await Promise.all([
          getAppointmentsByDoctor(doctorId),
          getAllPatients(),
        ]);
        setDoctorAppointments(appointmentsData);
        setPatients(patientsData);
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
  }, [doctorId]);

  const patientMap = useMemo(
    () => Object.fromEntries(patients.map((entry) => [entry.id, entry])),
    [patients],
  );

  if (loading) return <LoadingSpinner />;
  if (error)
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
        <button
          type="button"
          onClick={() => navigate(`/patient/${row.patient_id}`)}
          className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
        >
          View Patient
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Appointments"
        description="Review booked appointments and open patient profile details."
      />

      <DataTable
        loading={false}
        columns={columns}
        rows={doctorAppointments}
        emptyTitle="No appointments assigned"
        emptyMessage="Appointments linked to this doctor will be displayed here."
      />
    </div>
  );
}

export default DoctorAppointmentsPage;
