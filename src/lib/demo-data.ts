import { Document, Commercial, DocType, DocStatut } from './types'

export const DEMO_COMMERCIAUX: Commercial[] = [
  { id: '1', nom: 'Alice Martin', email: 'alice@belleville.fr', objectif_mensuel: 50000 },
  { id: '2', nom: 'Bob Dupont', email: 'bob@belleville.fr', objectif_mensuel: 45000 },
  { id: '3', nom: 'Claire Bernard', email: 'claire@belleville.fr', objectif_mensuel: 60000 },
  { id: '4', nom: 'David Moreau', email: 'david@belleville.fr', objectif_mensuel: 40000 },
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export const DEMO_DOCUMENTS: Document[] = (() => {
  const docs: Document[] = []
  const commerciaux = ['Alice Martin', 'Bob Dupont', 'Claire Bernard', 'David Moreau']
  const clients = [
    'ACME Corp', 'TechStart SAS', 'Industries Réunies', 'Groupe Leblanc',
    'SAS Horizon', 'Duplex SA', 'Maison Tremblay', 'BTP Solutions', 'Négoce Plus', 'Élec Pro 44',
  ]
  const types: DocType[] = ['facture', 'devis', 'commande', 'avoir']
  const statuts: DocStatut[] = ['en_cours', 'validé', 'annulé', 'payé', 'envoyé']
  const typeWeights = [0.35, 0.35, 0.25, 0.05]
  const statutWeights = [0.1, 0.4, 0.1, 0.3, 0.1]

  for (let i = 0; i < 180; i++) {
    const r1 = seededRandom(i * 7 + 1)
    const r2 = seededRandom(i * 7 + 2)
    const r3 = seededRandom(i * 7 + 3)
    const r4 = seededRandom(i * 7 + 4)
    const r5 = seededRandom(i * 7 + 5)
    const r6 = seededRandom(i * 7 + 6)

    const daysBack = Math.floor(r1 * 365)
    const date = new Date('2026-06-04')
    date.setDate(date.getDate() - daysBack)

    let typeRand = r2
    let typeIdx = 0
    for (let t = 0; t < typeWeights.length; t++) {
      typeRand -= typeWeights[t]
      if (typeRand <= 0) { typeIdx = t; break }
      typeIdx = t
    }

    let statutRand = r3
    let statutIdx = 0
    for (let s = 0; s < statutWeights.length; s++) {
      statutRand -= statutWeights[s]
      if (statutRand <= 0) { statutIdx = s; break }
      statutIdx = s
    }

    const montant_ht = Math.round((r4 * 24500 + 500) * 100) / 100
    const type = types[typeIdx]
    const prefix = type === 'facture' ? 'FAC' : type === 'devis' ? 'DEV' : type === 'commande' ? 'CMD' : 'AVO'
    const year = date.getFullYear().toString().slice(2)

    docs.push({
      id: String(i + 1),
      type,
      numero: `${prefix}-${year}${String(i + 1).padStart(4, '0')}`,
      date: date.toISOString().split('T')[0],
      commercial_nom: commerciaux[Math.floor(r5 * commerciaux.length)],
      client: clients[Math.floor(r6 * clients.length)],
      montant_ht,
      montant_ttc: Math.round(montant_ht * 1.2 * 100) / 100,
      statut: statuts[statutIdx],
    })
  }

  return docs.sort((a, b) => b.date.localeCompare(a.date))
})()
