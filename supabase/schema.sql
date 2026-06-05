-- Belleville Intranet — Schéma Supabase
-- Exécuter dans l'éditeur SQL de votre projet Supabase

create table if not exists commerciaux (
  id uuid default gen_random_uuid() primary key,
  nom text not null unique,
  email text,
  objectif_mensuel numeric default 0,
  created_at timestamp with time zone default now()
);

create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('facture', 'devis', 'commande', 'avoir', 'bl')),
  numero text,
  date date not null,
  commercial_nom text not null,
  client text not null,
  client_numero text,
  piece_origine text,
  montant_ht numeric not null default 0,
  montant_ttc numeric,
  commission numeric,
  statut text default 'en_cours' check (statut in ('en_cours', 'validé', 'annulé', 'payé', 'envoyé')),
  notes text,
  created_at timestamp with time zone default now()
);

-- Index pour les performances
create index if not exists documents_date_idx on documents(date desc);
create index if not exists documents_commercial_idx on documents(commercial_nom);
create index if not exists documents_type_idx on documents(type);

-- RLS (Row Level Security) — désactivé pour l'intranet sans auth
-- Si vous ajoutez de l'authentification, activez RLS et ajoutez des policies
alter table commerciaux disable row level security;
alter table documents disable row level security;
