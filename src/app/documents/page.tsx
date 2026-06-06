import { getDocuments } from '@/lib/data'
import { DocumentsTable } from '@/components/documents/DocumentsTable'

export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
  const documents = await getDocuments()
  const commerciaux = [...new Set(documents.map(d => d.commercial_nom))].sort()

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2 flex items-center gap-2" style={{ color: '#E8630A' }}>
          <span className="w-6 h-px inline-block" style={{ backgroundColor: '#E8630A' }}></span>
          Base documentaire
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight" style={{ color: '#1C3461' }}>Documents</h1>
        <p className="text-gray-400 text-sm mt-1">{documents.length} pièces au total</p>
      </div>
      <DocumentsTable documents={documents} commerciaux={commerciaux} />
    </div>
  )
}
