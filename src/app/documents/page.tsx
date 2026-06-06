import { getDocuments } from '@/lib/data'
import { DocumentsTable } from '@/components/documents/DocumentsTable'

export const dynamic = 'force-dynamic'

export default async function DocumentsPage() {
  const documents = await getDocuments()
  const commerciaux = [...new Set(documents.map(d => d.commercial_nom))].sort()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#1C3461' }}>Documents</h1>
      <p className="text-gray-500 text-sm mb-6">{documents.length} pièces au total</p>
      <DocumentsTable documents={documents} commerciaux={commerciaux} />
    </div>
  )
}
