import { KpiData } from '@/lib/types'
import { formatCurrency } from '@/lib/stats'
import { TrendingUp, TrendingDown, FileText, ClipboardList, ShoppingCart, Percent } from 'lucide-react'

interface Props { kpis: KpiData }

const CARDS = (kpis: KpiData) => [
  {
    label: 'CA Total (facturé HT)',
    value: formatCurrency(kpis.caTotal),
    sub: `${formatCurrency(kpis.caMois)} ce mois`,
    icon: TrendingUp,
    trend: kpis.evolutionCa,
    accent: '#E8630A',
    iconBg: '#fde8d5',
    iconColor: '#E8630A',
  },
  {
    label: 'Factures',
    value: kpis.nbFactures,
    sub: 'émises',
    icon: FileText,
    accent: '#1C3461',
    iconBg: '#dde4f0',
    iconColor: '#1C3461',
  },
  {
    label: 'Devis',
    value: kpis.nbDevis,
    sub: 'en cours et passés',
    icon: ClipboardList,
    accent: '#F59E0B',
    iconBg: '#fef3c7',
    iconColor: '#D97706',
  },
  {
    label: 'Commandes',
    value: kpis.nbCommandes,
    sub: 'reçues',
    icon: ShoppingCart,
    accent: '#16A34A',
    iconBg: '#dcfce7',
    iconColor: '#16A34A',
  },
  {
    label: 'Taux conversion',
    value: `${kpis.tauxConversion}%`,
    sub: 'devis → commande',
    icon: Percent,
    accent: '#7C3AED',
    iconBg: '#ede9fe',
    iconColor: '#7C3AED',
  },
]

export function KpiCards({ kpis }: Props) {
  const cards = CARDS(kpis)
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(({ label, value, sub, icon: Icon, trend, accent, iconBg, iconColor }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div style={{ height: '3px', backgroundColor: accent }} />
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {trend !== undefined && (
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {trend >= 0 ? '+' : ''}{trend}%
                </span>
              )}
              <span className="text-xs text-gray-400">{sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
