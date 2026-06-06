'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, FileText, Users, Settings, Building2, Kanban } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/import', label: 'Importer', icon: Upload },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/commerciaux', label: 'Commerciaux', icon: Users },
  { href: '/crm', label: 'CRM', icon: Kanban },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col flex-shrink-0">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight">Belleville</p>
          <p className="text-gray-400 text-xs">Intranet commercial</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Link>
      </div>
    </aside>
  )
}
