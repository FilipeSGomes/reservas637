-- ============================================================
-- Row Level Security (RLS)
-- Executar após schema.sql
-- ============================================================
-- Regra central: tenant resolvido pelo host, nunca por parâmetro do cliente.
-- RLS garante que cada query retorna apenas dados do tenant correto.
-- ============================================================

-- Helper: retorna o tenant_id do usuário autenticado atual
-- (custom claim adicionado via Supabase Auth hook ou via função de membership)
create or replace function auth_tenant_id()
returns uuid
language sql stable
as $$
  select (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
$$;

-- Helper: verifica se o usuário tem membership no tenant
create or replace function is_tenant_member(p_tenant_id uuid)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from tenant_memberships
    where tenant_id = p_tenant_id
      and user_id = auth.uid()
  );
$$;

-- ============================================================
-- tenants
-- ============================================================
alter table tenants enable row level security;

-- Qualquer um pode ler tenants ativos (necessário para o app carregar o branding)
create policy "tenants: leitura pública" on tenants
  for select using (active = true);

-- Apenas owner do tenant ou service role pode alterar
create policy "tenants: admin pode atualizar" on tenants
  for update using (is_tenant_member(id));

-- ============================================================
-- tenant_domains
-- ============================================================
alter table tenant_domains enable row level security;

create policy "tenant_domains: leitura pública" on tenant_domains
  for select using (true);

create policy "tenant_domains: admin pode gerenciar" on tenant_domains
  for all using (is_tenant_member(tenant_id));

-- ============================================================
-- tenant_settings
-- ============================================================
alter table tenant_settings enable row level security;

-- Qualquer um pode ler settings (branding público: cores, logo, textos)
create policy "tenant_settings: leitura pública" on tenant_settings
  for select using (true);

-- Apenas admin do tenant pode modificar
create policy "tenant_settings: admin pode atualizar" on tenant_settings
  for update using (is_tenant_member(tenant_id));

create policy "tenant_settings: admin pode inserir" on tenant_settings
  for insert with check (is_tenant_member(tenant_id));

-- ============================================================
-- tenant_memberships
-- ============================================================
alter table tenant_memberships enable row level security;

-- Membros podem ver seus próprios vínculos
create policy "tenant_memberships: ver próprios" on tenant_memberships
  for select using (user_id = auth.uid());

-- Apenas service role cria memberships (feito no onboarding via Server Action)
-- Nenhuma policy de insert/update para role anon/authenticated

-- ============================================================
-- courts
-- ============================================================
alter table courts enable row level security;

-- Qualquer um pode ler quadras ativas (necessário para a agenda pública)
create policy "courts: leitura pública" on courts
  for select using (active = true);

-- Admin pode gerenciar quadras do seu tenant
create policy "courts: admin pode gerenciar" on courts
  for all using (is_tenant_member(tenant_id));

-- ============================================================
-- reservations
-- ============================================================
alter table reservations enable row level security;

-- Admin pode ler todas as reservas do seu tenant
create policy "reservations: admin lê do tenant" on reservations
  for select using (is_tenant_member(tenant_id));

-- Qualquer um pode criar reserva (fluxo público de booking)
create policy "reservations: inserção pública" on reservations
  for insert with check (true);

-- Apenas admin pode atualizar (confirmar, cancelar)
create policy "reservations: admin pode atualizar" on reservations
  for update using (is_tenant_member(tenant_id));

-- ============================================================
-- blocks
-- ============================================================
alter table blocks enable row level security;

-- Qualquer um pode ler bloqueios (necessário para a agenda pública mostrar indisponível)
create policy "blocks: leitura pública" on blocks
  for select using (true);

-- Apenas admin cria/remove bloqueios
create policy "blocks: admin pode gerenciar" on blocks
  for all using (is_tenant_member(tenant_id));

-- ============================================================
-- audit_events
-- ============================================================
alter table audit_events enable row level security;

-- Apenas admin do tenant lê seu próprio audit log
create policy "audit_events: admin lê do tenant" on audit_events
  for select using (is_tenant_member(tenant_id));

-- Inserção via service role (Server Actions) — nenhuma policy de insert para anon
