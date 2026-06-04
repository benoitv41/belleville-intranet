import { ExcelImporter } from '@/components/import/ExcelImporter'
import { isSupabaseConfigured } from '@/lib/data'
import { AlertCircle } from 'lucide-react'

export default function ImportPage() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Importer des pièces</h1>
      <p className="text-gray-500 text-sm mb-6">
        Importez vos factures, devis et commandes depuis un fichier Excel (.xlsx) ou CSV.
      </p>

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
