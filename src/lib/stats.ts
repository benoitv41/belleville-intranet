import { Document, KpiData, CommercialStats } from './types'
import { format, parseISO, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { fr } from 'date-fns/locale'

export function computeKpis(docs: Document[]): KpiData {
  const now = new Date()
  const startThisMonth = startOfMonth(now)
  const endThisMonth = endOfMonth(now)
  const startLastMonth = startOfMonth(subMonths(now, 1))
  const endLastMonth = endOfMonth(subMonths(now, 1))

  const factures = docs.filter(d => d.type === 'facture' && d.statut !== 'annulé')
  const devis = docs.filter(d => d.type === 'devis')
  const commandes = docs.filter(d => d.type === 'commande')

  const caTotal = factures.reduce((sum, d) => sum + d.montant_ht, 0)

  const facturesMois = factures.filter(d => {
    const date = parseISO(d.date)
    return isWithinInterval(date, { start: startThisMonth, end: endThisMonth })
  })
  const facturesLastMonth = factures.filter(d => {
    const date = parseISO(d.date)
    return isWithinInterval(date, { start: startLastMonth, end: endLastMonth })
  })

  const caMois = facturesMois.reduce((sum, d) => sum + d.montant_ht, 0)
  const caLastMonth = facturesLastMonth.reduce((sum, d) => sum + d.montant_ht, 0)

  const evolutionCa = caLastMonth > 0 ? Math.round(((caMois - caLastMonth) / caLastMonth) * 100) : 0

  const devisValides = devis.filter(d => d.statut === 'validé').length
  const tauxConversion = devis.length > 0 ? Math.round((devisValides / devis.length) * 100) : 0

  return {
    caTotal,
    caMois,
    nbFactures: factures.length,
    nbDevis: devis.length,
    nbCommandes: commandes.length,
    tauxConversion,
    evolutionCa,
  }
}

export function caParCommercial(docs: Document[]): CommercialStats[] {
  const map: Record<string, CommercialStats> = {}

  docs.forEach(doc => {
    if (!map[doc.commercial_nom]) {
      map[doc.commercial_nom] = { nom: doc.commercial_nom, ca: 0, devis: 0, commandes: 0, factures: 0, tauxConversion: 0 }
    }
    if (doc.type === 'facture' && doc.statut !== 'annulé') {
      map[doc.commercial_nom].ca += doc.montant_ht
      map[doc.commercial_nom].factures++
    }
    if (doc.type === 'devis') map[doc.commercial_nom].devis++
    if (doc.type === 'commande') map[doc.commercial_nom].commandes++
  })

  return Object.values(map).map(s => ({
    ...s,
    tauxConversion: s.devis > 0 ? Math.round((s.commandes / s.devis) * 100) : 0,
  })).sort((a, b) => b.ca - a.ca)
}

export function caMensuel(docs: Document[], months = 12) {
  const result: Record<string, number> = {}

  for (let i = months - 1; i >= 0; i--) {
    const d = subMonths(new Date(), i)
    const key = format(d, 'yyyy-MM')
    result[key] = 0
  }

  docs.filter(d => d.type === 'facture' && d.statut !== 'annulé').forEach(doc => {
    const key = doc.date.slice(0, 7)
    if (key in result) result[key] += doc.montant_ht
  })

  return Object.entries(result).map(([month, ca]) => ({
    month: format(parseISO(`${month}-01`), 'MMM yy', { locale: fr }),
    ca: Math.round(ca),
  }))
}

export function repartitionTypes(docs: Document[]) {
  const counts = { facture: 0, devis: 0, commande: 0, avoir: 0 }
  docs.forEach(d => { if (d.type in counts) counts[d.type as keyof typeof counts]++ })
  return [
    { name: 'Factures', value: counts.facture, color: '#3B82F6' },
    { name: 'Devis', value: counts.devis, color: '#F59E0B' },
    { name: 'Commandes', value: counts.commande, color: '#10B981' },
    { name: 'Avoirs', value: counts.avoir, color: '#8B5CF6' },
  ].filter(d => d.value > 0)
}

export function pipelineParCommercial(docs: Document[]) {
  const map: Record<string, { devis: number; commandes: number; factures: number }> = {}

  docs.forEach(doc => {
    if (!map[doc.commercial_nom]) {
      map[doc.commercial_nom] = { devis: 0, commandes: 0, factures: 0 }
    }
    if (doc.type === 'devis' && doc.statut !== 'annulé') map[doc.commercial_nom].devis++
    if (doc.type === 'commande' && doc.statut !== 'annulé') map[doc.commercial_nom].commandes++
    if (doc.type === 'facture' && doc.statut !== 'annulé') map[doc.commercial_nom].factures++
  })

  return Object.entries(map).map(([nom, data]) => ({ nom, ...data }))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}
