'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, FileText, Users, Settings, Kanban } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crm', label: 'CRM', icon: Kanban },
  { href: '/commerciaux', label: 'Commerciaux', icon: Users },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/import', label: 'Importer', icon: Upload },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen flex flex-col flex-shrink-0" style={{ backgroundColor: '#1C3461' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ backgroundColor: '#142850' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8630A' }}>
          <span className="text-white font-black text-sm leading-none">B</span>
        </div>
        <div>
          <p className="font-bold text-white text-sm tracking-wide leading-tight">BELLEVILLE</p>
          <p className="text-xs leading-tight" style={{ color: 'rgba(255,255,255,0.5)' }}>Intranet commercial</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="text-xs font-semibold px-3 mb-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Navigation
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'text-white'
                  : 'hover:bg-white/10'
              )}
              style={active ? { backgroundColor: '#E8630A' } : { color: 'rgba(255,255,255,0.65)' }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-5">
        <div className="h-px mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-white/10"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <Settings className="w-4 h-4" />
          Paramètres
        </Link>
      </div>
    </aside>
  )
}
