# README Técnico Vivo do Projeto

> Atualizado em 2026-05-05.

## Resumo
Sistema estático de reserva de quadras da 637 Cervejaria, hospedado em GitHub Pages, com persistência via Google Sheets e Apps Script.

## Tecnologias detectadas
- HTML5 (`index.html`, `instalar.html`, `admin/index.html`)
- CSS3 (`styles.css`)
- JavaScript ES6+ (`app.js`, `sw.js`)
- Bootstrap 5.3.0 via CDN
- Google Fonts via CDN
- PWA (`manifest.webmanifest` + service worker)
- Google Sheets (`gviz/tq`) + Apps Script (`doPost`)

## Frameworks e versões
- Bootstrap `5.3.0` (CDN)
- Sem bundler, sem npm, sem framework SPA

## Banco e ORM
- Banco: Google Sheets (abas `reservas`, `bloqueios`, `config`)
- ORM: não aplicável

## Entrypoints e execução
- Público: `index.html`
- Instalação: `instalar.html`
- Admin: `admin/index.html`
- Lógica principal: `app.js`
- Cache/PWA: `sw.js`

## Build, teste e execução
- Build: inexistente
- Testes automatizados: não detectados
- Scripts de execução: não detectados

## CI/CD e deploy
- CI/CD: não detectado (`.github/` ausente)
- Deploy: GitHub Pages + `CNAME`

## Integrações externas
- Google Sheets público (leitura)
- Google Apps Script (escrita)
- WhatsApp link (`wa.me`) para comprovante PIX
- CDNs (Bootstrap e Google Fonts)

## Configuração de ambiente detectada
- Não há `.env*` detectado
- Configuração em `APP_CONFIG` no `app.js`

## Sensibilidade de dados
- Coleta/processa PII: nome, telefone, CPF
- Exposição de dados no admin (inclusive CPF em lista)

## Observabilidade
- Apenas mensagens de UI e `console.error`
- Sem métricas, tracing, logs centralizados ou auditoria
