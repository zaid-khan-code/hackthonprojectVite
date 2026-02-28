import { useEffect, useState } from "react";
import DataTable from "../../components/ui/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import { getLoggedInUser } from "../../services/authService";
import { getPrescriptionsByPatient } from "../../services/prescriptionService";
import { getAllDoctors } from "../../services/userService";
import { formatDateTime } from "../../utils/formatters";

function MyPrescriptionsPage() {
  const patientId = getLoggedInUser()?.patient_id;
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [doctorMap, setDoctorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [prescriptionsData, doctorsData] = await Promise.all([
          getPrescriptionsByPatient(patientId),
          getAllDoctors(),
        ]);
        setMyPrescriptions(prescriptionsData);
        setDoctorMap(
          Object.fromEntries(
            doctorsData.map((entry) => [entry.id, entry.name]),
          ),
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load prescriptions. Please try again.",
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
    { key: "medicines", label: "Medicines" },
    { key: "dosage", label: "Dosage" },
    { key: "notes", label: "Notes" },
    {
      key: "date",
      label: "Date",
      render: (row) => formatDateTime(row.created_at),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Prescriptions"
        description="Medicines and dosage history from your doctors."
      />

      <DataTable
        loading={false}
        columns={columns}
        rows={myPrescriptions}
        emptyTitle="No prescriptions found"
        emptyMessage="Prescriptions will be listed here once issued."
      />
    </div>
  );
}

export default MyPrescriptionsPage;
