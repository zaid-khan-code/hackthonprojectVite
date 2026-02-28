function StatCard({ title, value, icon: Icon, accent = 'text-blue-600' }) {
  return (
    <article className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="rounded-xl bg-blue-50 p-2">
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </article>
  )
}

export default StatCard
