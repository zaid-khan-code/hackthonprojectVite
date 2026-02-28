import { useEffect, useState } from "react";
import { Activity, CalendarRange, ClipboardList } from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { getLoggedInUser } from "../../services/authService";
import { getAppointmentsByDoctor } from "../../services/appointmentService";
import { getPrescriptionsByDoctor } from "../../services/prescriptionService";
import { getDiagnosisByDoctor } from "../../services/diagnosisService";

function getMostCommonDiagnosis(logs) {
  if (!logs.length) {
    return "No diagnosis records";
  }

  const diagnosisCount = logs.reduce((accumulator, entry) => {
    accumulator[entry.diagnosis] = (accumulator[entry.diagnosis] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(diagnosisCount).sort((a, b) => b[1] - a[1])[0][0];
}

function DoctorAnalyticsPage() {
  const doctorId = getLoggedInUser()?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointmentsThisMonth, setAppointmentsThisMonth] = useState(0);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);
  const [mostCommonDiagnosis, setMostCommonDiagnosis] = useState(
    "No diagnosis records",
  );

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
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        setAppointmentsThisMonth(
          appointmentsData.filter((entry) => {
            const appointmentDate = new Date(entry.date);
            return (
              appointmentDate.getMonth() === month &&
              appointmentDate.getFullYear() === year
            );
          }).length,
        );
        setTotalPrescriptions(prescriptionsData.length);
        setMostCommonDiagnosis(getMostCommonDiagnosis(diagnosisData));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load analytics data. Please try again.",
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
        title="Doctor Analytics"
        description="Personal activity trends and diagnosis insight."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total appointments this month"
          value={appointmentsThisMonth}
          icon={CalendarRange}
        />
        <StatCard
          title="Total prescriptions"
          value={totalPrescriptions}
          icon={ClipboardList}
        />
        <article className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-sm font-medium text-slate-500">
              Most common diagnosis
            </h3>
            <div className="rounded-xl bg-blue-50 p-2">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {mostCommonDiagnosis}
          </p>
        </article>
      </section>
    </div>
  );
}

export default DoctorAnalyticsPage;
