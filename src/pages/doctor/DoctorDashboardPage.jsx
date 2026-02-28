import { useEffect, useState } from "react";
import { CalendarDays, ClipboardList, FileText } from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { getLoggedInUser } from "../../services/authService";
import { getAppointmentsByDoctor } from "../../services/appointmentService";
import { getPrescriptionsByDoctor } from "../../services/prescriptionService";
import { getDiagnosisByDoctor } from "../../services/diagnosisService";

function DoctorDashboardPage() {
  const doctorId = getLoggedInUser()?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaysAppointments, setTodaysAppointments] = useState(0);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);
  const [totalDiagnoses, setTotalDiagnoses] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [appointmentsData, prescriptionsData, diagnosisData] =
          await Promise.all([
            getAppointmentsByDoctor(doctorId),
            getPrescriptionsByDoctor(doctorId),
            getDiagnosisByDoctor(doctorId),
          ]);
        const today = new Date().toISOString().slice(0, 10);
        setTodaysAppointments(
          appointmentsData.filter((entry) => entry.date === today).length,
        );
        setTotalPrescriptions(prescriptionsData.length);
        setTotalDiagnoses(diagnosisData.length);
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
  }, [doctorId]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
        {error}
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctor Dashboard"
        description="Snapshot of today's workload and clinical activity."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Today's Appointments"
          value={todaysAppointments}
          icon={CalendarDays}
        />
        <StatCard
          title="Total Prescriptions Written"
          value={totalPrescriptions}
          icon={ClipboardList}
        />
        <StatCard
          title="Total Diagnoses Added"
          value={totalDiagnoses}
          icon={FileText}
        />
      </section>
    </div>
  );
}

export default DoctorDashboardPage;
