import { getDocuments, getCommerciaux } from '@/lib/data'
import { DocumentsTable } from '@/components/documents/DocumentsTable'

export const revalidate = 60

export default async function DocumentsPage() {
  const [allDocuments, commerciauxData] = await Promise.all([getDocuments(), getCommerciaux()])
  const activeNames = new Set(commerciauxData.map(c => c.nom))
  const documents = allDocuments.filter(d => activeNames.has(d.commercial_nom))
  const commerciaux = commerciauxData.map(c => c.nom)

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
