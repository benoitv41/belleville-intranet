export type DocType = 'facture' | 'devis' | 'commande' | 'avoir'
export type DocStatut = 'en_cours' | 'validé' | 'annulé' | 'payé' | 'envoyé'

export interface Document {
  id: string
  type: DocType
  numero?: string
  date: string
  commercial_nom: string
  client: string
  montant_ht: number
  montant_ttc?: number
  statut: DocStatut
  notes?: string
  created_at?: string
}

export interface Commercial {
  id: string
  nom: string
  email?: string
  objectif_mensuel: number
  created_at?: string
}

export interface ColumnMapping {
  commercial_nom: string
  client: string
  date: string
  montant_ht: string
  montant_ttc?: string
  type?: string
  numero?: string
  statut?: string
  notes?: string
}

export interface KpiData {
  caTotal: number
  caMois: number
  nbFactures: number
  nbDevis: number
  nbCommandes: number
  tauxConversion: number
  evolutionCa: number
}

export interface CommercialStats {
  nom: string
  ca: number
  devis: number
  commandes: number
  factures: number
  tauxConversion: number
}
