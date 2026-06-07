'use client'

import { useRouter } from 'next/navigation'
import { KpiData } from '@/lib/types'
import { formatCurrency } from '@/lib/stats'
import { TrendingUp, TrendingDown, FileText, ClipboardList, ShoppingCart, Percent } from 'lucide-react'

interface Props {
  kpis: KpiData
  currentType?: string | null
  currentParams?: { commercial?: string; periode?: string }
}

const CARDS = (kpis: KpiData) => [
  {
    label: 'CA Total (facturé HT)',
    value: formatCurrency(kpis.caTotal),
    sub: `${formatCurrency(kpis.caMois)} ce mois`,
    sub2: kpis.totalAvoirs > 0 ? `dont ${formatCurrency(kpis.totalAvoirs)} d'avoirs` : undefined,
    icon: TrendingUp,
    trend: kpis.evolutionCa,
    accent: '#E8630A',
    iconBg: '#fde8d5',
    iconColor: '#E8630A',
    filterKey: undefined,
  },
  {
    label: 'Commandes (total)',
    value: formatCurrency(kpis.totalCommandes),
    sub: 'HT toutes commandes',
    icon: ShoppingCart,
    accent: '#1C3461',
    iconBg: '#dde4f0',
    iconColor: '#1C3461',
    filterKey: 'commande',
  },
  {
    label: 'Commandes ce mois',
    value: formatCurrency(kpis.commandesMois),
    sub: 'HT mois en cours',
    icon: ClipboardList,
    accent: '#F59E0B',
    iconBg: '#fef3c7',
    iconColor: '#D97706',
    filterKey: undefined,
  },
  {
    label: 'Cmd. non terminées',
    value: formatCurrency(kpis.commandesNonTerminees),
    sub: 'statut en cours',
    icon: FileText,
    accent: '#DC2626',
    iconBg: '#fee2e2',
    iconColor: '#DC2626',
    filterKey: undefined,
  },
  {
    label: 'Taux conversion',
    value: `${kpis.tauxConversion}%`,
    sub: 'devis → commande',
    icon: Percent,
    accent: '#7C3AED',
    iconBg: '#ede9fe',
    iconColor: '#7C3AED',
    filterKey: undefined,
  },
]

export function KpiCards({ kpis, currentType, currentParams }: Props) {
  const router = useRouter()
  const cards = CARDS(kpis)

  const handleClick = (filterKey?: string) => {
    const p = new URLSearchParams()
    if (currentParams?.commercial) p.set('commercial', currentParams.commercial)
    if (currentParams?.periode) p.set('periode', currentParams.periode)
    if (filterKey && currentType !== filterKey) p.set('type', filterKey)
    router.push(`/?${p.toString()}`)
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(({ label, value, sub, sub2, icon: Icon, trend, accent, iconBg, iconColor, filterKey }) => {
        const isActive = filterKey != null && currentType === filterKey
        return (
          <div
            key={label}
            onClick={() => handleClick(filterKey)}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
              filterKey != null ? 'cursor-pointer hover:shadow-md' : ''
            } ${isActive ? 'ring-2' : 'border-gray-100'}`}
            style={isActive ? { borderColor: accent, ringColor: accent } as React.CSSProperties : undefined}
          >
            <div style={{ height: '3px', backgroundColor: isActive ? accent : accent }} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.1em]">{label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isActive ? accent : iconBg }}>
                  <Icon className="w-4 h-4" style={{ color: isActive ? 'white' : iconColor }} />
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: isActive ? accent : '#111827' }}>{value}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {trend !== undefined && (
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {trend >= 0 ? '+' : ''}{trend}%
                  </span>
                )}
                <span className="text-xs text-gray-400">{sub}</span>
              </div>
              {sub2 && (
                <p className="text-xs text-purple-500 mt-0.5">{sub2}</p>
              )}
              {isActive && (
                <p className="text-xs mt-1 font-medium" style={{ color: accent }}>Filtre actif · cliquer pour retirer</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
