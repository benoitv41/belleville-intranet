import { getDocuments, getCommerciaux } from '@/lib/data'
import { CommerciauxView } from '@/components/commerciaux/CommerciauxView'

export const dynamic = 'force-dynamic'

export default async function CommerciauxPage() {
  const [documents, commerciaux] = await Promise.all([getDocuments(), getCommerciaux()])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Commerciaux</h1>
      <p className="text-gray-500 text-sm mb-6">Performance et suivi individuel</p>
      <CommerciauxView documents={documents} commerciaux={commerciaux} />
    </div>
  )
}
