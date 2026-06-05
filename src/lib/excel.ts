import * as XLSX from 'xlsx'
import { Document, DocType, DocStatut, ColumnMapping } from './types'

export interface ParsedExcelData {
  headers: string[]
  rows: Record<string, string | number>[]
  preview: Record<string, string | number>[]
}

export function parseExcelFile(file: File): Promise<ParsedExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet, {
          raw: false,
          dateNF: 'yyyy-mm-dd',
        })

        if (!rows.length) throw new Error('Fichier vide')

        const headers = Object.keys(rows[0])
        resolve({ headers, rows, preview: rows.slice(0, 5) })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'))
    reader.readAsArrayBuffer(file)
  })
}

function normalizeType(value: string): DocType {
  const v = String(value).toLowerCase().trim()
  if (v.includes('facture') || v === 'fac' || v === 'f') return 'facture'
  if (v.includes('devis') || v === 'dev' || v === 'd') return 'devis'
  if (v.includes('commande') || v === 'cmd' || v === 'c' || v.includes('order')) return 'commande'
  if (v.includes('avoir') || v === 'avo' || v === 'a' || v.includes('credit')) return 'avoir'
  if (v.includes('bl') || v.includes('bon de liv') || v.includes('livraison')) return 'bl'
  return 'facture'
}

function normalizeStatut(value: string): DocStatut {
  const v = String(value).toLowerCase().trim()
  if (v.includes('payé') || v.includes('paye') || v.includes('paid')) return 'payé'
  if (v.includes('valid') || v.includes('accept') || v.includes('signé')) return 'validé'
  if (v.includes('annul') || v.includes('cancel') || v.includes('refus')) return 'annulé'
  if (v.includes('envoy') || v.includes('sent') || v.includes('transmis')) return 'envoyé'
  return 'en_cours'
}

function parseAmount(value: string | number): number {
  if (typeof value === 'number') return value
  const cleaned = String(value).replace(/[^\d.,]/g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

function parseDate(value: string | number): string {
  if (!value) return new Date().toISOString().split('T')[0]
  const str = String(value)
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10)
  if (/^\d{2}\/\d{2}\/\d{4}/.test(str)) {
    const [d, m, y] = str.split('/')
    return `${y}-${m}-${d}`
  }
  if (/^\d{2}-\d{2}-\d{4}/.test(str)) {
    const [d, m, y] = str.split('-')
    return `${y}-${m}-${d}`
  }
  const date = new Date(str)
  if (!isNaN(date.getTime())) return date.toISOString().split('T')[0]
  return new Date().toISOString().split('T')[0]
}

export function mapRowsToDocuments(
  rows: Record<string, string | number>[],
  mapping: ColumnMapping,
  defaultType: DocType = 'facture'
): Omit<Document, 'id' | 'created_at'>[] {
  return rows.map(row => {
    const doc: Omit<Document, 'id' | 'created_at'> = {
      type: mapping.type ? normalizeType(String(row[mapping.type] || '')) : defaultType,
      date: parseDate(row[mapping.date]),
      commercial_nom: String(row[mapping.commercial_nom] || '').trim(),
      client: String(row[mapping.client] || '').trim(),
      montant_ht: parseAmount(row[mapping.montant_ht]),
      statut: mapping.statut ? normalizeStatut(String(row[mapping.statut] || '')) : 'en_cours',
    }

    if (mapping.montant_ttc && row[mapping.montant_ttc]) {
      doc.montant_ttc = parseAmount(row[mapping.montant_ttc])
    } else {
      doc.montant_ttc = Math.round(doc.montant_ht * 1.2 * 100) / 100
    }

    if (mapping.numero && row[mapping.numero]) {
      doc.numero = String(row[mapping.numero])
    }

    if (mapping.client_numero && row[mapping.client_numero]) {
      doc.client_numero = String(row[mapping.client_numero])
    }

    if (mapping.piece_transformee && row[mapping.piece_transformee]) {
      doc.piece_transformee = String(row[mapping.piece_transformee])
    }

    if (mapping.commission && row[mapping.commission]) {
      doc.commission = parseAmount(row[mapping.commission])
    }

    if (mapping.notes && row[mapping.notes]) {
      doc.notes = String(row[mapping.notes])
    }

    return doc
  }).filter(d => d.commercial_nom && d.client && d.montant_ht > 0)
}
