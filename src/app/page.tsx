import { Suspense } from 'react'
import { getDocuments, getCommerciaux, isSupabaseConfigured } from '@/lib/data'
import { computeKpis, caParCommercial, caMensuel, repartitionTypes, pipelineParCommercial, filterByPeriod, caComparaisonAnnuelle } from '@/lib/stats'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import {
  CaMensuelChart,
  CaCommercialChart,
  RepartitionTypesChart,
  PipelineChart,
  ConversionChart,
  ComparaisonAnnuelleChart,
} from '@/components/dashboard/Charts'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 60

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ commercial?: string; periode?: string }>
}) {
  const params = await searchParams
  const [allDocuments, commerciaux] = await Promise.all([getDocuments(), getCommerciaux()])

  const activeNames = new Set(commerciaux.map(c => c.nom))
  const documents = allDocuments.filter(d => activeNames.has(d.commercial_nom))

  const filteredByCommercial = params.commercial
    ? documents.filter(d => d.commercial_nom === params.commercial)
    : documents

  const periode = params.periode || 'tout'
  const filteredDocs = filterByPeriod(filteredByCommercial, periode)

  const kpis = computeKpis(filteredDocs)
  const statsParCommercial = caParCommercial(filteredDocs)
  const mensuel = caMensuel(filteredDocs)
  const repartition = repartitionTypes(filteredDocs)
  const pipeline = pipelineParCommercial(filteredDocs)
  const comparaison = periode === 'comparaison' ? caComparaisonAnnuelle(filteredDocs) : null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2 flex items-center gap-2" style={{ color: '#E8630A' }}>
            <span className="w-6 h-px inline-block" style={{ backgroundColor: '#E8630A' }}></span>
            Intranet commercial
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight" style={{ color: '#1C3461' }}>Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">{filteredDocs.length} pièces · {commerciaux.length} commerciaux</p>
        </div>
        {!isSupabaseConfigured && (
          <Link href="/import" className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2 hover:bg-amber-100 transition-colors">
            <AlertCircle className="w-3.5 h-3.5" />
            Mode démo — connectez Supabase pour vos données
          </Link>
        )}
      </div>

      <Suspense fallback={null}>
        <DashboardFilters commerciaux={commerciaux.map(c => c.nom)} />
      </Suspense>

      <KpiCards kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {comparaison ? (
          <ComparaisonAnnuelleChart data={comparaison} />
        ) : (
          <CaMensuelChart data={mensuel} />
        )}
        <CaCommercialChart data={statsParCommercial} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RepartitionTypesChart data={repartition} />
        <div className="lg:col-span-2">
          <PipelineChart data={pipeline} />
        </div>
      </div>

      <ConversionChart data={statsParCommercial} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Dernières pièces</h3>
          <Link href="/documents" className="text-sm hover:underline" style={{ color: '#E8630A' }}>Voir tout</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">N°</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Client</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Commercial</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Montant HT</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDocs.slice(0, 8).map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{doc.numero || '—'}</td>
                <td className="px-5 py-3">
                  <TypeBadge type={doc.type} />
                </td>
                <td className="px-5 py-3 font-medium text-gray-900">{doc.client}</td>
                <td className="px-5 py-3 text-gray-600">{doc.commercial_nom}</td>
                <td className="px-5 py-3 text-right font-medium text-gray-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(doc.montant_ht)}
                </td>
                <td className="px-5 py-3 text-gray-500">{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                <td className="px-5 py-3">
                  <StatutBadge statut={doc.statut} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    devis: 'bg-amber-100 text-amber-700',
    commande: 'bg-green-100 text-green-700',
    avoir: 'bg-purple-100 text-purple-700',
    bl: 'bg-teal-100 text-teal-700',
  }
  const labels: Record<string, string> = {
    facture: 'Facture', devis: 'Devis', commande: 'Commande', avoir: 'Avoir', bl: 'BL',
  }
  if (type === 'facture') {
    return (
      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#fde8d5', color: '#E8630A' }}>
        Facture
      </span>
    )
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-600'}`}>
      {labels[type] || type}
    </span>
  )
}

function StatutBadge({ statut }: { statut: string }) {
  const styles: Record<string, string> = {
    payé: 'bg-green-100 text-green-700',
    validé: 'bg-blue-100 text-blue-700',
    en_cours: 'bg-gray-100 text-gray-600',
    annulé: 'bg-red-100 text-red-600',
    envoyé: 'bg-indigo-100 text-indigo-700',
  }
  const labels: Record<string, string> = {
    payé: 'Payé', validé: 'Validé', en_cours: 'En cours', annulé: 'Annulé', envoyé: 'Envoyé',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${styles[statut] || 'bg-gray-100 text-gray-600'}`}>
      {labels[statut] || statut}
    </span>
  )
}
