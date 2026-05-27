# Roadmap Next.js + Supabase

> Atualizado em 2026-05-26. Decisões técnicas confirmadas.

## Decisão técnica confirmada

**Stack alvo**: Next.js (App Router) + Supabase (PostgreSQL + Auth + Storage)

- Frontend/Backend: Next.js 14+ — rotas públicas e admin por tenant
- Banco: Supabase PostgreSQL gerenciado com Row Level Security
- Auth: Supabase Auth (email + senha real por tenant, JWT com custom claim de tenant_id)
- Storage: Supabase Storage para logos e assets por tenant
- Deploy: Vercel (recomendado para integração com Next.js)

Motivação: resolve multi-tenant real com isolamento de dados, elimina Google Sheets, permite onboarding genérico de cliente sem tocar no código.

## Fase 0 — Concluída (HTML estático, branch feature/microSaas)

Entregue:
- Registry multi-cliente e config loader
- Config por arquivo para 637 e Euphoria (placeholders)
- Sistema de aparência: upload de logo, extração de cores, cores/fontes via admin → salvo em localStorage
- Roteamento por subdomínio (hostname → tenant)
- PWA multi-tenant funcional

## Fase 1 — Em andamento (Next.js scaffold + Supabase)

Objetivo: criar o projeto Next.js dentro do mesmo repo, com Supabase conectado e tenant resolution funcionando.

Entregas:
- `next-app/` com scaffold Next.js + Supabase SSR
- `middleware.ts` resolvendo tenant por hostname
- `next-app/supabase/schema.sql` com schema completo
- `next-app/supabase/rls.sql` com políticas RLS
- Página pública `[tenant]` carregando config do banco
- Painel admin `[tenant]/admin` com auth Supabase
- Aparência (cores, fontes, logo) lida do banco em `tenant_settings`
- Upload de logo para Supabase Storage no admin

## Fase 2 — Operação no banco

Substituir Google Sheets por Supabase nas operações:

- Listar/criar reservas: `reservations` table
- Listar/criar bloqueios: `blocks` table
- Confirmar reserva: Server Action autenticada
- Configurar preços/textos: `tenant_settings` table

Manter adaptador de importação de Google Sheets para migrar 637.

## Fase 3 — Onboarding e produto

- Tela interna de onboarding de novo cliente (sem mexer no repo)
- Tabela `tenant_memberships` com papéis (owner, admin, atendente)
- Domínios customizados via `tenant_domains`
- Audit log via `audit_events`
- Dashboard operacional (reservas do dia, ocupação)
- Exportação LGPD por tenant

## Fase 4 — Produto comercial

- Billing/assinatura (Stripe ou equivalente)
- Multiunidade (tenants com N unidades)
- Relatórios e gráficos
- Integrações de pagamento (gateway além do PIX manual)
- SLA documentado e suporte estruturado

## Schema do banco (tabelas principais)

```
tenants              — id, slug, name, short_name, timezone
tenant_domains       — hostname → tenant_id (custom domains)
tenant_settings      — aparência, contato, horário, pricing, textos
tenant_memberships   — user_id + tenant_id + role
courts               — por tenant
reservations         — por tenant, com snapshot de preço
blocks               — por tenant (faixa ou dia inteiro)
audit_events         — log de ações admin por tenant
```

## Regra de tenant

- Tenant resolvido pelo host da requisição: `euphoria.fisamtech.com` → slug `euphoria`
- Nunca aceitar tenant_id como parâmetro do cliente sem validar o host
- `tenant_domains` permite domínios customizados futuros
- RLS garante que cada query retorna apenas dados do tenant correto

## Risco principal

Migrar 637 para o banco antes de validar venda com novos clientes aumenta risco sem necessidade. O HTML estático de 637 deve permanecer estável como legado até que a migração seja explicitamente planejada.
