# Riscos Técnicos

> Atualizado em 2026-05-08.

## Críticos
- Controle de acesso admin com senha hardcoded no frontend (existência detectada).
- Endpoint de escrita (Apps Script) exposto no cliente (existência detectada).
- Processamento de PII (nome/telefone/CPF) sem backend próprio.
- Ações sensíveis (`reservation:confirm`, `block:create`, `config:update`) iniciadas do cliente.
- Exibição de PII em claro no painel admin.

## Altos
- Ausência total de testes automatizados.
- Ausência de CI/CD e de validações automáticas pré-deploy.
- Sem política formal de LGPD/retenção/minimização documentada no repositório.
- Acoplamento rígido a estrutura de planilha e chaves de configuração.
- Dependência operacional de publicação correta do Apps Script.

## Médios
- Observabilidade operacional insuficiente (sem trilha auditável).
- Fallback local em `localStorage` pode divergir de estado remoto.
- Dependência de CDNs externas para renderização ideal.

## Baixos
- `app.js` monolítico reduz legibilidade, mas o projeto é pequeno.

## Segredos e dados sensíveis
- Detectado: **sim** (existência registrada sem exposição de valores).
