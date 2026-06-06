import { getDocuments, getCommerciaux } from '@/lib/data'
import { CommerciauxView } from '@/components/commerciaux/CommerciauxView'

export const dynamic = 'force-dynamic'

export default async function CommerciauxPage() {
  const [documents, commerciaux] = await Promise.all([getDocuments(), getCommerciaux()])

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2 flex items-center gap-2" style={{ color: '#E8630A' }}>
          <span className="w-6 h-px inline-block" style={{ backgroundColor: '#E8630A' }}></span>
          Équipe commerciale
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight" style={{ color: '#1C3461' }}>Commerciaux</h1>
        <p className="text-gray-400 text-sm mt-1">Performance et suivi individuel</p>
      </div>
      <CommerciauxView documents={documents} commerciaux={commerciaux} />
    </div>
  )
}
