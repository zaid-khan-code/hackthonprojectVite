import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-blue-100 bg-white p-8 text-center shadow-sm">
        <h1 className="text-5xl font-bold text-blue-700">404</h1>
        <p className="mt-2 text-lg font-semibold text-slate-900">Page not found</p>
        <p className="mt-1 text-sm text-slate-500">
          The page you requested does not exist in the clinic portal.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go to Landing
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
