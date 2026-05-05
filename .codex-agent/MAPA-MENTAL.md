# Mapa Mental Técnico

> Atualizado em 2026-05-05.

## Núcleo do sistema
Cliente web estático -> agenda -> pré-reserva -> cadastro -> pagamento -> webhook Apps Script -> Google Sheets.

## Fluxos principais
- Reserva pública (`index.html` + `app.js`)
- Administração (`/admin/` + `app.js`)
- Configuração dinâmica (aba `config`)
- Bloqueios de quadra (faixa e dia inteiro)
- Confirmação PIX
- PWA/cache (`sw.js`)

## Dependências externas
- Google Sheets (`reservas`, `bloqueios`, `config`)
- Apps Script Web App (`doPost`)
- WhatsApp (`wa.me`)
- Bootstrap CDN
- Google Fonts CDN

## Acoplamentos críticos
- Ordem das colunas nas abas
- Nomes de actions do webhook
- IDs do DOM usados por `app.js`
- Estratégia/versionamento do service worker

## Pontos de risco
- Segredos e endpoints no frontend
- Validações críticas distribuídas entre cliente e Apps Script
- Ausência de testes automatizados
