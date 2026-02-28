import {
  ArrowRight,
  ClipboardList,
  HeartPulse,
  Shield,
  Stethoscope,
  User,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const roleCards = [
  { label: 'Admin', icon: Shield, path: '/admin' },
  { label: 'Doctor', icon: Stethoscope, path: '/doctor' },
  { label: 'Receptionist', icon: ClipboardList, path: '/receptionist' },
  { label: 'Patient', icon: User, path: '/patient/dashboard' },
]

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#bfdbfe_0,_#eff6ff_35%,_#f8fbff_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white/95 p-8 shadow-lg sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
                <HeartPulse className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Clinic Management Platform
                </span>
              </div>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                CareBridge Medical Center
              </h1>
              <p className="mt-4 max-w-2xl text-slate-600">
                Centralized portal for administrators, doctors, receptionists, and
                patients. Track appointments, manage records, and keep clinical data
                organized in one secure system.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Go to Login
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
              <h2 className="text-xl font-bold text-slate-900">Quick Role Access</h2>
              <p className="mt-2 text-sm text-slate-600">
                Select a portal below to preview each role dashboard layout.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roleCards.map((card) => {
            const CardIcon = card.icon
            return (
              <article
                key={card.label}
                className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3">
                  <CardIcon className="h-5 w-5 text-blue-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{card.label}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Open {card.label.toLowerCase()} dashboard
                </p>
                <button
                  type="button"
                  onClick={() => navigate(card.path)}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                >
                  Open {card.label}
                </button>
              </article>
            )
          })}
        </section>
      </div>
    </div>
  )
}

export default LandingPage
