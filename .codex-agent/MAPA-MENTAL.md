# Mapa Mental Técnico

> Atualizado em 2026-05-08.

## Núcleo
Cliente web estático -> agenda -> pré-reserva -> cadastro -> pagamento -> webhook Apps Script -> Google Sheets.

## Módulos
- Reserva pública (`index.html` + `app.js`)
- Painel admin (`admin/index.html` + `app.js`)
- Configuração de cliente (`config/637.config.js`)
- Configuração dinâmica de negócio (aba `config` no Sheets)
- Bloqueios de horário/dia
- PWA/cache (`manifest.webmanifest`, `sw.js`, `instalar.html`)

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
