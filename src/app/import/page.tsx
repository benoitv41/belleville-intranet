import { ExcelImporter } from '@/components/import/ExcelImporter'
import { ResetDatabase } from '@/components/import/ResetDatabase'
import { isSupabaseConfigured } from '@/lib/data'
import { AlertCircle } from 'lucide-react'

export default function ImportPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2 flex items-center gap-2" style={{ color: '#E8630A' }}>
            <span className="w-6 h-px inline-block" style={{ backgroundColor: '#E8630A' }}></span>
            Import de données
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight" style={{ color: '#1C3461' }}>Importer des pièces</h1>
          <p className="text-gray-400 text-sm mt-1">Importez vos factures, devis et commandes depuis un fichier Excel (.xlsx) ou CSV.</p>
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
