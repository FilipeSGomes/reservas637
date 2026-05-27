-- ============================================================
-- Seed: tenant 637 Cervejaria
-- Fonte: config/637.config.js (source of truth para este tenant)
-- Executar após schema.sql e rls.sql para migrar o 637 ao Supabase
-- NOTA: integrations (spreadsheetId, appsScriptWebhookUrl) são legado
--       e ficam apenas no config/637.config.js estático enquanto não migrar
-- ============================================================

-- 1. Tenant
insert into tenants (slug, name, short_name, timezone)
values ('637', '637 Cervejaria', '637', 'America/Sao_Paulo')
on conflict (slug) do nothing;

-- 2. Domínio principal
insert into tenant_domains (tenant_id, hostname, is_primary)
values (
  (select id from tenants where slug = '637'),
  '637.fisamtech.com',
  true
)
on conflict (hostname) do nothing;

-- 3. Settings (aparência + contato + horário + preços + textos)
insert into tenant_settings (
  tenant_id,
  primary_color,
  bg_color,
  font_body,
  font_heading,
  logo_url,
  whatsapp_phone,
  pix_key,
  opening_start,
  opening_end,
  slot_minutes,
  pricing,
  pix_enabled,
  billing_enabled,
  texts
)
values (
  (select id from tenants where slug = '637'),

  -- Aparência (de branding.primaryColor e branding.secondaryColor)
  '#676b2a',
  '#ece8d8',
  'Manrope',
  'Barlow Condensed',
  null,   -- logo será enviada via Supabase Storage no onboarding visual

  -- Contato (de contact)
  '5511944554650',
  '39125065823',

  -- Horário (de businessHours — fonte oficial: 637.config.js define 06:00–20:00)
  '06:00',
  '20:00',
  60,

  -- Pricing (de pricing.byCourt)
  '{
    "beachTennis": {
      "dayPrice": 80,
      "nightPrice": 100,
      "nightStart": "18:00",
      "courtIds": ["BT1", "BT2"]
    },
    "tennis": {
      "dayPrice": 37,
      "nightPrice": 57,
      "nightStart": "18:00",
      "courtIds": ["TN1", "TN2"]
    }
  }'::jsonb,

  true,
  true,

  -- Textos (de texts — subset dos campos mais usados)
  '{
    "heroEyebrow": "637 Cervejaria • Desde 2017",
    "heroTitle": "Tênis, Beach Tennis e cerveja artesanal no mesmo lugar.",
    "heroCopy": "Consulte a agenda do dia, escolha sua quadra e envie sua solicitação em menos de um minuto.",
    "heroPrimaryCta": "Reservar quadra",
    "heroHoursLabel": "Horário de funcionamento",
    "heroHoursDescription": "Blocos de 1 hora para Beach Tennis e Tênis.",
    "bookingBillingTitle": "Lançar na conta da Cervejaria",
    "bookingBillingNotice": "Sujeito a análise e aprovação pelos administradores",
    "preBookingRules": "Ao confirmar, você concorda com as regras de uso da quadra. Cancelamentos devem ser feitos com 2h de antecedência."
  }'::jsonb
)
on conflict (tenant_id) do update set
  primary_color  = excluded.primary_color,
  bg_color       = excluded.bg_color,
  whatsapp_phone = excluded.whatsapp_phone,
  pix_key        = excluded.pix_key,
  opening_start  = excluded.opening_start,
  opening_end    = excluded.opening_end,
  slot_minutes   = excluded.slot_minutes,
  pricing        = excluded.pricing,
  texts          = excluded.texts,
  updated_at     = now();

-- 4. Quadras (de courts)
insert into courts (id, tenant_id, name, type, active, sort_order)
values
  ('BT1', (select id from tenants where slug = '637'), 'Beach Tennis 1', 'beach_tennis', true, 1),
  ('BT2', (select id from tenants where slug = '637'), 'Beach Tennis 2', 'beach_tennis', true, 2),
  ('TN1', (select id from tenants where slug = '637'), 'Tênis 1',        'tennis',       true, 3),
  ('TN2', (select id from tenants where slug = '637'), 'Tênis 2',        'tennis',       true, 4)
on conflict (tenant_id, id) do update set
  name       = excluded.name,
  type       = excluded.type,
  active     = excluded.active,
  sort_order = excluded.sort_order;

-- 5. Usuário admin: criar manualmente no Supabase Auth Dashboard
--    Email: <a definir>
--    Depois executar:
--    insert into tenant_memberships (tenant_id, user_id, role)
--    values (
--      (select id from tenants where slug = '637'),
--      '<uuid do usuário criado no Auth>',
--      'admin'
--    );
