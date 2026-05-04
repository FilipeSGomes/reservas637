# Gaps do Projeto

> Gap = ausência que representa risco ou limitação real.

## Técnicos

- Sem suíte automatizada para validar regras de reserva, bloqueios, status e parsing de Google Sheets.
- Sem script local documentado para servir a aplicação e validar PWA/service worker.
- Sem validação robusta de CPF/telefone.
- Sem tratamento explícito de CORS/erros específicos do Apps Script na documentação operacional.
- Sem garantia documentada de atualização do `CACHE_NAME` a cada deploy que altere assets.
- Bloqueio de reservas em datas passadas foi implementado no repositório; falta validar em navegador e publicar Apps Script em produção.
- Falta plano técnico para eventual ação posterior de reservas `faturado`.
- Falta validação de CPF por dígitos verificadores.
- Falta validação mínima de telefone.
- Apps Script não valida domínio fechado para quadra, horário, status e pagamento.
- Apps Script versionado valida regra de datas passadas em `reservation:create`; falta publicar em produção e testar fim a fim.
- Apps Script não exige `motivo` para bloqueios.
- Service worker não limita cache dinâmico por origem/tipo de recurso.
- Página `instalar.html` não registra service worker diretamente.
- Service worker não trata falha de rede com fallback explícito.

## Documentação

- README raiz contém links absolutos apontando para outro diretório/projeto.
- Instruções de referência citam `style.css` e `manifest.json`, mas o projeto usa `styles.css` e `manifest.webmanifest`.
- Não há documentação de rollback em GitHub Pages.
- Não há matriz de campos obrigatórios por action com exemplos de resposta do Apps Script.
- Não há documentação de variáveis/configurações por ambiente.
- Não há documentação das respostas possíveis do Apps Script (`created`, `duplicate`, `alreadyConfirmed`, erro).

## Testes

- Não há arquivos de teste detectados.
- Não há checklist com evidências para o fluxo completo reserva -> planilha -> admin.
- Não há teste de concorrência para duas reservas no mesmo horário.
- Não há teste documentado para cache/PWA após deploy.
- Não há teste manual documentado para reserva em data passada.
- Não há teste manual documentado para fluxo PIX vs faturamento.

## Segurança

- Sem política documentada para gestão da senha admin.
- Sem autenticação real ou autorização server-side descrita para ações admin.
- Sem política LGPD para coleta, uso, retenção e remoção de CPF/telefone.
- Sem mascaramento de CPF/telefone no painel admin.
- Sem limitação de taxa ou proteção antiabuso documentada para o webhook.
- Falta decisão explícita sobre manter, trocar ou ofuscar/hashear a senha admin no frontend.
- Sem inventário formal de finalidade/base legal/retenção para nome, telefone, CPF e observações.
- Sem separação entre dados necessários para operação pública e dados exibidos no painel admin.
- Sem orientação documentada para não usar dados pessoais reais em CSVs/templates.
- Sem política para limpeza ou anonimização de reservas antigas.

## Operação

- Sem monitoramento de falhas do Apps Script.
- Sem alertas para falha de escrita/leitura.
- Sem runbook para indisponibilidade do Google Sheets/Apps Script.
- Sem processo formal de backup/restauração da planilha além do histórico automático do Google Sheets.
- Sem procedimento definido de rollback para GitHub Pages.
- Sem checklist de suporte por navegador/dispositivo para Android, iOS, Chrome e Safari.
- Sem procedimento de resposta caso a senha admin ou URL de webhook sejam expostas/abusadas.
- Sem procedimento documentado para forçar atualização de PWA/cache em clientes já instalados.
- Sem ponto de rollback definido por commit/tag antes de publicação.

## Arquitetura

- `app.js` concentra configuração, estado, renderização, parsing, integrações e admin em um único arquivo.
- O frontend conhece diretamente detalhes da planilha e do webhook.
- Estado local e dados remotos compartilham fluxo, o que pode mascarar falhas de integração.

## Observabilidade

- Observabilidade limitada a `console.error` e banner de status.
- Sem trilha auditável de operações admin.
- Sem métricas de uso, falhas, latência ou taxa de conversão de reservas.
