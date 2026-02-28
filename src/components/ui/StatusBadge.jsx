import clsx from 'clsx'
import { normalizeStatus, toTitleCase } from '../../utils/formatters'

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
}

function StatusBadge({ status }) {
  const normalizedStatus = normalizeStatus(status)
  const tone = statusStyles[normalizedStatus] || 'bg-slate-100 text-slate-700 border-slate-200'

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide',
        tone,
      )}
    >
      {toTitleCase(normalizedStatus || 'unknown')}
    </span>
  )
}

export default StatusBadge
