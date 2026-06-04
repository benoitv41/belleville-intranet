'use client'

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { CommercialStats } from '@/lib/types'
import { formatCurrency } from '@/lib/stats'

interface CaMensuelProps { data: { month: string; ca: number }[] }
export function CaMensuelChart({ data }: CaMensuelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Évolution CA mensuel</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Line type="monotone" dataKey="ca" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="CA HT" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface CaCommercialProps { data: CommercialStats[]; objectifs?: Record<string, number> }
export function CaCommercialChart({ data }: CaCommercialProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">CA par commercial</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Bar dataKey="ca" fill="#3B82F6" radius={[4, 4, 0, 0]} name="CA HT" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface RepartitionProps { data: { name: string; value: number; color: string }[] }
export function RepartitionTypesChart({ data }: RepartitionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Répartition par type</h3>
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
      <h3 className="font-semibold text-gray-800 mb-4">Pipeline par commercial</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend iconSize={10} />
          <Bar dataKey="devis" stackId="a" fill="#F59E0B" name="Devis" />
          <Bar dataKey="commandes" stackId="a" fill="#10B981" name="Commandes" />
          <Bar dataKey="factures" stackId="a" fill="#3B82F6" name="Factures" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface ConversionProps { data: CommercialStats[] }
export function ConversionChart({ data }: ConversionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Taux de conversion</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 48 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="nom" tick={{ fontSize: 12 }} width={80} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Bar dataKey="tauxConversion" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Taux conversion" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
