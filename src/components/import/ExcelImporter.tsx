'use client'

import { useState, useCallback, useRef } from 'react'
import { parseExcelFile, mapRowsToDocuments, ParsedExcelData } from '@/lib/excel'
import { ColumnMapping, DocType } from '@/lib/types'
import { Upload, CheckCircle, AlertCircle, Loader2, X, ChevronDown } from 'lucide-react'
import { formatCurrency } from '@/lib/stats'

const REQUIRED_FIELDS: { key: keyof ColumnMapping; label: string; required: boolean }[] = [
  { key: 'commercial_nom', label: 'Commercial', required: true },
  { key: 'client', label: 'Client', required: true },
  { key: 'client_numero', label: 'N° client', required: false },
  { key: 'date', label: 'Date', required: true },
  { key: 'montant_ht', label: 'Montant HT', required: true },
  { key: 'type', label: 'Type de pièce', required: false },
  { key: 'numero', label: 'Numéro', required: false },
  { key: 'montant_ttc', label: 'Montant TTC', required: false },
  { key: 'statut', label: 'Statut', required: false },
  { key: 'notes', label: 'Notes', required: false },
]

const TYPE_LABELS: Record<DocType, string> = {
  facture: 'Facture', devis: 'Devis', commande: 'Commande', avoir: 'Avoir',
}

export function ExcelImporter() {
  const [dragging, setDragging] = useState(false)
  const [parsed, setParsed] = useState<ParsedExcelData | null>(null)
  const [mapping, setMapping] = useState<Partial<ColumnMapping>>({})
  const [defaultType, setDefaultType] = useState<DocType>('facture')
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'done'>('upload')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx?|csv)$/i)) {
      setError('Format non supporté. Utilisez .xlsx, .xls ou .csv')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await parseExcelFile(file)
      setParsed(data)
      setStep('map')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la lecture du fichier')
    } finally {
      setLoading(false)
    }
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleImport = async () => {
    if (!parsed) return
    const completeMapping = mapping as ColumnMapping
    const docs = mapRowsToDocuments(parsed.rows, completeMapping, defaultType)

    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents: docs }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erreur d\'import')
      setImportedCount(json.count)
      setStep('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur lors de l\'import')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setParsed(null)
    setMapping({})
    setStep('upload')
    setError(null)
    setImportedCount(0)
  }

  const canProceed = REQUIRED_FIELDS.filter(f => f.required).every(f => mapping[f.key])
  const previewDocs = parsed && canProceed
    ? mapRowsToDocuments(parsed.rows.slice(0, 3), mapping as ColumnMapping, defaultType)
    : []

  if (step === 'done') {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{importedCount} pièces importées</h2>
        <p className="text-gray-500 mb-6">Les données sont maintenant disponibles dans votre dashboard.</p>
        <div className="flex gap-3 justify-center">
          <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Voir le dashboard
          </a>
          <button onClick={reset} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Importer un autre fichier
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {step === 'upload' && (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
            dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
          }`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}
          />
          {loading ? (
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-3" />
          ) : (
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          )}
          <p className="text-gray-700 font-medium mb-1">
            {loading ? 'Lecture en cours...' : 'Déposez votre fichier ici'}
          </p>
          <p className="text-gray-400 text-sm">ou cliquez pour sélectionner · .xlsx, .xls, .csv</p>
        </div>
      )}

      {step === 'map' && parsed && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-1">Fichier chargé</h3>
            <p className="text-sm text-gray-500 mb-4">{parsed.rows.length} lignes · {parsed.headers.length} colonnes détectées</p>

            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="text-xs w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {parsed.headers.map(h => (
                      <th key={h} className="text-left px-3 py-2 text-gray-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {parsed.preview.map((row, i) => (
                    <tr key={i}>
                      {parsed.headers.map(h => (
                        <td key={h} className="px-3 py-2 text-gray-600 whitespace-nowrap">{String(row[h] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Associer les colonnes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REQUIRED_FIELDS.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {field.key === 'type' ? (
                    <div className="space-y-2">
                      <div className="relative">
                        <select
                          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={mapping.type || ''}
                          onChange={e => setMapping(m => ({ ...m, type: e.target.value || undefined }))}
                        >
                          <option value="">— Colonne (optionnel)</option>
                          {parsed.headers.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      {!mapping.type && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1.5">Type par défaut :</p>
                          <div className="flex gap-2 flex-wrap">
                            {(Object.keys(TYPE_LABELS) as DocType[]).map(t => (
                              <button
                                key={t}
                                onClick={() => setDefaultType(t)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                  defaultType === t
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-200 text-gray-600 hover:border-blue-300'
                                }`}
                              >
                                {TYPE_LABELS[t]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={mapping[field.key] || ''}
                        onChange={e => setMapping(m => ({ ...m, [field.key]: e.target.value || undefined }))}
                      >
                        <option value="">— Sélectionner une colonne</option>
                        {parsed.headers.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {canProceed && previewDocs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Aperçu ({previewDocs.length} lignes sur {parsed.rows.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Type</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Commercial</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Client</th>
                      <th className="text-right px-3 py-2 text-xs font-medium text-gray-500">Montant HT</th>
                      <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {previewDocs.map((doc, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 capitalize text-gray-600">{doc.type}</td>
                        <td className="px-3 py-2 text-gray-900">{doc.commercial_nom}</td>
                        <td className="px-3 py-2 text-gray-900">{doc.client}</td>
                        <td className="px-3 py-2 text-right font-medium">{formatCurrency(doc.montant_ht)}</td>
                        <td className="px-3 py-2 text-gray-500">{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Recommencer
            </button>
            <button
              onClick={handleImport}
              disabled={!canProceed || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Importer {parsed.rows.length} lignes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
