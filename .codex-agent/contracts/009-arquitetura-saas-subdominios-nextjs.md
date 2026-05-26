# Contrato 009 - Arquitetura SaaS com subdominios no Next.js

## Status

RASCUNHO - planejamento para SaaS v1.

## Objetivo

Desenhar a arquitetura alvo em Next.js + PostgreSQL para operar tenants por subdominio, substituindo gradualmente config por arquivo e Google Sheets/Apps Script.

## Regra de tenant

O tenant deve ser resolvido pelo host da requisicao:

- 637.fisamtech.com -> tenant slug 637
- euphoria.fisamtech.com -> tenant slug euphoria
- dominios customizados futuros -> tabela tenant_domains

## Componentes alvo

- Middleware Next.js para resolver tenant por host.
- Tabela tenants.
- Tabela tenant_domains.
- Tabela tenant_settings.
- Tabelas courts, reservations, blocks, users, memberships, audit_events.
- API sempre filtrada por tenant_id.
- Admin autenticado por tenant.

## Arquivos permitidos para leitura

- NEXTJS-DB-ROADMAP.md
- PLANO-EXECUCAO-SAAS.md
- PLANO-SOLO-FOUNDER-SAAS.md
- SAAS-PLANEJAMENTO.md
- .codex-agent/GAPS.md
- .codex-agent/DECISOES.md

## Arquivos permitidos para alteracao

- NEXTJS-DB-ROADMAP.md
- PLANO-EXECUCAO-SAAS.md
- SAAS-PLANEJAMENTO.md
- .codex-agent/DECISOES.md
- .codex-agent/GAPS.md
- .codex-agent/CHANGELOG-AGENTE.md

## Plano de execucao

1. Definir resolucao de tenant por host como regra central.
2. Definir schema minimo multi-tenant.
3. Definir endpoints SaaS v1.
4. Definir estrategia de migracao dos clientes do modelo Sheets para PostgreSQL.
5. Definir seguranca minima: auth, membership e audit log.

## Plano de validacao

1. Revisar se toda entidade operacional tem tenant_id.
2. Revisar se API nunca aceita tenant_id do cliente sem validar host/membership.
3. Revisar se admin exige usuario autenticado e membership no tenant.
4. Revisar se audit_events cobre operacoes sensiveis.

## Criterios de aceite

- Documento define subdominio como fonte oficial de tenant.
- Schema inicial suporta tenants e dominios.
- Roadmap deixa claro caminho de migracao sem quebrar pilotos atuais.
