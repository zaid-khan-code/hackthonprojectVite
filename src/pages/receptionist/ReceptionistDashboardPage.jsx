import { CalendarClock, Clock3, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import { appointments, patients } from '../../data/mockData'

function ReceptionistDashboardPage() {
  const today = new Date().toISOString().slice(0, 10)

  const totalPatients = patients.length
  const todaysAppointments = appointments.filter((entry) => entry.date === today).length
  const pendingAppointments = appointments.filter((entry) => entry.status === 'pending').length

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
  )
}

export default ReceptionistDashboardPage
