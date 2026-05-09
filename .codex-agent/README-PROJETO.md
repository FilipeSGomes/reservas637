# README Técnico Vivo do Projeto

> Atualizado em 2026-05-08.

## Resumo
Sistema estático de reserva de quadras da 637 Cervejaria em GitHub Pages, com persistência via Google Sheets (leitura `gviz/tq`) e Google Apps Script (escrita `POST`).

## Tecnologias detectadas
- HTML5: `index.html`, `admin/index.html`, `instalar.html`
- CSS3: `styles.css`
- JavaScript ES6+: `app.js`, `sw.js`, `config/637.config.js`
- Bootstrap 5.3.0 via CDN
- Google Fonts via CDN
- PWA: `manifest.webmanifest` + service worker
- Google Sheets + Apps Script

## Frameworks e versões
- Bootstrap `5.3.0`
- Sem npm, sem bundler, sem framework SPA

## Banco e ORM
- Banco: Google Sheets (`reservas`, `bloqueios`, `config`)
- ORM: não aplicável

## Entrypoints e execução
- Público: `index.html`
- Admin: `admin/index.html`
- Página de instalação: `instalar.html`
- Lógica principal: `app.js`
- Configuração de cliente: `config/637.config.js`

## Build, testes e execução
- Build: inexistente
- Testes automatizados: não detectados
- Scripts de execução local: não detectados

## CI/CD e deploy
- CI/CD: não detectado (`.github/workflows` ausente)
- Deploy: GitHub Pages com `CNAME` (`637.fisamtech.com`)

## Integrações externas
- Google Sheets público (leitura)
- Google Apps Script Web App (escrita)
- WhatsApp (`wa.me`)
- Bootstrap CDN
- Google Fonts CDN

## Configuração de ambiente
- Não há `.env` / `.env.example`
- Configuração operacional concentrada em `config/637.config.js` e na aba `config` do Sheets

## Sensibilidade de dados
- Coleta/processamento de PII: nome, telefone, CPF
- Painel admin exibe PII de reservas
- Existe fallback local (`localStorage`) para contingência

## Observabilidade
- Mensagens de UI + `console.error`
- Sem métricas, tracing, logs de auditoria centralizados
