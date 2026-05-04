# Inventário de Módulos Críticos

> Criado em 2026-04-27 durante a descoberta inicial.

## 1. Interface Pública de Reserva

- Arquivos: `index.html`, `styles.css`, `app.js`.
- Responsabilidade: exibir grade, abrir pré-reserva, coletar dados e iniciar pagamento.
- Dados sensíveis: nome, telefone, CPF.
- Risco: alto, por ser o principal fluxo de negócio e coletar PII.

### Auditoria Prompt 01 — Fluxo Público

Mapa real do fluxo:

1. `boot()` define `dateInput` com `getToday()`, popula selects admin, registra eventos e chama `loadAgenda()`.
2. `loadAgenda()` consulta `fetchSheetRows("reservas")` e `fetchSheetRows("bloqueios")`, filtra por `state.selectedDate` e chama `renderSchedule()`.
3. `renderSchedule()` monta botões por quadra/horário; apenas cards com status `available` recebem evento para `openPreBookingModal(court, time)`.
4. `openPreBookingModal()` define `state.selectedSlot`, atualiza título/valor e abre `#pre-booking-modal`.
5. `continueToBookingForm()` fecha pré-reserva, reseta `#booking-form`, volta ao passo de cadastro, injeta PIX/valor e abre `#booking-modal`.
6. `showPaymentStep()` usa `reportValidity()` para validar nome, telefone e CPF obrigatórios antes de exibir pagamento.
7. `updatePaymentView()` alterna instrução PIX/faturamento.
8. `submitBooking()` monta payload, define status `faturado` para faturamento ou `pendente` para PIX, checa conflito local por slot, chama `submitMutation("reservation:create")`, fecha modal e recarrega agenda.
9. `loadAgenda()` recarrega dados remotos e atualiza status visual.

Elementos DOM envolvidos:

- Grade/data/status: `#date-input`, `#status-banner`, `#schedule-grid`, `#refresh-button`.
- Pré-reserva: `#pre-booking-modal`, `#pre-booking-title`, `#pre-booking-amount`, `#continue-booking-button`.
- Formulário: `#booking-modal`, `#booking-form`, campos `name`, `phone`, `cpf`, radios `payment`, campo `observation`.
- Pagamento: `#pix-payment-box`, `#billing-payment-box`, `#pix-key`, `#pix-amount`.

Riscos por etapa:

- Seleção de data permite datas passadas.
- Slot disponível depende da agenda carregada e da checagem local; concorrência só é resolvida no webhook.
- CPF recebe máscara, mas não valida dígitos.
- Telefone é obrigatório, mas não possui validação de formato.
- Status `faturado` é decidido no cliente.
- Modal usa `overflow: visible`, o que pode prejudicar uso em telas pequenas se conteúdo ultrapassar a altura.

## 2. Motor de Agenda

- Arquivo: `app.js`.
- Funções principais: `loadAgenda()`, `fetchSheetRows()`, `renderSchedule()`, `getSlotState()`.
- Responsabilidade: ler reservas/bloqueios, normalizar dados e calcular status visual.
- Risco: alto, pois erro pode liberar horário ocupado ou bloquear horário livre.

## 3. Mutação de Reservas

- Arquivos: `app.js`, `google-sheets-template/apps-script.gs`.
- Funções principais: `submitBooking()`, `submitMutation()`, `appendReservation_()`.
- Responsabilidade: criar reserva com status derivado de pagamento.
- Risco: crítico, por tocar disponibilidade, PII e pagamento.

### Auditoria Prompt 01 — Observações

- Payload criado no cliente contém `data`, `quadra`, `horario`, `nome`, `telefone`, `cpf`, `status`, `pagamento`, `observacao`.
- `operationKey` reduz duplo clique/envio duplicado no mesmo cliente.
- Falha de envio exibe mensagem genérica e pede atualização da agenda.
- Sem validação client-side para impedir data passada antes de chamar `submitMutation()`.

## 4. Painel Admin

- Arquivo: `app.js`.
- Funções principais: `toggleAdminAccess()`, `renderAdminReservations()`, `confirmReservation()`, `submitBlock()`.
- Responsabilidade: confirmar PIX e bloquear horários.
- Risco: crítico, pois usa senha hardcoded e executa operações privilegiadas.

## 5. Apps Script / Camada Remota de Escrita

- Arquivo: `google-sheets-template/apps-script.gs`.
- Responsabilidade: validar payloads mínimos, bloquear conflitos, gravar/atualizar planilha.
- Risco: crítico, pois é a barreira real contra conflito e abuso.
- Observação: produção foi confirmada pelo usuário como equivalente ao script versionado.

### Auditoria Prompt 02 — Matriz de Contrato

| Action | Payload mínimo aceito | Validação no Apps Script | Efeito |
|--------|------------------------|---------------------------|--------|
| `reservation:create` | `data`, `quadra`, `horario`, `nome`, `telefone`, `cpf`; opcional `status`, `pagamento`, `observacao` | Campos mínimos não vazios; existência das abas; conflito com reserva; conflito com bloqueio | Append em `reservas` com 9 colunas |
| `reservation:confirm` | `data`, `quadra`, `horario`, `telefone` | Campos mínimos não vazios; existência da aba; busca reserva por data/quadra/horário/telefone | Atualiza coluna G/status para `confirmado` |
| `block:create` | `data`, `quadra`, `horario`; opcional `motivo` | Campos mínimos não vazios; existência das abas; conflito com reserva; conflito com bloqueio | Append em `bloqueios` com 4 colunas |

Controles confirmados:

- `LockService.getScriptLock().waitLock(10000)` serializa mutações e reduz risco de corrida.
- `findReservationRow_()` e `findBlockRow_()` buscam de baixo para cima e normalizam data/hora.
- Duplicidade de reserva no mesmo slot é recusada se telefone e CPF diferem.
- Duplicidade de reserva do mesmo cliente no mesmo slot retorna `ok: true` com `duplicate: true`.
- Duplicidade de bloqueio no mesmo slot retorna `ok: true` com `duplicate: true`.

Gaps do contrato:

- Não valida quadras contra lista fechada `BT1`, `BT2`, `TN1`, `TN2`.
- Não valida horários contra blocos `07:00` a `22:00`.
- Não valida status contra `pendente`, `confirmado`, `faturado`.
- Não valida pagamento contra `pix`, `faturamento`.
- Não bloqueia datas passadas no servidor.
- `reservation:confirm` pode confirmar uma reserva que esteja `faturado` se chamado diretamente.
- `block:create` não exige `motivo`, embora o HTML exija no formulário admin.

## 6. Google Sheets / Modelo de Dados

- Arquivos: `google-sheets-template/reservas.csv`, `google-sheets-template/bloqueios.csv`, documentação.
- Responsabilidade: persistência de reservas e bloqueios.
- Risco: alto, pois depende de ordem fixa de colunas e disponibilidade externa.

### Auditoria Prompt 02 — Ordem de Colunas

- `reservas`: A `data`, B `quadra`, C `horario`, D `nome`, E `telefone`, F `cpf`, G `status`, H `pagamento`, I `observacao`.
- `bloqueios`: A `data`, B `quadra`, C `horario`, D `motivo`.
- Frontend e Apps Script dependem da posição das colunas, não de cabeçalhos dinâmicos.

## 7. PWA e Cache

- Arquivos: `manifest.webmanifest`, `sw.js`, `icons/`.
- Responsabilidade: instalação mobile e cache offline.
- Risco: médio, pois cache incorreto pode servir versão antiga após correções.

## 8. Deploy e Domínio

- Arquivo: `CNAME`.
- Responsabilidade: domínio customizado em GitHub Pages.
- Risco: médio, pela ausência de pipeline/rollback documentado.

## 9. Templates de Provisionamento

- Pasta: `google-sheets-template/`.
- Responsabilidade: orientar criação de planilha e Apps Script.
- Risco: médio, pois divergências com produção podem gerar diagnóstico incorreto.
