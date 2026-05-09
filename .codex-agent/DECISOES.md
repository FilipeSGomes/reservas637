# Decisões, Hipóteses e Perguntas

> Atualizado em 2026-05-08.

## Confirmado
- [CONFIRMADO] Stack é estática: HTML/CSS/JS + Bootstrap CDN + Google Fonts.
- [CONFIRMADO] Persistência principal depende de Google Sheets + Apps Script.
- [CONFIRMADO] Não há pipeline CI/CD nem testes automatizados no repositório.
- [CONFIRMADO] `sw.js` usa cache nomeado (`app-637-v5-config`).
- [CONFIRMADO] Existe fallback de dados em `localStorage` quando integração remota falha.

## Hipóteses
- [HIPÓTESE] Apps Script em produção está alinhado ao arquivo `google-sheets-template/apps-script.gs` atual.
- [HIPÓTESE] Configuração da aba `config` é considerada fonte operacional para textos/preços/contato no dia a dia.

## Perguntas pendentes
- [PENDENTE] Qual regra oficial prevalece para horário de funcionamento: 07h–22h (AGENTS) ou 06h–20h (`config/637.config.js`)?
- [PENDENTE] Qual documento oficial deve prevalecer para estrutura de arquivos (`style.css`/`manifest.json` vs `styles.css`/`manifest.webmanifest`)?
- [PENDENTE] Há requisito de mascaramento de CPF/telefone no painel admin?
- [PENDENTE] Qual política de retenção e descarte de PII será adotada?
- [PENDENTE] Qual fluxo oficial de rollback para incidentes de Apps Script?

## Assunções proibidas
- Não assumir que validação client-side é suficiente para regra crítica.
- Não assumir publicação de Apps Script sem evidência operacional.
- Não assumir que cache PWA vai invalidar corretamente sem processo.
- Não assumir que divergência documental é intencional; tratar como gap até decisão.
