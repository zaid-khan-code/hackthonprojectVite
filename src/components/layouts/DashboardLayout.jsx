import clsx from 'clsx'
import { HeartPulse, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const isActive = (item, pathname) => {
  if (item.exact) {
    return pathname === item.to
  }

  if (item.matchPrefixes) {
    return item.matchPrefixes.some((prefix) => pathname.startsWith(prefix))
  }

  return pathname === item.to || pathname.startsWith(`${item.to}/`)
}

function DashboardLayout({ portalName, navItems }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dbeafe_0,_#eff6ff_35%,_#f8fbff_100%)]">
      <div className="flex min-h-screen">
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 z-40 w-72 border-r border-blue-100 bg-white/95 backdrop-blur md:static md:translate-x-0',
            menuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-full flex-col p-5">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-600 p-2">
                  <HeartPulse className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    CareBridge
                  </p>
                  <h2 className="text-base font-bold text-slate-900">{portalName}</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-blue-100 p-1.5 text-slate-500 transition hover:bg-blue-50 md:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const ItemIcon = item.icon
                const active = isActive(item, location.pathname)

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={clsx(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700',
                    )}
                  >
                    <ItemIcon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 border-b border-blue-100 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="rounded-lg border border-blue-100 p-2 text-slate-600 transition hover:bg-blue-50 md:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              <p className="hidden text-sm font-semibold text-blue-700 md:block">{portalName}</p>
              <Link
                to="/login"
                className="ml-auto inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Link>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {menuOpen ? (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
          aria-label="Close sidebar"
        />
      ) : null}
    </div>
  )
}

export default DashboardLayout
