import { LoaderCircle } from 'lucide-react'

function LoadingSpinner({ label = 'Loading data...' }) {
  return (
    <div className="flex w-full items-center justify-center gap-3 rounded-2xl border border-blue-100 bg-white/95 p-8 shadow-sm">
      <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />
      <p className="text-sm font-medium text-blue-700">{label}</p>
    </div>
  )
}

export default LoadingSpinner
