# Decisões, Hipóteses e Perguntas

> Atualizado em 2026-05-05.

## Confirmado
- [CONFIRMADO] Stack atual é estática (HTML/CSS/JS) com Bootstrap CDN.
- [CONFIRMADO] Persistência operacional depende de Google Sheets + Apps Script.
- [CONFIRMADO] Não há CI/CD nem testes automatizados.
- [CONFIRMADO] Service worker atual usa `CACHE_NAME = app-637-v4`.
- [CONFIRMADO] Existe ação `config:update` no Apps Script versionado.

## Hipóteses
- [HIPÓTESE] Produção está sincronizada com a versão atual de `apps-script.gs`.
- [HIPÓTESE] Fallback local é usado apenas para desenvolvimento/homologação.

## Perguntas pendentes
- [PENDENTE] Qual política oficial de LGPD será adotada para CPF/telefone?
- [PENDENTE] Qual processo formal de rotação da senha admin?
- [PENDENTE] Qual procedimento de rollback em produção (GitHub Pages + Apps Script)?
- [PENDENTE] O painel admin pode mascarar CPF por padrão?
- [PENDENTE] Qual nível mínimo de testes manuais com evidência é obrigatório antes de deploy?

## Assunções proibidas
- Não assumir que validação client-side é suficiente para regras críticas.
- Não assumir que mudanças no Apps Script foram publicadas sem verificação operacional.
- Não assumir que cache PWA vai atualizar sem estratégia de versão.
- Não assumir que dados reais podem entrar em templates/documentação.

- [CONFIRMADO] Há falha de persistência de configurações `copy.*`: frontend envia `settings.copy`, mas `updateConfig_()` não grava os novos valores recebidos, mantendo apenas valores preexistentes.
- [CONFIRMADO] Há conflito de modelo de preço no admin: formulário `settingsForm` salva `pricingByCourt`, porém cálculo de preço da agenda/reserva usa `pricingConfig`; isso causa percepção de que alteração não refletiu.
- [PENDENTE] Definir decisão final: remover edição de `pricingByCourt` do admin, ou sincronizar explicitamente com `pricingConfig` mantendo regra única.
- [CONFIRMADO] Contrato 002 implementado: persistência de `copy.*` no Apps Script e aplicação de textos de billing no frontend corrigidas.
- [PENDENTE] Definir consolidação final entre `pricingByCourt` e `pricingConfig` para eliminar ambiguidade de configuração de preços no admin.
- [CONFIRMADO] Contrato 003 implementado: `pricingConfig` consolidado como fonte única de preço no admin/runtime; campos por quadra tornados informativos para evitar dupla edição.
- [CONFIRMADO] Contrato 004 implementado: agenda reorganizada em cards expansíveis por quadra sem alterar regras de preço, status, disponibilidade e fluxo de reserva.
- [CONFIRMADO] Contrato 005 implementado: overflow horizontal do campo de data tratado por CSS no contexto da toolbar, sem alterar regras de agenda/reserva.
