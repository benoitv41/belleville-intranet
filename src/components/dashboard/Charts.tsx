'use client'

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { CommercialStats } from '@/lib/types'
import { formatCurrency, ComparaisonData } from '@/lib/stats'

interface CaMensuelProps { data: { month: string; ca: number }[]; title?: string }
export function CaMensuelChart({ data, title }: CaMensuelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-sm uppercase tracking-[0.1em] mb-4" style={{ color: '#1C3461' }}>{title ?? 'Évolution CA mensuel'}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Line type="monotone" dataKey="ca" stroke="#E8630A" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="CA HT" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CaCommercialProps { data: CommercialStats[]; title?: string }
export function CaCommercialChart({ data, title }: CaCommercialProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-sm uppercase tracking-[0.1em] mb-4" style={{ color: '#1C3461' }}>{title ?? 'CA par commercial'}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Bar dataKey="ca" fill="#E8630A" radius={[4, 4, 0, 0]} name="CA HT" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface RepartitionProps { data: { name: string; value: number; color: string }[] }
export function RepartitionTypesChart({ data }: RepartitionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-sm uppercase tracking-[0.1em] mb-4" style={{ color: '#1C3461' }}>Répartition par type</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v} pièces`} />
          <Legend iconType="circle" iconSize={10} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface PipelineProps { data: { nom: string; devis: number; commandes: number; factures: number }[] }
export function PipelineChart({ data }: PipelineProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-sm uppercase tracking-[0.1em] mb-4" style={{ color: '#1C3461' }}>Pipeline par commercial</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend iconSize={10} />
          <Bar dataKey="devis" stackId="a" fill="#F59E0B" name="Devis" />
          <Bar dataKey="commandes" stackId="a" fill="#10B981" name="Commandes" />
          <Bar dataKey="factures" stackId="a" fill="#E8630A" name="Factures" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ComparaisonAnnuelleChart({ data }: { data: ComparaisonData }) {
  const { months, thisYear, lastYear } = data
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-sm uppercase tracking-[0.1em] mb-4" style={{ color: '#1C3461' }}>Comparaison {thisYear} vs {lastYear}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={months} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Legend iconSize={10} />
          <Line type="monotone" dataKey="annee_courante" stroke="#E8630A" strokeWidth={2.5} dot={{ r: 3 }} name={String(thisYear)} />
          <Line type="monotone" dataKey="annee_precedente" stroke="#1C3461" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name={String(lastYear)} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface FacturesCommandesProps { data: { month: string; factures: number; commandes: number; isCurrent: boolean }[] }
export function FacturesCommandesChart({ data }: FacturesCommandesProps) {
  const currentMonth = data.find(d => d.isCurrent)?.month
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-[0.1em]" style={{ color: '#1C3461' }}>Facturations & Commandes mensuels</h3>
        {currentMonth && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#fde8d5', color: '#E8630A' }}>
            Mois en cours : {currentMonth}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Legend iconSize={10} />
          <Line type="monotone" dataKey="factures" stroke="#E8630A" strokeWidth={2.5} dot={(props) => {
            const { cx, cy, payload } = props
            return payload.isCurrent
              ? <circle key={payload.month} cx={cx} cy={cy} r={6} fill="#E8630A" stroke="white" strokeWidth={2} />
              : <circle key={payload.month} cx={cx} cy={cy} r={3} fill="#E8630A" />
          }} name="Facturations HT" />
          <Line type="monotone" dataKey="commandes" stroke="#1C3461" strokeWidth={2.5} dot={(props) => {
            const { cx, cy, payload } = props
            return payload.isCurrent
              ? <circle key={payload.month} cx={cx} cy={cy} r={6} fill="#1C3461" stroke="white" strokeWidth={2} />
              : <circle key={payload.month} cx={cx} cy={cy} r={3} fill="#1C3461" />
          }} name="Commandes HT" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CommandesAnnuellesChart({ data }: { data: ComparaisonData }) {
  const { months, thisYear, lastYear } = data
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-sm uppercase tracking-[0.1em] mb-4" style={{ color: '#1C3461' }}>Commandes {thisYear} vs {lastYear}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={months} margin={{ top: 4, right: 8, bottom: 0, left: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Legend iconSize={10} />
          <Bar dataKey="annee_courante" fill="#1C3461" radius={[3, 3, 0, 0]} name={String(thisYear)} />
          <Bar dataKey="annee_precedente" fill="#8fa3c8" radius={[3, 3, 0, 0]} name={String(lastYear)} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface ConversionProps { data: CommercialStats[] }
export function ConversionChart({ data }: ConversionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-sm uppercase tracking-[0.1em] mb-4" style={{ color: '#1C3461' }}>Taux de conversion</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="nom" tick={{ fontSize: 12 }} width={80} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Bar dataKey="tauxConversion" fill="#1C3461" radius={[0, 4, 4, 0]} name="Taux conversion" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
