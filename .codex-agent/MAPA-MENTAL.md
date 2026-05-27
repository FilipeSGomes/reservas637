# Mapa Mental Técnico

> Atualizado em 2026-05-26.

## Arquitetura atual (legado — HTML estático)

Cliente web estático → agenda → pré-reserva → cadastro → pagamento → webhook Apps Script → Google Sheets.

### Módulos ativos

- Reserva pública (`index.html` + `app.js`)
- Painel admin (`admin/index.html` + `app.js`)
- Configuração de cliente (`config/637.config.js`, `config/euphoria.config.js`)
- Registry multi-cliente (`config/clients.js`)
- Loader de cliente (`config/config-loader.js`)
- Template de cliente (`config/_client-template.config.js`)
- **Sistema de aparência** (novo): upload de logo, extração de cores, cores/fontes via admin, salvo em localStorage por tenant
- Configuração dinâmica de negócio (aba `config` no Sheets — legado 637)
- Bloqueios de horário/dia
- PWA/cache (`manifest.webmanifest`, `sw.js`, `instalar.html`)

### Dependências externas (legado)

- Google Sheets (`reservas`, `bloqueios`, `config`)
- Google Apps Script (`reservation:create`, `reservation:confirm`, `block:create`, `config:update`)
- WhatsApp (`wa.me`)
- CDNs: Bootstrap e Google Fonts

---

## Arquitetura alvo (SaaS v1 — Next.js + Supabase)

Cliente Next.js (App Router) → API Routes / Server Actions → Supabase (PostgreSQL + Auth + Storage).

### Stack confirmada

- **Frontend/Backend**: Next.js 14+ (App Router)
- **Banco**: Supabase (PostgreSQL gerenciado)
- **Auth**: Supabase Auth (email + senha real por tenant)
- **Storage**: Supabase Storage (logos, assets)
- **ORM/Query**: Supabase JS client + TypeScript
- **Deploy**: Vercel (recomendado)

### Módulos alvo

- `app/[tenant]/page.tsx` — agenda pública por tenant
- `app/[tenant]/admin/page.tsx` — painel admin por tenant
- `app/[tenant]/admin/login/page.tsx` — login por tenant
- `middleware.ts` — resolução de tenant por hostname/subdomínio
- `lib/supabase/client.ts` — Supabase browser client
- `lib/supabase/server.ts` — Supabase server client (SSR, nunca expõe service key)
- `lib/tenant.ts` — helpers de resolução e carregamento de tenant

### Schema do banco (Supabase)

- `tenants` — slug, nome, timezone
- `tenant_domains` — hostname → tenant (suporte a domínios customizados)
- `tenant_settings` — aparência (cores, fontes, logo_url), contato, horário, pricing, textos
- `tenant_memberships` — user → tenant + role
- `courts` — por tenant
- `reservations` — por tenant, com snapshot de preço
- `blocks` — por tenant (faixa ou dia inteiro)
- `audit_events` — log de ações admin

### Regras de segurança

- Tenant resolvido pelo host da requisição (hostname → slug), nunca por parâmetro do cliente.
- Row Level Security ativa em todas as tabelas com tenant_id.
- Service role key do Supabase nunca vai ao browser — apenas em Server Actions/API Routes.
- Admin autenticado via Supabase Auth; JWT contém tenant_id como custom claim.
- RLS: leitura pública de agenda/quadras; escrita apenas para usuário autenticado do mesmo tenant.

---

## Acoplamentos críticos (legado — a eliminar com migração)

- Ordem/nomes de colunas nas abas do Google Sheets
- Contrato `{ action, payload }` do webhook Apps Script
- IDs do DOM referenciados em `app.js`
- Versionamento de cache no `sw.js`
- Senha admin hardcoded no frontend

## Pontos de atenção na migração

- 637 continua em Google Sheets até ser migrado explicitamente.
- Manter o HTML estático estável enquanto Next.js não atingir paridade funcional.
- Novos tenants entram direto no Supabase; 637 é caso especial legado.
