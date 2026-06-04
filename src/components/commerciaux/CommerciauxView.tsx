'use client'

import { useState } from 'react'
import { Document, Commercial, CommercialStats } from '@/lib/types'
import { formatCurrency, caParCommercial, caMensuel } from '@/lib/stats'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, FileText, ClipboardList, ShoppingCart, Target } from 'lucide-react'
import { format, parseISO, subMonths, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  documents: Document[]
  commerciaux: Commercial[]
}

export function CommerciauxView({ documents, commerciaux }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const stats = caParCommercial(documents)
  const allCommerciaux = [...new Set([...stats.map(s => s.nom), ...commerciaux.map(c => c.nom)])]

  const selectedDocs = selected ? documents.filter(d => d.commercial_nom === selected) : []
  const selectedCommercial = commerciaux.find(c => c.nom === selected)
  const selectedStats = stats.find(s => s.nom === selected)

  const selectedMensuel = selected ? (() => {
    const result: Record<string, number> = {}
    for (let i = 11; i >= 0; i--) {
      const d = subMonths(new Date(), i)
      const key = format(d, 'yyyy-MM')
      result[key] = 0
    }
    selectedDocs.filter(d => d.type === 'facture' && d.statut !== 'annulé').forEach(doc => {
      const key = doc.date.slice(0, 7)
      if (key in result) result[key] += doc.montant_ht
    })
    return Object.entries(result).map(([month, ca]) => ({
      month: format(parseISO(`${month}-01`), 'MMM yy', { locale: fr }),
      ca: Math.round(ca),
    }))
  })() : []

  const now = new Date()
  const caCeMois = selectedDocs
    .filter(d => d.type === 'facture' && d.statut !== 'annulé')
    .filter(d => isWithinInterval(parseISO(d.date), { start: startOfMonth(now), end: endOfMonth(now) }))
    .reduce((s, d) => s + d.montant_ht, 0)

  const objectif = selectedCommercial?.objectif_mensuel || 0
  const progressPct = objectif > 0 ? Math.min(100, Math.round((caCeMois / objectif) * 100)) : 0

  return (
    <div className="flex gap-6">
      <div className="w-64 flex-shrink-0 space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-3">Commerciaux</p>
        {stats.map(s => (
          <button
            key={s.nom}
            onClick={() => setSelected(selected === s.nom ? null : s.nom)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
              selected === s.nom
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50'
            }`}
          >
            <p className={`font-medium text-sm ${selected === s.nom ? 'text-white' : 'text-gray-800'}`}>{s.nom}</p>
            <p className={`text-xs mt-0.5 ${selected === s.nom ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatCurrency(s.ca)} CA
            </p>
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-4">
        {!selected ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <button
                  key={s.nom}
                  onClick={() => setSelected(s.nom)}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-left hover:border-blue-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {s.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="text-xs text-gray-400 font-medium">#{i + 1}</span>
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{s.nom}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(s.ca)}</p>
                  <div className="mt-2 grid grid-cols-3 gap-1 text-center">
                    <div>
                      <p className="text-xs font-bold text-amber-600">{s.devis}</p>
                      <p className="text-xs text-gray-400">devis</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-600">{s.commandes}</p>
                      <p className="text-xs text-gray-400">cmds</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-purple-600">{s.tauxConversion}%</p>
                      <p className="text-xs text-gray-400">conv.</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Comparaison CA par commercial</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Bar dataKey="ca" fill="#3B82F6" radius={[4, 4, 0, 0]} name="CA HT" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Taux de conversion</h3>
              <div className="space-y-3">
                {stats.map(s => (
                  <div key={s.nom}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{s.nom}</span>
                      <span className="text-sm font-medium text-gray-800">{s.tauxConversion}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${s.tauxConversion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected}</h2>
                <p className="text-gray-500 text-sm">{selectedDocs.length} pièces au total</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Retour
              </button>
            </div>

            {objectif > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700 text-sm">Objectif mensuel</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{formatCurrency(caCeMois)} / {formatCurrency(objectif)}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${progressPct >= 100 ? 'bg-green-500' : progressPct >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{progressPct}% de l'objectif atteint ce mois</p>
              </div>
            )}

            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'CA Total', value: formatCurrency(selectedStats?.ca || 0), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Factures', value: selectedStats?.factures || 0, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Devis', value: selectedStats?.devis || 0, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Conversion', value: `${selectedStats?.tauxConversion || 0}%`, icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{label}</span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Évolution CA mensuel</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={selectedMensuel} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Line type="monotone" dataKey="ca" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} name="CA HT" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Dernières pièces</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">N°</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Montant HT</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedDocs.slice(0, 10).map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono text-xs text-gray-400">{doc.numero || '—'}</td>
                      <td className="px-5 py-3 capitalize text-gray-600 text-xs">{doc.type}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{doc.client}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">{formatCurrency(doc.montant_ht)}</td>
                      <td className="px-5 py-3 text-gray-500">{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          doc.statut === 'payé' ? 'bg-green-100 text-green-700' :
                          doc.statut === 'annulé' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {doc.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
