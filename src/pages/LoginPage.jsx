import { HeartPulse, LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { users } from '../data/mockData'

const rolePathMap = {
  admin: '/admin',
  doctor: '/doctor',
  receptionist: '/receptionist',
  patient: '/patient/dashboard',
}

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const user = users.find(
      (entry) =>
        entry.email.toLowerCase() === formData.email.toLowerCase() &&
        entry.password === formData.password,
    )

    if (!user) {
      setError('Invalid email or password.')
      return
    }

    navigate(rolePathMap[user.role] || '/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_#bfdbfe_0,_#eff6ff_35%,_#f8fbff_100%)] px-4">
      <section className="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-7 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 inline-flex rounded-xl bg-blue-600 p-3">
            <HeartPulse className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Clinic Login</h1>
          <p className="mt-1 text-sm text-slate-500">
            Role is detected automatically from database.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
              required
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
              required
              className="w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Need role selection?{' '}
          <Link to="/" className="font-semibold text-blue-700 hover:text-blue-800">
            Back to Landing
          </Link>
        </p>
      </section>
    </div>
  )
}

export default LoginPage
