import { useEffect, useState } from "react";
import { CalendarClock, Clock3, Users } from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { getAllPatients } from "../../services/patientService";
import { getAllAppointments } from "../../services/appointmentService";

function ReceptionistDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [todaysAppointments, setTodaysAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [patientsData, appointmentsData] = await Promise.all([
          getAllPatients(),
          getAllAppointments(),
        ]);
        const today = new Date().toISOString().slice(0, 10);
        setTotalPatients(patientsData.length);
        setTodaysAppointments(
          appointmentsData.filter((entry) => entry.date === today).length,
        );
        setPendingAppointments(
          appointmentsData.filter((entry) => entry.status === "pending").length,
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
  }, []);

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
        title="Receptionist Dashboard"
        description="Monitor patients and day-to-day appointment flow."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Patients" value={totalPatients} icon={Users} />
        <StatCard
          title="Today's Appointments"
          value={todaysAppointments}
          icon={CalendarClock}
        />
        <StatCard
          title="Pending Appointments"
          value={pendingAppointments}
          icon={Clock3}
        />
      </section>
    </div>
  );
}

export default ReceptionistDashboardPage;
