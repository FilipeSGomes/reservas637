# Roadmap Next.js + banco

Minha recomendacao: migrar em fases, sem jogar fora o que ja funciona.

## Decisao tecnica

Usar Next.js faz sentido para transformar o produto em microSaaS real:

- frontend publico por cliente
- admin autenticado
- API propria
- banco relacional
- isolamento por tenant
- deploy com preview por branch
- tenant resolvido por subdominio/host

Banco recomendado para a primeira versao: PostgreSQL.

## Fase 0 - Agora, antes da reuniao

Objetivo: demonstrar multi-cliente sem reescrita.

Entregue nesta branch:

- registry de clientes
- config loader por client
- config demo para segundo cliente
- admin/publico usando a config selecionada
- documentacao de operacao multi-cliente

## Fase 1 - Next.js shell

Criar novo app Next.js mantendo o contrato visual e funcional:

- app/[tenant]/page.tsx para agenda publica
- app/[tenant]/admin/page.tsx para admin
- componentes separados para agenda, reserva, pagamento e bloqueios
- config inicial carregada por tenant
- sem mudar ainda a regra de negocio

## Fase 2 - API propria

Substituir Apps Script por rotas API:

- GET /api/:tenant/agenda?date=YYYY-MM-DD
- POST /api/:tenant/reservas
- POST /api/:tenant/reservas/:id/confirmar
- POST /api/:tenant/bloqueios
- PATCH /api/:tenant/config

Manter adaptador de importacao/exportacao Google Sheets para transicao.

## Fase 3 - Banco

Modelo inicial:

- tenants
- tenant_domains
- tenant_settings
- courts
- reservations
- blocks
- users
- audit_events

Regras importantes:

- toda query filtrada por tenant_id
- tenant resolvido pelo host da requisicao, nunca apenas por parametro do cliente
- status e pagamento normalizados
- reserva com snapshot de preco
- auditoria para confirmacao, bloqueio e alteracao de configuracao

## Fase 4 - Produto SaaS

- login por usuario
- papeis: owner, admin, atendente
- dominios por tenant
- onboarding de novo cliente
- billing/assinatura
- dashboard operacional
- backups e exportacao LGPD

## Risco principal

Migrar tudo antes de validar venda aumenta risco sem necessidade. A branch atual deve servir como ponte comercial; Next.js + banco deve ser tratado como produto v2, com backlog e migracao controlada.
