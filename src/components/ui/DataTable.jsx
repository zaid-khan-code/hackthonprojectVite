import EmptyState from './EmptyState'
import LoadingSpinner from './LoadingSpinner'

function DataTable({
  columns,
  rows,
  rowKey = 'id',
  loading = false,
  emptyTitle,
  emptyMessage,
}) {
  if (loading) {
    return <LoadingSpinner label="Loading table..." />
  }

  if (!rows?.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-100">
          <thead className="bg-blue-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-blue-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {rows.map((row) => (
              <tr
                key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey]}
                className="transition hover:bg-blue-50/70"
              >
                {columns.map((column) => (
                  <td
                    key={`${column.key}-${row.id}`}
                    className="whitespace-nowrap px-4 py-3 text-sm text-slate-700"
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
