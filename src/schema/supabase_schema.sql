-- ==============================================================================
-- SCHEMA SUPABASE: PORTAL LABETA (Laboratório de Ecologia e Taxonomia de Algas)
-- Execute este script no SQL Editor do Dashboard do Supabase
-- ==============================================================================

-- 1. EXTENSÕES
create extension if not exists "uuid-ossp";

-- 2. TABELA: admins (Whitelist de Administradores)
create table if not exists public.admins (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    role text default 'editor',
    created_at timestamp with time zone default now()
);

-- RLS para admins
alter table public.admins enable row level security;

create policy "Permitir leitura pública da whitelist de admins"
    on public.admins for select
    using (true);

create policy "Apenas admins autenticados gerenciam a whitelist"
    on public.admins for all
    using (auth.jwt() ->> 'email' in (select email from public.admins));

-- 3. TABELA: news (Comunicados e Radar Científico)
create table if not exists public.news (
    id uuid primary key default uuid_generate_v4(),
    type text not null check (type in ('announcement', 'radar')),
    title text not null,
    date text not null,
    tag text,
    content text,
    journal text,
    year integer,
    authors text,
    url text,
    doi text,
    created_at timestamp with time zone default now()
);

-- RLS para news
alter table public.news enable row level security;

create policy "Permitir leitura pública de notícias"
    on public.news for select
    using (true);

create policy "Apenas admins inserem notícias"
    on public.news for insert
    with check (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Apenas admins atualizam notícias"
    on public.news for update
    using (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Apenas admins removem notícias"
    on public.news for delete
    using (auth.jwt() ->> 'email' in (select email from public.admins));

-- 4. TABELA: members (Pessoas, Pesquisadores e Alunos)
create table if not exists public.members (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    role text not null,
    category text not null check (category in ('coordenacao', 'pesquisadores', 'discentes')),
    research_area text,
    bio text,
    email text,
    lattes text,
    avatar text,
    created_at timestamp with time zone default now()
);

-- RLS para members
alter table public.members enable row level security;

create policy "Permitir leitura pública de membros"
    on public.members for select
    using (true);

create policy "Apenas admins gerenciam membros"
    on public.members for all
    using (auth.jwt() ->> 'email' in (select email from public.admins));

-- 5. TABELA: works (Trabalhos, Artigos e Projetos de Pesquisa)
create table if not exists public.works (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    status text not null check (status in ('em_andamento', 'concluidos')),
    authors text not null,
    year text not null,
    category text not null,
    summary text,
    tags text[] default '{}',
    doi text,
    external_url text,
    created_at timestamp with time zone default now()
);

-- RLS para works
alter table public.works enable row level security;

create policy "Permitir leitura pública de trabalhos"
    on public.works for select
    using (true);

create policy "Apenas admins gerenciam trabalhos"
    on public.works for all
    using (auth.jwt() ->> 'email' in (select email from public.admins));

-- 6. TABELA: equipment (Catálogo de Equipamentos e Bancadas)
create table if not exists public.equipment (
    id uuid primary key default uuid_generate_v4(),
    code text not null unique,
    name text not null,
    category text not null,
    status text not null default 'disponivel' check (status in ('disponivel', 'manutencao_preventiva', 'indisponivel')),
    capacity text,
    description text,
    requirements text[] default '{}',
    created_at timestamp with time zone default now()
);

-- RLS para equipment
alter table public.equipment enable row level security;

create policy "Permitir leitura pública de equipamentos"
    on public.equipment for select
    using (true);

create policy "Apenas admins gerenciam equipamentos"
    on public.equipment for all
    using (auth.jwt() ->> 'email' in (select email from public.admins));

-- 7. TABELA: lab_spaces (Espaços Analíticos do Laboratório)
create table if not exists public.lab_spaces (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    tag text,
    description text,
    equipment text[] default '{}',
    image text,
    created_at timestamp with time zone default now()
);

-- RLS para lab_spaces
alter table public.lab_spaces enable row level security;

create policy "Permitir leitura pública de espaços do laboratório"
    on public.lab_spaces for select
    using (true);

create policy "Apenas admins gerenciam espaços do laboratório"
    on public.lab_spaces for all
    using (auth.jwt() ->> 'email' in (select email from public.admins));

-- 8. TABELA: lab_protocols (Rotina Metodológica / Linha do Tempo)
create table if not exists public.lab_protocols (
    id uuid primary key default uuid_generate_v4(),
    step text not null,
    name text not null,
    details text,
    created_at timestamp with time zone default now()
);

-- RLS para lab_protocols
alter table public.lab_protocols enable row level security;

create policy "Permitir leitura pública de protocolos do laboratório"
    on public.lab_protocols for select
    using (true);

create policy "Apenas admins gerenciam protocolos do laboratório"
    on public.lab_protocols for all
    using (auth.jwt() ->> 'email' in (select email from public.admins));
