# Riscos Técnicos

> Classificação: Crítico | Alto | Médio | Baixo
> Atualizado em 2026-05-05.

## Críticos
- Senha de admin hardcoded no frontend (existência detectada).
- Endpoint de webhook Apps Script hardcoded no frontend (existência detectada).
- Coleta e processamento de CPF/telefone/nome (PII) sem camada de backend própria.
- Ações sensíveis disparadas do cliente para Apps Script público.
- Painel admin exibe PII em texto aberto.

## Altos
- Ausência de testes automatizados.
- Sem pipeline CI/CD e sem validação automática pré-deploy.
- Sem política formal de LGPD/retensão/anonimização de PII.
- Acoplamento forte com estrutura fixa da planilha.
- Service worker pode manter versões antigas se versionamento/cache não for controlado por processo.

## Médios
- Sem observabilidade operacional (métricas, logs de auditoria, alertas).
- Fallback local em navegador pode gerar comportamento divergente em troubleshooting.
- Dependência de CDNs externas para recursos de UI.

## Baixos
- Projeto monolítico em um único JS grande reduz velocidade de manutenção, mas é pequeno.

## Segredos e dados sensíveis
- Segredos/dados sensíveis detectados: **sim** (existência registrada; valores não registrados).

- Divergência entre configuração salva no admin e configuração efetivamente usada no runtime pode gerar preço/texto incorreto para cliente final.
