# Mapa Mental Técnico

> Atualizado em 2026-05-26.

## Núcleo
Cliente web estático -> agenda -> pré-reserva -> cadastro -> pagamento -> webhook Apps Script -> Google Sheets.

## Módulos
- Reserva pública (`index.html` + `app.js`)
- Painel admin (`admin/index.html` + `app.js`)
- Configuração de cliente (`config/637.config.js`)
- Registry multi-cliente (`config/clients.js`)
- Loader de cliente (`config/config-loader.js`)
- Template de cliente (`config/_client-template.config.js`)
- Configuração dinâmica de negócio (aba `config` no Sheets)
- Bloqueios de horário/dia
- PWA/cache (`manifest.webmanifest`, `sw.js`, `instalar.html`)
- Planejamento SaaS (`SAAS-PLANEJAMENTO.md`, `NEXTJS-DB-ROADMAP.md`)

## Dependências externas
- Google Sheets (`reservas`, `bloqueios`, `config`)
- Google Apps Script (`reservation:create`, `reservation:confirm`, `block:create`, `config:update`)
- WhatsApp (`wa.me`)
- CDNs: Bootstrap e Google Fonts

## Acoplamentos críticos
- Ordem/nomes de colunas nas abas
- Contrato `{ action, payload }` do webhook
- IDs do DOM referenciados em `app.js`
- Versionamento de cache no `sw.js`

## Pontos de atenção
- Controle admin no cliente (senha hardcoded)
- Exposição de PII no fluxo/admin
- Ausência de testes automatizados e de CI/CD
- Modelo multi-cliente atual ainda e por arquivo/config, nao por backend multi-tenant.
- Next.js + PostgreSQL deve ser tratado como SaaS v1, nao como pre-requisito para demonstracao comercial.
