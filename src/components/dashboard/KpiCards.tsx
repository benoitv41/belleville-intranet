import { KpiData } from '@/lib/types'
import { formatCurrency } from '@/lib/stats'
import { TrendingUp, TrendingDown, FileText, ClipboardList, ShoppingCart, Percent } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props { kpis: KpiData }

export function KpiCards({ kpis }: Props) {
  const cards = [
    {
      label: 'CA Total',
      value: formatCurrency(kpis.caTotal),
      sub: `${formatCurrency(kpis.caMois)} ce mois`,
      icon: TrendingUp,
      trend: kpis.evolutionCa,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Factures',
      value: kpis.nbFactures,
      sub: 'émises au total',
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Devis',
      value: kpis.nbDevis,
      sub: 'en cours et passés',
      icon: ClipboardList,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Commandes',
      value: kpis.nbCommandes,
      sub: 'reçues',
      icon: ShoppingCart,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Taux conversion',
      value: `${kpis.tauxConversion}%`,
      sub: 'devis → commande',
      icon: Percent,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(({ label, value, sub, icon: Icon, trend, color, bg }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', bg)}>
              <Icon className={cn('w-4 h-4', color)} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center gap-1 mt-1">
            {trend !== undefined && (
              <span className={cn('text-xs font-medium flex items-center gap-0.5', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
                {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            )}
            <span className="text-xs text-gray-400">{sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
