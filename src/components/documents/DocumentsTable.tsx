'use client'

import { useState, useMemo } from 'react'
import { Document, DocType, DocStatut } from '@/lib/types'
import { formatCurrency } from '@/lib/stats'
import { Search, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = { facture: 'Facture', devis: 'Devis', commande: 'Commande', avoir: 'Avoir' }
const TYPE_STYLES: Record<string, string> = {
  facture: 'bg-blue-100 text-blue-700',
  devis: 'bg-amber-100 text-amber-700',
  commande: 'bg-green-100 text-green-700',
  avoir: 'bg-purple-100 text-purple-700',
}
const STATUT_LABELS: Record<string, string> = { payé: 'Payé', validé: 'Validé', en_cours: 'En cours', annulé: 'Annulé', envoyé: 'Envoyé' }
const STATUT_STYLES: Record<string, string> = {
  payé: 'bg-green-100 text-green-700',
  validé: 'bg-blue-100 text-blue-700',
  en_cours: 'bg-gray-100 text-gray-600',
  annulé: 'bg-red-100 text-red-600',
  envoyé: 'bg-indigo-100 text-indigo-700',
}

type SortKey = 'date' | 'client' | 'commercial_nom' | 'montant_ht'

interface Props {
  documents: Document[]
  commerciaux: string[]
}

export function DocumentsTable({ documents, commerciaux }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<DocType | ''>('')
  const [statutFilter, setStatutFilter] = useState<DocStatut | ''>('')
  const [commercialFilter, setCommercialFilter] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const perPage = 20

  const filtered = useMemo(() => {
    let docs = documents
    if (search) {
      const q = search.toLowerCase()
      docs = docs.filter(d =>
        d.client.toLowerCase().includes(q) ||
        d.commercial_nom.toLowerCase().includes(q) ||
        (d.numero || '').toLowerCase().includes(q)
      )
    }
    if (typeFilter) docs = docs.filter(d => d.type === typeFilter)
    if (statutFilter) docs = docs.filter(d => d.statut === statutFilter)
    if (commercialFilter) docs = docs.filter(d => d.commercial_nom === commercialFilter)

    docs = [...docs].sort((a, b) => {
      let av: string | number = a[sortKey]
      let bv: string | number = b[sortKey]
      if (sortKey === 'montant_ht') return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })

    return docs
  }, [documents, search, typeFilter, statutFilter, commercialFilter, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / perPage)
  const pageDocs = filtered.slice((page - 1) * perPage, page * perPage)
  const totalHT = filtered.reduce((s, d) => s + d.montant_ht, 0)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
    return sortDir === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rechercher client, commercial, numéro..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <select
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value as DocType | ''); setPage(1) }}
          >
            <option value="">Tous les types</option>
            {(['facture', 'devis', 'commande', 'avoir'] as DocType[]).map(t => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
          <select
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statutFilter}
            onChange={e => { setStatutFilter(e.target.value as DocStatut | ''); setPage(1) }}
          >
            <option value="">Tous statuts</option>
            {(['en_cours', 'validé', 'envoyé', 'payé', 'annulé'] as DocStatut[]).map(s => (
              <option key={s} value={s}>{STATUT_LABELS[s]}</option>
            ))}
          </select>
          <select
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={commercialFilter}
            onChange={e => { setCommercialFilter(e.target.value); setPage(1) }}
          >
            <option value="">Tous commerciaux</option>
            {commerciaux.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
          <span>Total HT : <strong className="text-gray-800">{formatCurrency(totalHT)}</strong></span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">N°</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                <th
                  className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none"
                  onClick={() => toggleSort('client')}
                >
                  <span className="flex items-center gap-1">Client <SortIcon k="client" /></span>
                </th>
                <th
                  className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none"
                  onClick={() => toggleSort('commercial_nom')}
                >
                  <span className="flex items-center gap-1">Commercial <SortIcon k="commercial_nom" /></span>
                </th>
                <th
                  className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none"
                  onClick={() => toggleSort('montant_ht')}
                >
                  <span className="flex items-center gap-1 justify-end">Montant HT <SortIcon k="montant_ht" /></span>
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Montant TTC</th>
                <th
                  className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-700 select-none"
                  onClick={() => toggleSort('date')}
                >
                  <span className="flex items-center gap-1">Date <SortIcon k="date" /></span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{doc.numero || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[doc.type] || 'bg-gray-100 text-gray-600'}`}>
                      {TYPE_LABELS[doc.type] || doc.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{doc.client}</td>
                  <td className="px-4 py-3 text-gray-600">{doc.commercial_nom}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(doc.montant_ht)}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{doc.montant_ttc ? formatCurrency(doc.montant_ttc) : '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUT_STYLES[doc.statut] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUT_LABELS[doc.statut] || doc.statut}
                    </span>
                  </td>
                </tr>
              ))}
              {pageDocs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Aucun document trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <span className="text-gray-500">Page {page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
