# Riscos Técnicos

> Classificação: Crítico | Alto | Médio | Baixo
> Marcar como [HIPÓTESE] quando não confirmado.

## Críticos

- Segredos/configurações sensíveis hardcoded no frontend: senha admin, chave PIX e URL de webhook foram detectadas em `app.js`. Valores não registrados.
- Dados pessoais de clientes, incluindo CPF e telefone, são coletados, enviados ao Apps Script e exibidos no painel admin.
- Webhook de Apps Script é chamado diretamente pelo navegador. [HIPÓTESE] Se o endpoint estiver público sem validação server-side suficiente, pode permitir criação/alteração indevida de reservas por terceiros.
- Apps Script de produção aceita payloads diretos do navegador sem autenticação própria no contrato versionado.
- Painel admin renderiza dados pessoais completos de reservas, incluindo CPF e telefone, sem mascaramento.

## Altos

- Ausência de testes automatizados para fluxo de reserva, parsing de planilha, confirmação PIX e bloqueio.
- Senha admin no JavaScript não oferece proteção real contra usuários técnicos.
- Conflitos de reserva são checados no cliente antes do envio, mas dependem do Apps Script para consistência final.
- Service worker usa estratégia cache-first ampla e pode manter assets antigos após deploy se a versão do cache não for atualizada corretamente.
- Documentação atual contém caminhos de outro diretório/projeto, reduzindo confiabilidade operacional.
- Não há rollback definido para GitHub Pages.
- Não há backup periódico próprio além do histórico automático do Google Sheets.
- Bloqueio de reservas em datas passadas foi implementado no repositório, mas depende de publicação do Apps Script atualizado para proteção remota em produção.
- Status `faturado` é decidido no cliente antes de chegar ao webhook.
- Apps Script não valida lista permitida de quadras, horários, status ou pagamento.
- Apps Script versionado passou a bloquear datas passadas em `reservation:create`; risco permanece se produção não for republicada com a versão atual.
- `reservation:confirm` pode alterar para `confirmado` qualquer reserva encontrada por data/quadra/horário/telefone, mesmo se o status anterior for `faturado`, quando chamado diretamente.
- Service worker usa cache-first para todo GET, incluindo recursos externos e respostas com `cacheBust`, gerando risco de cache crescente e comportamento difícil de diagnosticar.
- `instalar.html` não carrega `app.js`; se for a primeira página aberta, o service worker não é registrado por essa página.

## Médios

- Divergência entre instruções do projeto e implementação real: arquivos esperados como `style.css`/`manifest.json` não correspondem a `styles.css`/`manifest.webmanifest`.
- Uso de `localStorage` como fallback para reservas/bloqueios em caso de ausência de configuração pode confundir validações se usado fora de ambiente local.
- Dependência de CDNs externos para Bootstrap e fontes pode afetar disponibilidade/performance.
- Não há validação formal de CPF/telefone além de preenchimento/formatação parcial.
- Não há registro auditável de ações admin no frontend.
- Reservas `faturado` exigem ação posterior confirmada, mas a funcionalidade será adiada; isso pode gerar controle operacional manual fora do sistema.
- Modal de reserva possui `max-height`, mas `.modal` usa `overflow: visible`; em telas pequenas, conteúdo pode ficar difícil de acessar se teclado virtual reduzir a área útil.

## Baixos

- Não há bundler/build; simplicidade reduz complexidade, mas aumenta acoplamento manual entre HTML, CSS e JS.
- Uso de `dialog` nativo pode exigir validação de compatibilidade em navegadores móveis antigos.
- `block:create` aceita motivo vazio no Apps Script, embora o formulário HTML exija motivo.
- Service worker não usa `skipWaiting()`/`clients.claim()`, então atualização pode depender de ciclo de fechamento/reabertura do navegador.
- Bootstrap e Google Fonts não estão no app shell; experiência offline completa não é garantida.

## Riscos que Bloqueiam Qualquer Alteração

- Qualquer alteração em `app.js` que toque configuração, payloads, nomes de abas ou actions deve ter contrato aprovado e plano de teste fim a fim.
- Qualquer alteração em dados pessoais, pagamento ou admin deve tratar LGPD/segurança como escopo explícito.
- Não alterar `spreadsheetId`, URL de Apps Script nem estrutura das abas sem decisão humana explícita e contrato aprovado.
- Como a URL de Apps Script é produção, qualquer mudança no contrato frontend/webhook deve prever versionamento, teste e rollback manual.

## Riscos de Segredos e Dados Sensíveis

- Detectada existência de senha hardcoded no frontend.
- Detectada existência de URL de webhook hardcoded.
- Detectada existência de chave PIX hardcoded.
- Detectada coleta e exposição de CPF/telefone/nome no fluxo e painel admin.
- Detectados dados pessoais fictícios nos CSVs de exemplo.
- Detectada presença de identificador de planilha no frontend.
- Detectada documentação com exemplo de payload contendo campos de dados pessoais.

### Inventário por Fluxo — Prompt 03

| Fluxo | Dados/configurações expostos | Classificação |
|-------|------------------------------|---------------|
| Configuração frontend | Identificador de planilha, URL de webhook, senha admin, chave PIX | Crítico |
| Reserva pública | Nome, telefone, CPF, forma de pagamento, observação | Crítico |
| Envio ao Apps Script | Payload completo de reserva/bloqueio/confirmação | Crítico |
| Painel admin | Nome, telefone, CPF, pagamento, observação e status | Crítico |
| Templates/README | Dados fictícios e exemplos de payload com PII | Médio |
| Fallback local | Pode persistir reservas/bloqueios no navegador quando webhook não está configurado | Alto se usado fora de desenvolvimento |

Controles mínimos recomendados:

- Formalizar política padrão de LGPD antes de ampliar coleta/exibição.
- Mascarar CPF/telefone no painel quando exibição completa não for necessária.
- Validar regras críticas no Apps Script, não apenas no frontend.
- Reduzir exposição da senha admin no cliente quando possível, sabendo que isso não equivale a autenticação forte.
- Documentar que dados de exemplo devem permanecer fictícios.
- Evitar usar fallback local em produção para dados reais.

Nenhum valor sensível foi registrado nesta memória.
