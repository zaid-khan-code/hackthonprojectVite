import { Inbox } from 'lucide-react'

function EmptyState({
  title = 'No records found',
  message = 'Data will appear here once records are available.',
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-blue-200 bg-white p-10 text-center">
      <div className="rounded-full bg-blue-100 p-3">
        <Inbox className="h-5 w-5 text-blue-700" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  )
}

export default EmptyState
