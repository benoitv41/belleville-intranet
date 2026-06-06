export interface Opportunite {
  id: string
  titre: string
  client?: string
  client_numero?: string
  commercial_nom?: string
  montant_ht?: number
  etape_id: number
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface CrmEtape {
  id: number
  label: string
  id_externe?: number
  color: string
  bgClass: string
  textClass: string
  borderClass: string
  lost?: boolean
  terminal?: boolean
}

export const CRM_ETAPES: CrmEtape[] = [
  { id: 0,  label: 'Devis à faire',                   color: 'slate',  bgClass: 'bg-slate-100',  textClass: 'text-slate-700',  borderClass: 'border-slate-200' },
  { id: 1,  label: 'Devis préparé',      id_externe: 28, color: 'slate',  bgClass: 'bg-slate-100',  textClass: 'text-slate-700',  borderClass: 'border-slate-200' },
  { id: 2,  label: 'Devis validé',       id_externe: 29, color: 'amber',  bgClass: 'bg-amber-50',   textClass: 'text-amber-700',  borderClass: 'border-amber-200' },
  { id: 3,  label: 'Devis envoyé',       id_externe: 18, color: 'amber',  bgClass: 'bg-amber-50',   textClass: 'text-amber-700',  borderClass: 'border-amber-200' },
  { id: 4,  label: 'Devis accepté',      id_externe: 19, color: 'blue',   bgClass: 'bg-blue-50',    textClass: 'text-blue-700',   borderClass: 'border-blue-200' },
  { id: 5,  label: 'En attente de création', id_externe: 20, color: 'blue', bgClass: 'bg-blue-50',  textClass: 'text-blue-700',   borderClass: 'border-blue-200' },
  { id: 6,  label: 'En cours de création',   id_externe: 21, color: 'indigo', bgClass: 'bg-indigo-50', textClass: 'text-indigo-700', borderClass: 'border-indigo-200' },
  { id: 7,  label: 'Pièce(s) créée(s)', id_externe: 22, color: 'indigo', bgClass: 'bg-indigo-50',  textClass: 'text-indigo-700', borderClass: 'border-indigo-200' },
  { id: 8,  label: 'En attente des fournisseurs', id_externe: 23, color: 'purple', bgClass: 'bg-purple-50', textClass: 'text-purple-700', borderClass: 'border-purple-200' },
  { id: 9,  label: 'Commande fournisseurs reçues', id_externe: 31, color: 'purple', bgClass: 'bg-purple-50', textClass: 'text-purple-700', borderClass: 'border-purple-200' },
  { id: 10, label: 'Commande en préparation', id_externe: 24, color: 'teal', bgClass: 'bg-teal-50', textClass: 'text-teal-700', borderClass: 'border-teal-200' },
  { id: 11, label: 'Commande prête',     id_externe: 25, color: 'teal',  bgClass: 'bg-teal-50',    textClass: 'text-teal-700',   borderClass: 'border-teal-200' },
  { id: 12, label: 'Commande partiellement livrée', color: 'green', bgClass: 'bg-green-50', textClass: 'text-green-700', borderClass: 'border-green-200' },
  { id: 13, label: 'Commande livrée',                color: 'green', bgClass: 'bg-green-50', textClass: 'text-green-700', borderClass: 'border-green-200', terminal: true },
  { id: -1, label: 'Devis refusé',                   color: 'red',   bgClass: 'bg-red-50',     textClass: 'text-red-700',    borderClass: 'border-red-200',   lost: true },
]

export const ETAPE_MAP = Object.fromEntries(CRM_ETAPES.map(e => [e.id, e]))

export const ETAPES_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, -1]
