import { ExcelImporter } from '@/components/import/ExcelImporter'
import { ResetDatabase } from '@/components/import/ResetDatabase'
import { isSupabaseConfigured } from '@/lib/data'
import { AlertCircle } from 'lucide-react'

export default function ImportPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#1C3461' }}>Importer des pièces</h1>
          <p className="text-gray-500 text-sm">
            Importez vos factures, devis et commandes depuis un fichier Excel (.xlsx) ou CSV.
          </p>
        </div>
        {isSupabaseConfigured && <ResetDatabase />}
      </div>

      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-0.5">Supabase non configuré</p>
            <p>Les données importées seront perdues au rechargement. Connectez Supabase pour persister vos données.</p>
          </div>
        </div>
      )}

      <ExcelImporter />
    </div>
  )
}
