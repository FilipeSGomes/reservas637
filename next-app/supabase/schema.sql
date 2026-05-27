-- ============================================================
-- Schema: reservas SaaS multi-tenant
-- Banco: Supabase (PostgreSQL)
-- Executar no SQL Editor do Supabase após criar o projeto
-- ============================================================

-- Extensões necessárias (habilitadas por padrão no Supabase)
create extension if not exists "uuid-ossp";

-- ============================================================
-- TENANTS
-- ============================================================

create table if not exists tenants (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,         -- ex: "euphoria", "arena637"
  name       text not null,                -- ex: "Espaço Euphoria"
  short_name text,                         -- ex: "Euphoria"
  timezone   text not null default 'America/Sao_Paulo',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table tenants is 'Clientes da plataforma. Cada tenant é um espaço esportivo.';

-- ============================================================
-- TENANT_DOMAINS
-- ============================================================

create table if not exists tenant_domains (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  hostname   text unique not null,          -- ex: "euphoria.fisamtech.com", "reservas.espaco.com.br"
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table tenant_domains is 'Hostnames mapeados a tenants. Suporta subdomínios fisamtech.com e domínios customizados.';

-- ============================================================
-- TENANT_SETTINGS
-- ============================================================

create table if not exists tenant_settings (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid unique not null references tenants(id) on delete cascade,

  -- Aparência
  primary_color  text,                     -- ex: "#245c4f"
  bg_color       text,                     -- ex: "#ece8d8"
  font_body      text,                     -- ex: "Manrope"
  font_heading   text,                     -- ex: "Barlow Condensed"
  logo_url       text,                     -- URL pública no Supabase Storage

  -- Contato
  whatsapp_phone text,                     -- ex: "5511944554650"
  pix_key        text,

  -- Horários de funcionamento
  opening_start  time not null default '07:00',
  opening_end    time not null default '22:00',
  slot_minutes   integer not null default 60,

  -- Preços (JSONB flexível para N grupos de quadras)
  -- ex: {"beachTennis": {"dayPrice": 80, "nightPrice": 100, "nightStart": "18:00"}}
  pricing        jsonb not null default '{}',

  -- Pagamentos
  pix_enabled     boolean not null default true,
  billing_enabled boolean not null default true,

  -- Textos customizados (todos os labels do app)
  texts          jsonb not null default '{}',

  updated_at     timestamptz not null default now(),
  updated_by     uuid references auth.users(id)
);

comment on table tenant_settings is 'Configurações de aparência, contato, horários, preços e textos por tenant.';

-- ============================================================
-- TENANT_MEMBERSHIPS
-- ============================================================

create table if not exists tenant_memberships (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'admin' check (role in ('owner', 'admin', 'attendant')),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

comment on table tenant_memberships is 'Vínculo entre usuários Supabase Auth e tenants, com papel.';

-- ============================================================
-- COURTS
-- ============================================================

create table if not exists courts (
  id          text not null,               -- ex: "BT1", "TN1"
  tenant_id   uuid not null references tenants(id) on delete cascade,
  name        text not null,               -- ex: "Beach Tennis 1"
  type        text not null,               -- ex: "beach_tennis", "tennis"
  active      boolean not null default true,
  sort_order  integer not null default 0,
  primary key (tenant_id, id)
);

comment on table courts is 'Quadras/espaços por tenant. ID é texto curto definido pelo operador.';

-- ============================================================
-- RESERVATIONS
-- ============================================================

create table if not exists reservations (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references tenants(id) on delete cascade,
  court_id         text not null,
  date             date not null,
  time             text not null,          -- ex: "08:00"

  -- Cliente
  customer_name    text,
  customer_phone   text,
  customer_cpf     text,

  -- Pagamento
  payment_method   text,                   -- "pix" | "billing"
  amount           numeric(10, 2),
  pricing_snapshot jsonb,                  -- snapshot do preço no momento da reserva

  -- Status
  status           text not null default 'pendente'
                   check (status in ('pendente', 'confirmado', 'faturado', 'bloqueado', 'cancelado')),

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  confirmed_by     uuid references auth.users(id),
  confirmed_at     timestamptz
);

comment on table reservations is 'Reservas de horário por tenant. Inclui snapshot de preço para auditoria.';

create index if not exists reservations_tenant_date_idx on reservations(tenant_id, date);

-- ============================================================
-- BLOCKS
-- ============================================================

create table if not exists blocks (
  id         uuid primary key default gen_random_uuid(),
  tenant_id  uuid not null references tenants(id) on delete cascade,
  court_id   text,                         -- null = todas as quadras
  date       date not null,
  start_time text,                         -- null = dia inteiro
  end_time   text,                         -- null = dia inteiro
  type       text,                         -- "Aula", "Evento particular", "Manutenção", "Day use"
  reason     text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

comment on table blocks is 'Bloqueios de horário ou dia inteiro por tenant.';

create index if not exists blocks_tenant_date_idx on blocks(tenant_id, date);

-- ============================================================
-- AUDIT_EVENTS
-- ============================================================

create table if not exists audit_events (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid references tenants(id),
  user_id     uuid references auth.users(id),
  action      text not null,               -- ex: "reservation:confirm", "block:create", "settings:update"
  entity_type text,                        -- ex: "reservation", "block", "tenant_settings"
  entity_id   uuid,
  payload     jsonb,
  created_at  timestamptz not null default now()
);

comment on table audit_events is 'Log de auditoria de ações administrativas por tenant.';

create index if not exists audit_events_tenant_idx on audit_events(tenant_id, created_at desc);
