# Contrato 004 — Agenda por Quadra em Cards Expansíveis (Accordion)

## Status

PENDENTE DE APROVAÇÃO

## 1. Validação de Aderência do Pedido

Pedido **aderente** ao que estamos fazendo no projeto, pelos motivos:

1. Atua no frontend estático (`index.html`, `app.js`, `styles.css`), stack oficial do sistema.
2. Não exige backend novo nem biblioteca externa.
3. É uma melhoria de UX na grade da agenda sem alterar regra de negócio.
4. Pode ser implementado com alteração incremental e segura, preservando fluxo atual de reserva.
5. Está alinhado com requisito mobile-first e com preservação das integrações existentes (Sheets/Apps Script/PIX/WhatsApp).

Condições de aderência a manter durante execução:

- Não alterar `spreadsheetId`, `appsScriptWebhookUrl`, estrutura de abas e payloads.
- Não alterar cálculo de preço, regra de status e regra de disponibilidade.
- Não alterar fluxo de pré-reserva/pagamento já existente.

## 2. Objetivo

Transformar a seção “Agenda por quadra e horário” em cards por quadra com comportamento expansível (accordion), garantindo que os horários apareçam **apenas dentro do card da respectiva quadra**, com boa usabilidade em mobile e desktop.

## 3. Contexto Técnico Atual

- Render da agenda centralizado em `renderSchedule()` em `app.js`.
- Cada quadra hoje já tem estrutura de coluna/cabeçalho, porém percepção visual de separação entre card e horários.
- Estados de slot e clique de reserva já estão encapsulados em `getSlotState()` e `openPreBookingModal()`.

## 4. Escopo de Leitura Permitido

- `index.html`
- `app.js`
- `styles.css`
- `.codex-agent/README-PROJETO.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`
- `.codex-agent/DECISOES.md`

## 5. Escopo de Alteração Permitido

- `app.js`
- `styles.css`
- (Opcional, somente se necessário e mínimo) `index.html`
- `.codex-agent/CHANGELOG-AGENTE.md`
- `.codex-agent/DECISOES.md`
- `.codex-agent/RISCOS.md`
- `.codex-agent/GAPS.md`

## 6. Arquivos Proibidos

- `sw.js`
- `manifest.webmanifest`
- `admin/index.html` (exceto se surgir bloqueio técnico real, voltar para aprovação)
- `google-sheets-template/*`
- Qualquer arquivo de configuração sensível de integração

## 7. Classificação de Risco

Risco: **Médio**.

Justificativa:
- Toca renderização principal de agenda e interação de clique.
- Não toca persistência nem integração remota.
- Pode gerar regressão visual/UX se não houver teste manual em breakpoints.

## 8. Plano de Execução (mínima alteração segura)

1. Criar estado local em `app.js` para controlar expansão de cards por quadra (sem bibliotecas).
2. Ajustar `renderSchedule()` para construir estrutura `court-card` com:
   - cabeçalho clicável
   - resumo curto de disponibilidade/próximo horário
   - ícone expandir/recolher
   - corpo com lista de horários da quadra
3. Garantir que a lista de horários só renderize/mostre dentro do corpo do card da quadra.
4. Preservar comportamento dos botões de horário:
   - disponível clicável e abre pré-reserva
   - indisponível sem iniciar reserva
5. Ajustar `styles.css` para layout de card accordion responsivo:
   - 1 coluna mobile
   - até 2 colunas desktop
   - sem overflow horizontal
   - área tocável mínima (~44px)
6. Não alterar lógica de `getSlotState`, cálculo de preço, payloads e integrações.

## 9. Plano de Teste Manual Obrigatório

1. Abrir home e selecionar data com disponibilidade.
2. Verificar que todos os horários estão dentro de cards.
3. Expandir BT1 e validar horários internos.
4. Clicar horário disponível e confirmar abertura do modal de pré-reserva.
5. Fechar modal; recolher BT1; expandir BT2.
6. Validar status existentes (Disponível/Pendente/Confirmado/Bloqueado/Faturado e Aula quando houver).
7. Testar em 390px no DevTools e confirmar sem rolagem horizontal.
8. Testar em 768px e desktop.
9. Confirmar ausência de erro no console.

## 10. Plano de Rollback

1. Reverter commit dos arquivos alterados (`app.js`, `styles.css`, opcional `index.html`).
2. Publicar versão anterior.
3. Validar que grade e fluxo de reserva retornaram ao comportamento prévio.

## 11. Critérios de Aceite

1. Nenhum horário fora do card da quadra.
2. Card expande/recolhe por clique no cabeçalho.
3. Fluxo de pré-reserva permanece igual para horários disponíveis.
4. Horário indisponível não abre reserva.
5. Funciona em 390px, 768px e desktop sem overflow horizontal.
6. Regras de preço/status/disponibilidade permanecem inalteradas.
7. Sem erro no console.
