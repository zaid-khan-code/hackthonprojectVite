import { CalendarDays, ClipboardList, FileText } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { CURRENT_SESSION, appointments, diagnosisLogs, prescriptions } from '../../data/mockData'

function DoctorDashboardPage() {
  const today = new Date().toISOString().slice(0, 10)
  const doctorId = CURRENT_SESSION.doctorId

  const todaysAppointments = appointments.filter(
    (entry) => entry.doctor_id === doctorId && entry.date === today,
  ).length

  const totalPrescriptions = prescriptions.filter(
    (entry) => entry.doctor_id === doctorId,
  ).length

  const totalDiagnoses = diagnosisLogs.filter(
    (entry) => entry.doctor_id === doctorId,
  ).length

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
  )
}

export default DoctorDashboardPage
