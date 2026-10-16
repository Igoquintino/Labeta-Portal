-- ==============================================================================
-- CORREÇÃO DE POLÍTICA RLS (Evitar recursão infinita na tabela admins)
-- Execute este script no SQL Editor do Supabase
-- ==============================================================================

-- 1. Criar função auxiliar segura (security definer) para checar se usuário é admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admins
    where email = auth.jwt() ->> 'email'
  );
$$;

-- 2. Recriar políticas de 'admins'
drop policy if exists "Permitir leitura pública da whitelist de admins" on public.admins;
drop policy if exists "Apenas admins autenticados gerenciam a whitelist" on public.admins;

create policy "Permitir leitura pública da whitelist de admins"
    on public.admins for select
    using (true);

create policy "Apenas admins autenticados gerenciam a whitelist"
    on public.admins for all
    using (public.is_admin());

-- 3. Atualizar políticas das demais tabelas para usar public.is_admin()
-- NEWS
drop policy if exists "Apenas admins inserem notícias" on public.news;
drop policy if exists "Apenas admins atualizam notícias" on public.news;
drop policy if exists "Apenas admins removem notícias" on public.news;

create policy "Apenas admins inserem notícias"
    on public.news for insert
    with check (public.is_admin());

create policy "Apenas admins atualizam notícias"
    on public.news for update
    using (public.is_admin());

create policy "Apenas admins removem notícias"
    on public.news for delete
    using (public.is_admin());

-- MEMBERS
drop policy if exists "Apenas admins gerenciam membros" on public.members;
create policy "Apenas admins gerenciam membros"
    on public.members for all
    using (public.is_admin());

-- WORKS
drop policy if exists "Apenas admins gerenciam trabalhos" on public.works;
create policy "Apenas admins gerenciam trabalhos"
    on public.works for all
    using (public.is_admin());

-- EQUIPMENT
drop policy if exists "Apenas admins gerenciam equipamentos" on public.equipment;
create policy "Apenas admins gerenciam equipamentos"
    on public.equipment for all
    using (public.is_admin());

-- LAB_SPACES
drop policy if exists "Apenas admins gerenciam espaços do laboratório" on public.lab_spaces;
create policy "Apenas admins gerenciam espaços do laboratório"
    on public.lab_spaces for all
    using (public.is_admin());

-- LAB_PROTOCOLS
drop policy if exists "Apenas admins gerenciam protocolos do laboratório" on public.lab_protocols;
create policy "Apenas admins gerenciam protocolos do laboratório"
    on public.lab_protocols for all
    using (public.is_admin());
